import { safeId, safeSearchTerm } from "./contract";

export const META_CONSENT_EVENT = "mrt:cookie-consent";
type Params = Record<string, unknown>;
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: Pixel;
  loaded?: boolean;
  version?: string;
  disablePushState?: boolean;
};
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }

let initialized = false;
let scriptStarted = false;
let scriptReady = false;
let blocked = false;
let lastPage = "";
let currentRoute = "";
const sent = new Set<string>();
const pending: { event: string; params: Params; key: string }[] = [];

function pixelId() { return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || ""; }
function accepted() {
  try { return localStorage.getItem("mrt_cookie_consent") === "accepted"; }
  catch { return false; }
}

// The SDK reads document URL/referrer itself. Do not rely on custom params to hide them.
// Query-bearing ad/search landings fail closed until a separate URL privacy review.
function publicUrl(value: string) {
  if (!value) return true;
  try {
    const u = new URL(value, window.location.origin);
    if (u.origin !== window.location.origin || u.search || u.hash) return false;
    const path = decodeURIComponent(u.pathname);
    if (/^\/(th|en)\/?$/.test(path) || /^\/(th|en)\/(products|quote)\/?$/.test(path)) return true;
    const match = path.match(/^\/(th|en)\/products\/(.+)$/);
    return !!match && !!safeSearchTerm(match[2]);
  } catch { return false; }
}
function eligible() {
  return typeof window !== "undefined" && !!pixelId() && accepted() &&
    publicUrl(window.location.href) && publicUrl(document.referrer);
}
function context(): Params {
  const segments = window.location.pathname.split("/").filter(Boolean);
  return { locale: segments[0] === "en" ? "en" : "th",
    page_section: segments[1] === "products" ? "products" : segments[1] === "quote" ? "quote" : "home" };
}
function send(event: string, params: Params, key: string) {
  if (!eligible() || !scriptReady || !window.fbq || blocked) return false;
  if (key && sent.has(key)) return false;
  try {
    if (!initialized) {
      window.fbq.disablePushState = true;
      window.fbq("set", "autoConfig", false, pixelId());
      window.fbq("init", pixelId()); // No Advanced Matching/customer properties.
      initialized = true;
    }
    window.fbq("consent", "grant");
    window.fbq("trackSingle", pixelId(), event, params);
    if (key) sent.add(key);
    return true;
  } catch { return false; }
}
function flush() {
  if (!eligible()) { pending.length = 0; return; }
  for (const row of pending.splice(0)) send(row.event, row.params, row.key);
}
function enqueue(event: string, params: Params, key = "") {
  if (!eligible() || blocked || (key && (sent.has(key) || pending.some(x => x.key === key)))) return false;
  if (scriptReady) return send(event, params, key);
  if (pending.length < 50) pending.push({ event, params, key });
  if (!scriptStarted) {
    scriptStarted = true;
    if (window.fbq) { blocked = true; pending.length = 0; return false; } // Avoid unknown second integration.
    const fbq: Pixel = Object.assign(function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args);
    }, { queue: [] as unknown[][], loaded: true, version: "2.0", disablePushState: true });
    fbq.push = fbq;
    window.fbq = fbq; window._fbq = fbq;
    const script = document.createElement("script");
    script.id = "mrt-meta-pixel"; script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.referrerPolicy = "no-referrer";
    script.onload = () => { scriptReady = true; flush(); };
    script.onerror = () => { blocked = true; pending.length = 0; };
    try { document.head.appendChild(script); } catch { blocked = true; pending.length = 0; return false; }
  }
  return true; // Local queue only; never claim Events Manager delivery.
}

export function metaPageView(route: string) {
  currentRoute = route;
  if (!eligible()) { syncMetaConsent(); if (accepted()) lastPage = ""; return; }
  if (lastPage === route) return;
  if (enqueue("PageView", context())) lastPage = route;
}
export function syncMetaConsent() {
  if (!eligible()) {
    if (pending.some(row => row.event === "PageView")) lastPage = "";
    pending.length = 0;
    try { if (initialized) window.fbq?.("consent", "revoke"); } catch { /* blocked SDK */ }
    return;
  }
  if (currentRoute) metaPageView(currentRoute);
}

// Called from the existing shared GA business dispatcher, never from a second UI definition.
export function dispatchMetaBusinessEvent(event: string, cleaned: Params, confirmedRfq = false) {
  if (!eligible()) return false;
  const names: Record<string, string> = { view_item: "ViewContent", search: "Search",
    add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", generate_lead: "Lead" };
  const name = names[event]; if (!name) return false;
  const requestId = safeId(cleaned.request_id);
  if (event === "generate_lead" && (!confirmedRfq || !requestId?.startsWith("RFQ-") || /TEST|MOCK|SYNTHETIC/.test(requestId))) return false;
  const params: Params = context();
  const source = cleaned.event_source;
  if (typeof source === "string" && /^[a-z_]{1,50}$/.test(source)) params.event_source = source;
  const ecommerce = cleaned.ecommerce as { items?: Params[] } | undefined;
  const items = (ecommerce?.items ?? []).flatMap(x => {
    const id = safeSearchTerm(x.item_id); if (!id) return [];
    return [{ id, quantity: typeof x.quantity === "number" && Number.isFinite(x.quantity) ? Math.max(1, Math.floor(x.quantity)) : 1 }];
  });
  if (items.length) { params.contents = items; params.content_ids = items.map(x => x.id); params.content_type = "product"; }
  // Search text, titles, customer fields, session IDs and request IDs never enter Meta payloads.
  if (event === "search") { const term = safeSearchTerm(cleaned.search_term); if (!term) return false; params.content_ids = [term]; }
  if (["view_item", "add_to_cart", "begin_checkout"].includes(event) && !items.length) return false;
  return enqueue(name, params, event === "generate_lead" ? `lead:${requestId}` : String(cleaned.event_id ?? ""));
}
