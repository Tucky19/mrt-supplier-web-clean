import assert from "node:assert/strict";
import { POST as quote } from "../app/api/quote/route";
import { POST as meta } from "../app/api/analytics/meta/route";

// Run in a dedicated process: all credentials below are nonfunctional fixtures.
async function main() {
  const base = process.argv[2];
  if (base) {
    const expectTracking = process.argv[3] === "tracking";
    for (const locale of ["th", "en"]) {
      const response = await fetch(`${base}/${locale}/products/W%20962%2F14`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.equal(html.includes("gtm-head"), expectTracking, `${locale}: GTM script`);
      assert.equal(html.includes("https://www.googletagmanager.com/ns.html?id=GTM-5FB498FW"), expectTracking, `${locale}: GTM iframe`);
      assert.equal(html.includes("google-consent-defaults"), expectTracking, `${locale}: tracking bootstrap`);
    }
    if (!expectTracking) {
      const blocked = await fetch(`${base}/api/quote`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: { website: "synthetic-bot" } }),
      });
      assert.equal(blocked.status, 503);
      assert.equal((await blocked.json()).code, "PREVIEW_RFQ_DISABLED");
      const invalid = await fetch(`${base}/api/quote`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{",
      });
      assert.equal(invalid.status, 503);
      const disabledMeta = await fetch(`${base}/api/analytics/meta`, {
        method: "POST", headers: { "Content-Type": "application/json", origin: base },
        body: JSON.stringify({ consent: "accepted", event_name: "PageView",
          event_id: `meta:${crypto.randomUUID()}`, event_time: Math.floor(Date.now() / 1000),
          event_source_url: `${base}/th`, locale: "th", items: [] }),
      });
      assert.equal(disabledMeta.status, 204);
    }
    console.log(`PASS: built HTML tracking ${expectTracking ? "retained" : "omitted"} in both locales`);
  }
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.NEXT_PUBLIC_SITE_URL = "https://production.example.invalid";
  process.env.META_PIXEL_ID = "123456789";
  process.env.META_CONVERSIONS_API_TOKEN = "nonfunctional-test-token";
  delete process.env.META_TEST_EVENT_CODE;
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = async (input) => {
    calls.push(String(input));
    return Response.json({ ok: true, events_received: 1 });
  };
  const quoteRequest = (body: string) => new Request("https://preview.example.invalid/api/quote", {
    method: "POST", headers: { "Content-Type": "application/json" }, body,
  });
  const metaRequest = () => new Request("https://preview.example.invalid/api/analytics/meta", {
    method: "POST", headers: { "Content-Type": "application/json", origin: "https://preview.example.invalid",
      "user-agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36" },
    body: JSON.stringify({ consent: "accepted", event_name: "PageView",
      event_id: `meta:${crypto.randomUUID()}`, event_time: Math.floor(Date.now() / 1000),
      event_source_url: "https://preview.example.invalid/th", locale: "th", items: [] }),
  });
  try {
    process.env.VERCEL_ENV = "preview";
    assert.equal((await quote(quoteRequest("{"))).status, 503);
    // Every Preview payload must be rejected before database or notification work.
    process.env.RFQ_HONEYPOT_FIELD = "website";
    const local = await quote(quoteRequest(JSON.stringify({ customer: { website: "synthetic-bot" } })));
    assert.equal(local.status, 503);
    assert.equal((await local.json()).code, "PREVIEW_RFQ_DISABLED");
    assert.equal((await meta(metaRequest())).status, 204);
    assert.deepEqual(calls, [], "Preview must not forward or transmit to Meta, even with configured fixtures");

    for (const environment of ["production", "development"]) {
      process.env.VERCEL_ENV = environment;
      const before: number = calls.length;
      assert.equal((await quote(quoteRequest(JSON.stringify({ customer: { website: "synthetic-bot" } })))).status, 200);
      assert.equal(calls.length, before, "Quote must not make an HTTP forwarding request");
      assert.equal((await meta(metaRequest())).status, 200);
      assert.equal(calls[before], "https://graph.facebook.com/v25.0/123456789/events");
    }
    console.log("PASS: Preview RFQ blocked and Meta disabled; non-Preview local RFQ and Meta transport preserved (all network mocked)");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
