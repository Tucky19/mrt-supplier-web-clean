import assert from 'node:assert/strict';
import { POST as quote } from '../app/api/quote/route';
import { POST as submit } from '../app/api/rfq/submit/route';
import { POST as rfq } from '../app/api/rfq/route';
import { prisma } from '../lib/db';

async function main() {
  assert.equal(quote, submit, 'Both endpoints must use exactly the same handler');
  assert.equal(rfq, submit, 'The frontend RFQ alias must share the handler');
  const counts = new Map<string, number>();
  let databaseCalls = 0;
  const originalUpsert = prisma.rfqRateLimit.upsert;
  const originalFetch = globalThis.fetch;
  const originalFindMany = prisma.rfq.findMany;
  const originalCreate = prisma.rfq.create;
  const originalEnv = { ...process.env };
  let downstreamCalls = 0;
  const forbidDownstream = async () => {
    downstreamCalls++;
    throw new Error('Unexpected RFQ database access');
  };
  // No persistence means the handler cannot reach email, LINE or lead receipts.
  prisma.rfq.findMany = forbidDownstream as typeof originalFindMany;
  prisma.rfq.create = forbidDownstream as typeof originalCreate;
  // Invalid payloads reach rate limiting but never persistence/notifications.
  prisma.rfqRateLimit.upsert = (async (args: { create: { ipHash: string } }) => {
    databaseCalls++;
    const key = args.create.ipHash;
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);
    return { count };
  }) as typeof originalUpsert;
  globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
  const request = (ip: string, body = '{}') => new Request('https://example.invalid/api/quote', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'x-mrt-trace-id': 'rfq-safety-test' }, body,
  });
  try {
    process.env.VERCEL_ENV = 'production';
    process.env.RFQ_RATE_LIMIT_MAX = '2';
    process.env.RFQ_RATE_LIMIT_WINDOW_MIN = '60';
    delete process.env.RFQ_DEV_MOCK_BYPASS;
    assert.equal((await quote(request('192.0.2.1', '{'))).status, 400);
    assert.equal(databaseCalls, 0);
    assert.equal((await quote(request('192.0.2.1'))).status, 400);
    assert.equal((await quote(request('192.0.2.1'))).status, 400);
    const limited = await submit(request('192.0.2.1'));
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('retry-after'), '3600');
    assert.equal(limited.headers.get('x-mrt-trace-id'), 'rfq-safety-test');
    assert.equal((await quote(request('192.0.2.2'))).status, 400);
    assert.equal(counts.size, 2, 'Different clients need separate rate-limit buckets');
    const healthyUpsert = prisma.rfqRateLimit.upsert;
    prisma.rfqRateLimit.upsert = (async () => {
      databaseCalls++;
      throw new Error('Simulated quota storage outage');
    }) as typeof originalUpsert;
    const validBody = JSON.stringify({
      customer: { email: 'rfq-test@example.invalid' },
      items: [{ productId: 'test-only', partNo: 'TEST-ONLY', qty: 1 }],
    });
    // Serial and concurrent attempts through all aliases must stop before RFQ work.
    for (const concurrent of [false, true]) {
      const attempts = Array.from({ length: 6 }, (_, i) => async () => {
        const blocked = await [quote, submit, rfq][i % 3](request('192.0.2.9', validBody));
        assert.equal(blocked.status, 503);
        assert.equal(blocked.headers.get('retry-after'), '60');
        assert.equal(blocked.headers.get('cache-control'), 'no-store');
        assert.equal(blocked.headers.get('x-mrt-trace-id'), 'rfq-safety-test');
        const body = await blocked.json();
        assert.equal(body.ok, false);
        assert.equal(body.code, 'RFQ_RATE_LIMIT_UNAVAILABLE');
        assert.equal(body.requestId, undefined);
        assert.equal(body.measurement, undefined);
      });
      if (concurrent) await Promise.all(attempts.map(run => run()));
      else for (const run of attempts) await run();
    }
    assert.equal(downstreamCalls, 0);
    const beforeHoneypot = databaseCalls;
    for (const handler of [quote, submit, rfq]) {
      const caught = await handler(request('192.0.2.9', JSON.stringify({ customer: { website: 'bot' } })));
      assert.equal(caught.status, 200);
      assert.equal((await caught.json()).requestId, 'OK');
    }
    assert.equal(databaseCalls, beforeHoneypot);
    process.env.VERCEL_ENV = 'preview';
    const before = databaseCalls;
    for (const handler of [quote, submit, rfq]) {
      for (const body of ['{}', '{', JSON.stringify({ customer: { website: 'bot' } })]) {
        const blocked = await handler(request('192.0.2.3', body));
        assert.equal(blocked.status, 503);
        assert.equal((await blocked.json()).code, 'PREVIEW_RFQ_DISABLED');
        assert.equal(blocked.headers.get('cache-control'), 'no-store');
      }
    }
    assert.equal(databaseCalls, before, 'Preview must not even consume a database rate-limit record');
    prisma.rfqRateLimit.upsert = healthyUpsert;
    process.env.VERCEL_ENV = 'production';
    // Recovery resumes validation (400), then the original healthy quota (429).
    assert.equal((await quote(request('192.0.2.10'))).status, 400);
    assert.equal((await rfq(request('192.0.2.10'))).status, 400);
    assert.equal((await submit(request('192.0.2.10'))).status, 429);
    assert.equal(downstreamCalls, 0);
    console.log('PASS: quota outage serial/concurrent 503, no downstream calls, honeypot, Preview and recovery');
    console.log('PASS: separate client buckets, shared endpoint limit, Retry-After/trace, invalid JSON, Preview fail-closed; database mocked, no network');
  } finally {
    prisma.rfqRateLimit.upsert = originalUpsert;
    prisma.rfq.findMany = originalFindMany;
    prisma.rfq.create = originalCreate;
    for (const key of ['VERCEL_ENV', 'RFQ_RATE_LIMIT_MAX', 'RFQ_RATE_LIMIT_WINDOW_MIN', 'RFQ_DEV_MOCK_BYPASS']) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    globalThis.fetch = originalFetch;
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
