import { safeGrowthContext, safeSearchTerm, type GrowthContext } from "./contract";

let anonymousId: string | undefined;
const documentEvents = new Map<string,string>();
const detailContexts = new Map<string,GrowthContext>();
export function anonymousSessionId() {
  if (typeof window === "undefined") return undefined;
  if (anonymousId) return anonymousId;
  try { const old = sessionStorage.getItem("mrt_growth_session_v1");
    if (old && /^anon:[a-f0-9-]{36}$/.test(old)) anonymousId = old;
  } catch { /* storage unavailable: memory-only, never block RFQ */ }
  anonymousId ??= `anon:${crypto.randomUUID()}`;
  try { sessionStorage.setItem("mrt_growth_session_v1", anonymousId); } catch { /* optional */ }
  return anonymousId;
}
export function growthEventId(event: string, key?: string) {
  if (!key) return `${event}:${crypto.randomUUID()}`;
  const id = documentEvents.get(`${event}:${key}`) ?? `${event}:${crypto.randomUUID()}`;
  documentEvents.set(`${event}:${key}`,id); return id;
}
export function searchAttribution(query: string, part: string, matchType: string | undefined, locale: string): GrowthContext {
  const term = safeSearchTerm(query);
  return safeGrowthContext({ session_id: anonymousSessionId(),
    search_event_id: growthEventId("search", `${locale}:${term ?? "redacted"}`),
    search_term: term, part_number: part, match_type: matchType, locale, event_source: "product_search" });
}
export function rememberProductAttribution(context: GrowthContext) {
  if (!context.part_number || !context.search_term) return;
  try { sessionStorage.setItem(`mrt_growth_next:${context.locale}:${context.part_number}`, JSON.stringify({ context, at: Date.now() })); } catch { /* optional */ }
}
export function productAttribution(part: string, locale: string): GrowthContext {
  const cacheKey = `${locale}:${part}`; const cached = detailContexts.get(cacheKey);
  if (cached) return cached;
  let context: GrowthContext = safeGrowthContext({ part_number: part, locale, session_id: anonymousSessionId() });
  try {
    const storageKey = `mrt_growth_next:${locale}:${part}`;
    const raw = sessionStorage.getItem(storageKey); sessionStorage.removeItem(storageKey);
    const value = raw ? JSON.parse(raw) : null;
    if (value && typeof value.at === "number" && Date.now()-value.at >= 0 && Date.now()-value.at < 30*60*1000) context = safeGrowthContext(value.context);
  } catch { /* optional */ }
  detailContexts.set(cacheKey,context); return context;
}
export function growthFromMeta(meta: unknown): GrowthContext | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const raw = (meta as { growth?: unknown }).growth;
  if (!raw) return undefined; return safeGrowthContext(raw);
}
