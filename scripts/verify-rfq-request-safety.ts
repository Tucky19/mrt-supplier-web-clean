import assert from 'node:assert/strict';
import { POST as quote } from '../app/api/quote/route';
import { POST as submit } from '../app/api/rfq/submit/route';
import { prisma } from '../lib/db';

async function main() {
  assert.equal(quote, submit, 'Both endpoints must use exactly the same handler');
  const counts = new Map<string, number>();
  let databaseCalls = 0;
  const originalUpsert = prisma.rfqRateLimit.upsert;
  const originalFetch = globalThis.fetch;
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
    process.env.VERCEL_ENV = 'preview';
    const before = databaseCalls;
    for (const handler of [quote, submit]) {
      for (const body of ['{}', '{', JSON.stringify({ customer: { website: 'bot' } })]) {
        const blocked = await handler(request('192.0.2.3', body));
        assert.equal(blocked.status, 503);
        assert.equal((await blocked.json()).code, 'PREVIEW_RFQ_DISABLED');
        assert.equal(blocked.headers.get('cache-control'), 'no-store');
      }
    }
    assert.equal(databaseCalls, before, 'Preview must not even consume a database rate-limit record');
    console.log('PASS: separate client buckets, shared endpoint limit, Retry-After/trace, invalid JSON, Preview fail-closed; database mocked, no network');
  } finally {
    prisma.rfqRateLimit.upsert = originalUpsert;
    globalThis.fetch = originalFetch;
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
