import { safeId } from "./contract";
import { META_CONSENT_EVENT, publicMetaProduct, sanitizeMetaUrl, validMetaClickId,
  validMetaIdentifier, validateMetaEnvelope, type MetaEnvelope, type MetaEventName, type MetaItem } from "./meta-policy";

export { META_CONSENT_EVENT };
type Params = Record<string, unknown>;
let currentRoute = "";
let lastPage = "";
let clickIdentity: { clickId: string; fbc: string } | undefined;
const sent = new Set<string>();
function accepted() {
  try { return typeof window !== "undefined" && localStorage.getItem("mrt_cookie_consent") === "accepted"; }
  catch { return false; }
}
// Do not read UA/cookies/fbclid before marketing consent. No cookies are created here.
function advertisingIdentifiers() {
  const result: { fbp?: string; fbc?: string } = {};
  if (!accepted()) return result;
  try {
    for (const entry of document.cookie.split(";")) {
      const [name, ...rest] = entry.trim().split("=");
      const value = rest.join("=");
      if (name === "_fbp" && validMetaIdentifier(value, "fbp")) result.fbp = value;
      if (name === "_fbc" && validMetaIdentifier(value, "fbc")) result.fbc = value;
    }
    const clickId = new URL(window.location.href).searchParams.get("fbclid");
    if (validMetaClickId(clickId)) {
      if (result.fbc?.endsWith(`.${clickId}`)) return result;
      if (clickIdentity?.clickId !== clickId) clickIdentity = { clickId, fbc: `fb.1.${Date.now()}.${clickId}` };
      result.fbc = clickIdentity.fbc; // Current document memory only; never localStorage/logs.
    } else if (!result.fbc && clickIdentity) result.fbc = clickIdentity.fbc;
  } catch { /* unavailable cookies/URL: send no advertising identifiers */ }
  return result;
}
function send(eventName: MetaEventName, items: MetaItem[] = [], key = "", receipt?: string) {
  if (!accepted() || (key && sent.has(key))) return false;
  const origin = window.location.origin;
  const url = sanitizeMetaUrl(window.location.href, origin);
  if (!url) return false;
  try {
    const event: MetaEnvelope = { consent: "accepted", event_name: eventName,
      event_id: eventName === "Lead" && receipt ? receipt.split(".")[0] : `meta:${crypto.randomUUID()}`,
      event_time: Math.floor(Date.now() / 1000), event_source_url: url,
      locale: new URL(url).pathname.startsWith("/en") ? "en" : "th", items };
    const identifiers = advertisingIdentifiers();
    if (identifiers.fbp) event.fbp = identifiers.fbp;
    if (identifiers.fbc) event.fbc = identifiers.fbc;
    if (receipt) event.lead_receipt = receipt;
    if (!validateMetaEnvelope(event, origin)) return false;
    const request = fetch("/api/analytics/meta", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify(event), keepalive: true });
    void request.catch(() => undefined); // Never retry or block the business flow.
    if (key) sent.add(key);
    return true; // Attempted first-party transport, not proof of Meta acceptance.
  } catch { return false; }
}
export function metaPageView(route: string) {
  currentRoute = route;
  if (!accepted()) return;
  const url = sanitizeMetaUrl(window.location.href, window.location.origin);
  if (!url || lastPage === url) return;
  if (send("PageView")) lastPage = url;
}
export function syncMetaConsent() {
  if (!accepted()) { clickIdentity = undefined; return; }
  // Only the current page; never replay pre-consent business events or navigation history.
  if (currentRoute) metaPageView(currentRoute);
}
export function dispatchMetaBusinessEvent(event: string, cleaned: Params, confirmedRfq = false, receipt?: string) {
  if (!accepted()) return false;
  const names: Record<string, MetaEventName> = { view_item: "ViewContent", add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout", generate_lead: "Lead" };
  const name = names[event];
  if (!name) return false; // Search and Contact intentionally excluded from v1 allowlist.
  const requestId = safeId(cleaned.request_id);
  if (name === "Lead" && (!confirmedRfq || !requestId?.startsWith("RFQ-") || /TEST|MOCK|SYNTHETIC/.test(requestId) || !receipt)) return false;
  const ecommerce = cleaned.ecommerce as { items?: Params[] } | undefined;
  const items = (ecommerce?.items ?? []).flatMap(item => {
    const product = publicMetaProduct(item.item_id);
    if (!product) return [];
    const quantity = typeof item.quantity === "number" && Number.isFinite(item.quantity) ? Math.min(999, Math.max(1, Math.floor(item.quantity))) : 1;
    return [{ product_id: product.partNo, quantity }];
  }).slice(0, 30);
  return send(name, items, name === "Lead" ? `lead:${requestId}` : String(cleaned.event_id ?? ""), receipt);
}
