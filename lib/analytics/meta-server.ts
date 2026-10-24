import { normalizeMetaConfig, sendMetaCapi } from "./meta-capi";
import { META_MAX_BYTES, validateMetaEnvelope } from "./meta-policy";
import { verifyMetaLeadReceipt } from "./meta-lead";

type Config = { pixelId?: string; token?: string; testCode?: string };
type Dependencies = { config: () => Config; fetch: typeof fetch; now?: () => number };
const canonicalOrigin = "https://www.mrtsupplier.com";
function safeUserAgent(value: string | null): value is string {
  return !!value && value.length <= 512 && value.startsWith("Mozilla/5.0 ") &&
    /(?:AppleWebKit|Firefox|Chrome|Safari)\//.test(value) && !/[@\r\n<>]|https?:|email|phone|password|authorization|bearer|line_id|company|notes/i.test(value);
}
function json(status: number, code: string) {
  return Response.json({ code }, { status, headers: { "Cache-Control": "no-store" } });
}
// Per-instance bounds only. Meta event_id remains the cross-instance deduplication key.
export function createMetaHandler(deps: Dependencies) {
  const seen = new Map<string, number>();
  const inFlight = new Set<string>();
  let windowStart = 0, count = 0, halted = false;
  return async function POST(req: Request) {
    const now = deps.now?.() ?? Date.now();
    const origin = new URL(req.url).origin;
    if (req.headers.get("origin") !== origin || (req.headers.get("sec-fetch-site") && req.headers.get("sec-fetch-site") !== "same-origin")) return json(403, "same_origin_required");
    if (!/^application\/json(?:\s*;.*)?$/i.test(req.headers.get("content-type") ?? "")) return json(415, "json_required");
    const length = req.headers.get("content-length");
    if (length && (!/^\d+$/.test(length) || Number(length) > META_MAX_BYTES)) return json(413, "payload_too_large");
    if (now - windowStart >= 60_000) { windowStart = now; count = 0; }
    if (++count > 120) return json(429, "rate_limited");
    let raw: unknown;
    // Bound actual streamed bytes, including requests without Content-Length.
    try {
      const reader = req.body?.getReader();
      if (!reader) return json(400, "invalid_event");
      const decoder = new TextDecoder("utf-8", { fatal: true });
      let bytes = 0, text = "";
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > META_MAX_BYTES) { await reader.cancel(); return json(413, "payload_too_large"); }
        text += decoder.decode(chunk.value, { stream: true });
      }
      text += decoder.decode();
      raw = JSON.parse(text);
    } catch { return json(400, "invalid_event"); }
    const event = validateMetaEnvelope(raw, origin, now);
    if (!event) return json(400, "invalid_event");
    const config = normalizeMetaConfig(deps.config());
    if (!config) return new Response(null, { status: 204 });
    if (halted) return json(503, "meta_privacy_review_required");
    if (event.event_name === "Lead" && !verifyMetaLeadReceipt(event.lead_receipt ?? "", event.event_id, config.token, now)) return json(403, "invalid_lead_receipt");
    // Read device data only after the consented event passed strict validation.
    const userAgent = req.headers.get("user-agent");
    if (!safeUserAgent(userAgent)) return json(400, "invalid_device_data");
    for (const [key, expires] of seen) if (expires < now) seen.delete(key);
    const key = `${event.event_name}:${event.event_id}`;
    if (seen.has(key) || inFlight.has(key)) return json(200, "duplicate_ignored");
    if (seen.size + inFlight.size >= 5000) return json(429, "capacity_reached");
    inFlight.add(key);
    try {
      const result = await sendMetaCapi({ event_name: event.event_name, event_id: event.event_id,
        event_time: event.event_time, event_source_url: `${canonicalOrigin}${new URL(event.event_source_url).pathname}`,
        locale: event.locale, items: event.items, client_user_agent: userAgent, fbp: event.fbp, fbc: event.fbc }, config, deps.fetch);
      if (result.http_status < 200 || result.http_status >= 300) {
        if (result.http_status >= 400 && result.http_status < 500) halted = true;
        return json(502, "meta_rejected_review_required");
      }
      if (result.events_received !== 1) return json(502, "meta_unconfirmed");
      seen.set(key, now + 600_000);
      return json(200, "event_accepted");
    } catch { return json(502, "meta_unavailable"); }
    finally { inFlight.delete(key); }
  };
}
