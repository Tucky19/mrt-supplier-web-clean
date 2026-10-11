import { products } from "@/data/products/index";
import { relationPartNumbers } from "@/lib/products/relations";

// Only published catalog identifiers enter analytics; arbitrary customer text is omitted.
const normalize = (value: string) => value.trim().toUpperCase().replace(/[\s/_-]+/g, "");
const identifiers = new Set(products.flatMap((p) => [p.partNo,
  ...relationPartNumbers(p.refs ?? [], "unknown"),
  ...relationPartNumbers(p.crossReferences ?? [], "unknown")]).map(normalize));
export function safeSearchTerm(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 60) return undefined;
  const term = value.trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9 /_.-]*$/.test(term)) return undefined;
  return identifiers.has(normalize(term)) ? term : undefined;
}
export function safeId(value: unknown): string | undefined {
  return typeof value === "string" && /^(?:[a-z_]+:[a-f0-9-]{36}|rfq_submitted:RFQ-\d{8}-[A-Z0-9]+|(?:RFQ|MPR)-\d{8}-[A-Z0-9]+)$/.test(value) ? value : undefined;
}
export const MATCH_TYPES = ["Exact", "Prefix", "Contains", "Cross Ref", "Same-brand Ref", "Dimensions", "Kit Component", "Related", "No Result"] as const;
export type GrowthContext = {
  session_id?: string; search_event_id?: string; search_term?: string;
  part_number?: string; match_type?: string; locale?: "th" | "en";
  event_source?: string;
};
export function safeGrowthContext(input: unknown): GrowthContext {
  const p = input && typeof input === "object" ? input as Record<string, unknown> : {};
  return {
    session_id: typeof p.session_id === "string" && /^anon:[a-f0-9-]{36}$/.test(p.session_id) ? p.session_id : undefined,
    search_event_id: safeId(p.search_event_id),
    search_term: safeSearchTerm(p.search_term), part_number: safeSearchTerm(p.part_number),
    match_type: MATCH_TYPES.includes(p.match_type as typeof MATCH_TYPES[number]) ? String(p.match_type) : undefined,
    locale: p.locale === "th" || p.locale === "en" ? p.locale : undefined,
    event_source: typeof p.event_source === "string" && /^[a-z_]{1,50}$/.test(p.event_source) ? p.event_source : undefined,
  };
}
export function safeEventParams(input: Record<string, unknown>): Record<string, unknown> {
  const context = safeGrowthContext(input);
  const output: Record<string, unknown> = { ...context };
  for (const k of ["event_id", "request_id"] as const) output[k] = safeId(input[k]);
  for (const k of ["result_count", "item_count", "quantity", "total_quantity"] as const) {
    const v = input[k]; if (typeof v === "number" && Number.isFinite(v) && v >= 0) output[k] = Math.floor(v);
  }
  if (typeof input.timestamp === "string" && !Number.isNaN(Date.parse(input.timestamp))) output.timestamp = new Date(input.timestamp).toISOString();
  if (typeof input.search_source === "string" && /^[a-z_]{1,50}$/.test(input.search_source)) output.search_source = input.search_source;
  for (const k of ["has_part_no", "has_dimensions"] as const) if (typeof input[k] === "boolean") output[k] = input[k];
  if (typeof input.filter_type === "string" && /^[a-z_]{1,40}$/.test(input.filter_type)) output.filter_type = input.filter_type;
  if (typeof input.source_page === "string" && (/^[a-z_]{1,50}$/.test(input.source_page) || /^\/(th|en)\/(products|quote)$/.test(input.source_page))) output.source_page = input.source_page;
  const itemId = safeSearchTerm(input.item_id);
  if (itemId) output.item_id = itemId;
  const e = input.ecommerce && typeof input.ecommerce === "object" ? input.ecommerce as Record<string, unknown> : null;
  if (e && Array.isArray(e.items)) {
    const items = e.items.flatMap((raw: unknown) => {
      if (!raw || typeof raw !== "object") return [];
      const x = raw as Record<string, unknown>; const id = safeSearchTerm(x.item_id);
      if (!id) return [];
      const product = products.find(p => normalize(p.partNo) === normalize(id));
      const quantity = typeof x.quantity === "number" && Number.isFinite(x.quantity) ? Math.max(1,Math.floor(x.quantity)) : 1;
      return [{ ...safeGrowthContext(x), item_id: id, part_number: id, item_name: id,
        item_brand: product?.brand, item_category: product?.category, quantity }];
    });
    output.ecommerce = { items, ...(safeId(e.transaction_id) ? { transaction_id: safeId(e.transaction_id) } : {}) };
  }
  return Object.fromEntries(Object.entries(output).filter(([,v]) => v !== undefined));
}
