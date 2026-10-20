import type { MetaEventName, MetaItem } from "./meta-policy";

export type MetaCapiInput = { event_name: MetaEventName; event_id: string; event_time: number;
  event_source_url: string; locale: "th" | "en"; items: MetaItem[];
  client_user_agent: string; fbp?: string; fbc?: string };
export type MetaCapiConfig = { pixelId?: string; token?: string; testCode?: string };
export type MetaCapiResult = { http_status: number; events_received: number | null; messages: string[];
  fbtrace_id: string; error_code: number | null; error_subcode: number | null; error_message: string };

// Shared server transport only. The public route still owns production schema/Lead receipts.
// The CLI may test transport with test_meta_ IDs, but never enters RFQ/business eligibility.
export async function sendMetaCapi(input: MetaCapiInput, config: MetaCapiConfig, fetcher: typeof fetch): Promise<MetaCapiResult> {
  if (!config.pixelId || !/^\d+$/.test(config.pixelId) || !config.token || !config.testCode || !/^[A-Za-z0-9_-]{1,80}$/.test(config.testCode)) throw Error("Meta Test Events configuration required");
  if (!["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Lead"].includes(input.event_name)) throw Error("Unsupported Meta event");
  const source = new URL(input.event_source_url);
  if (source.origin !== "https://www.mrtsupplier.com" || source.search || source.hash || source.username || source.password) throw Error("Unsafe Meta source URL");
  const userData: { client_user_agent: string; fbp?: string; fbc?: string } = { client_user_agent: input.client_user_agent };
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  const payload = { data: [{ event_name: input.event_name, event_id: input.event_id, event_time: input.event_time,
    action_source: "website", event_source_url: source.origin + source.pathname, user_data: userData,
    custom_data: { locale: input.locale, content_ids: input.items.map(item => item.product_id),
      contents: input.items.map(item => ({ id: item.product_id, quantity: item.quantity })),
      content_type: "product", item_count: input.items.length } }], test_event_code: config.testCode };
  const response = await fetcher(`https://graph.facebook.com/v25.0/${config.pixelId}/events`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
    body: JSON.stringify(payload), redirect: "error", cache: "no-store", signal: AbortSignal.timeout(5000) });
  const data: unknown = await response.json().catch(() => ({}));
  const record = data && typeof data === "object" ? data as Record<string, unknown> : {};
  const error = record.error && typeof record.error === "object" ? record.error as Record<string, unknown> : {};
  const redact = (value: unknown) => typeof value === "string" ? value.split(config.token!).join("[REDACTED_TOKEN]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]").slice(0, 3000) : "";
  return { http_status: response.status, events_received: typeof record.events_received === "number" ? record.events_received : null,
    messages: Array.isArray(record.messages) ? record.messages.map(redact) : [], fbtrace_id: redact(record.fbtrace_id ?? error.fbtrace_id),
    error_code: typeof error.code === "number" ? error.code : null, error_subcode: typeof error.error_subcode === "number" ? error.error_subcode : null,
    error_message: [error.message, error.error_user_title, error.error_user_msg].map(redact).filter(Boolean).join("\n") };
}
