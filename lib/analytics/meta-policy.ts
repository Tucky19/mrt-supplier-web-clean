import { products } from "@/data/products/index";

export const META_EVENTS = ["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Lead"] as const;
export type MetaEventName = typeof META_EVENTS[number];
export const META_MAX_BYTES = 8192;
export const META_CONSENT_EVENT = "mrt:cookie-consent";
export type MetaItem = { product_id: string; quantity: number };
export type MetaEnvelope = {
  consent: "accepted";
  event_name: MetaEventName;
  event_id: string;
  event_time: number;
  event_source_url: string;
  locale: "th" | "en";
  items: MetaItem[];
  fbp?: string;
  fbc?: string;
  lead_receipt?: string;
};
const normalize = (value: string) => value.toUpperCase().replace(/[\s/_.-]+/g, "");
export function publicMetaProduct(value: unknown) {
  if (typeof value !== "string" || value.length > 100) return undefined;
  const key = normalize(value);
  return products.find(product => normalize(product.partNo) === key);
}
// Preserve only reviewed public paths. Query/hash never enter this return value.
export function sanitizeMetaUrl(value: string, origin: string): string | undefined {
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.username || url.password) return undefined;
    const path = decodeURIComponent(url.pathname);
    if (/^\/(th|en)\/?$/.test(path) || /^\/(th|en)\/(products|quote(?:\/success)?)\/?$/.test(path)) return `${origin}${url.pathname}`;
    const detail = path.match(/^\/(th|en)\/products\/(.+?)\/?$/);
    if (!detail) return undefined;
    const segment = normalize(detail[2]);
    if (!products.some(p => segment === normalize(p.partNo) || segment === normalize(`${p.brand}-${p.partNo}`))) return undefined;
    return `${origin}${url.pathname}`;
  } catch { return undefined; }
}
export function validMetaIdentifier(value: unknown, kind: "fbp" | "fbc", now = Date.now()): value is string {
  if (typeof value !== "string" || value.length > 550) return false;
  const match = value.match(/^fb\.([0-2])\.(\d{13})\.([A-Za-z0-9_-]+)$/);
  if (!match) return false;
  const age = now - Number(match[2]);
  if (age < -300_000 || age > 90 * 86400_000) return false;
  return kind === "fbp" ? /^\d{1,20}$/.test(match[3]) : validMetaClickId(match[3]);
}
export function validMetaClickId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,500}$/.test(value) && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}
export function validMetaEventId(value: unknown): value is string {
  return typeof value === "string" && /^(?:meta:[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}|meta_lead:[a-f0-9]{64})$/.test(value);
}
function exactKeys(value: Record<string, unknown>, allowed: string[]) {
  return Object.keys(value).every(key => allowed.includes(key));
}
export function validateMetaEnvelope(raw: unknown, origin: string, now = Date.now()): MetaEnvelope | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const value = raw as Record<string, unknown>;
  if (!exactKeys(value, ["consent", "event_name", "event_id", "event_time", "event_source_url", "locale", "items", "fbp", "fbc", "lead_receipt"])) return undefined;
  if (value.consent !== "accepted" || !META_EVENTS.includes(value.event_name as MetaEventName) || !validMetaEventId(value.event_id)) return undefined;
  if (typeof value.event_time !== "number" || !Number.isInteger(value.event_time) || Math.abs(now / 1000 - value.event_time) > 300) return undefined;
  if (typeof value.event_source_url !== "string" || value.event_source_url.length > 300) return undefined;
  const url = sanitizeMetaUrl(value.event_source_url, origin);
  if (!url || url !== value.event_source_url || !["th", "en"].includes(String(value.locale))) return undefined;
  if (new URL(url).pathname.split("/")[1] !== value.locale) return undefined;
  if (!Array.isArray(value.items) || value.items.length > 30) return undefined;
  const items: MetaItem[] = [];
  for (const rawItem of value.items) {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) return undefined;
    const item = rawItem as Record<string, unknown>;
    if (!exactKeys(item, ["product_id", "quantity"])) return undefined;
    const product = publicMetaProduct(item.product_id);
    if (!product || item.product_id !== product.partNo || typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) return undefined;
    items.push({ product_id: product.partNo, quantity: item.quantity });
  }
  if (["ViewContent", "AddToCart", "InitiateCheckout"].includes(String(value.event_name)) && !items.length) return undefined;
  if (value.fbp !== undefined && !validMetaIdentifier(value.fbp, "fbp", now)) return undefined;
  if (value.fbc !== undefined && !validMetaIdentifier(value.fbc, "fbc", now)) return undefined;
  if (value.event_name === "Lead") {
    if (typeof value.lead_receipt !== "string" || !/^meta_lead:[a-f0-9]{64}\.\d{10}\.[a-f0-9]{64}$/.test(value.lead_receipt)) return undefined;
  } else if (value.lead_receipt !== undefined || String(value.event_id).startsWith("meta_lead:")) return undefined;
  const event: MetaEnvelope = { consent: "accepted", event_name: value.event_name as MetaEventName,
    event_id: value.event_id, event_time: value.event_time, event_source_url: url,
    locale: value.locale as "th" | "en", items };
  if (typeof value.fbp === "string") event.fbp = value.fbp;
  if (typeof value.fbc === "string") event.fbc = value.fbc;
  if (typeof value.lead_receipt === "string") event.lead_receipt = value.lead_receipt;
  return event;
}
