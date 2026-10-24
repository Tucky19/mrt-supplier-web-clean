import { dispatchMetaBusinessEvent } from "./meta";
import { safeEventParams, safeId, type GrowthContext } from "./contract";
import { anonymousSessionId, growthEventId } from "./growth";

export type GAItem = GrowthContext & {
  item_id: string;
  item_name?: string;
  item_brand?: string;
  item_category?: string;
  quantity?: number;
};

type GAParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function normalizeEventParams(params?: GAParams): GAParams {
  if (!params || !("source" in params) || "event_source" in params) {
    return params ?? {};
  }

  const { source, ...rest } = params;
  return {
    ...rest,
    event_source: source,
  };
}

export function pushDataLayer(payload: GAParams) {
  if (typeof window === "undefined") return false;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    return true;
  } catch {
    return false;
  }
}

// Drop query/hash and dynamic path identifiers from automatic GA page context.
export function analyticsPageUrl(value: string) {
  try {
    const u=new URL(value, window.location.origin);
    const segments=u.pathname.split("/").filter(Boolean);
    const locale=segments[0]==="en" ? "en" : "th";
    const section=["products","quote","cross-reference","applications","brands","search"].includes(segments[1] ?? "") ? segments[1] : "";
    return `${u.origin}/${locale}${section ? `/${section}` : ""}`;
  } catch { return ""; }
}
const sentEvents = new Set<string>();
function dispatchEvent(eventName: string, params?: GAParams, confirmedRfq = false, metaReceipt?: string) {
  if (typeof window === "undefined") return false;
  const normalized = normalizeEventParams(params);
  const id = safeId(normalized.event_id) ?? growthEventId(eventName);
  const cleaned = safeEventParams({ ...normalized, event_id: id,
    timestamp: new Date().toISOString(), session_id: anonymousSessionId() });
  if (sentEvents.has(id)) return false;
  const receiptKey = `mrt_growth_sent:${id}`;
  if (eventName === "generate_lead") {
    try { if (sessionStorage.getItem(receiptKey)) return false; } catch { /* memory fallback */ }
  }
  try {
    if (cleaned.ecommerce) pushDataLayer({ ecommerce: null });
    const pageContext={page_location:analyticsPageUrl(window.location.href),page_referrer:analyticsPageUrl(document.referrer)};
    if (process.env.NEXT_PUBLIC_GA4_ID) {
      // Queue standard gtag arguments even before the async tag has initialized.
      window.dataLayer ??= [];
      window.gtag ??= function (...args: unknown[]) { window.dataLayer!.push(args); };
      const {ecommerce,...eventParams}=cleaned;
      window.gtag("event",eventName,{...eventParams,...(ecommerce as Record<string,unknown> ?? {}),...pageContext});
    } else if (!pushDataLayer({ event:eventName, ...cleaned, ...pageContext })) return false;
    try { dispatchMetaBusinessEvent(eventName, cleaned, confirmedRfq, metaReceipt); } catch { /* Meta must never affect GA/RFQ */ }
    sentEvents.add(id);
    if (eventName === "generate_lead") { try { sessionStorage.setItem(receiptKey,"1"); } catch { /* server event remains authoritative */ } }
    return true; // queued locally; this is NOT proof of GA4 receipt
  } catch { return false; }
}
function pushEcommerceEvent(eventName: string, params?: GAParams, confirmedRfq = false, metaReceipt?: string) { return dispatchEvent(eventName,params,confirmedRfq,metaReceipt); }
export function gaEvent(eventName: string, params?: GAParams) { return dispatchEvent(eventName,params); }

export function gaPageView(url: string) {
  const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
  if (!GA_ID || typeof window === "undefined") return false;

  try {
    const pageLocation = analyticsPageUrl(url);
    if (!pageLocation) return false;
    const pagePath = new URL(pageLocation).pathname;
    // Queue explicitly even if the async Google tag has not initialized yet.
    // Consent defaults/updates remain owned by GTM.tsx and CookieConsent.
    window.dataLayer ??= [];
    window.gtag ??= function (...args: unknown[]) { window.dataLayer!.push(args); };
    window.gtag("event", "page_view", {
      send_to: GA_ID,
      page_path: pagePath,
      page_title: pagePath,
      page_location: pageLocation,
      page_referrer: analyticsPageUrl(document.referrer),
    });
    return true; // queued locally, not proof of Google receipt
  } catch {
    return false;
  }
}

export function gaSearch(searchTerm: string, extra?: GAParams) {
  const term = String(searchTerm ?? "").trim();
  if (!term) return;

  gaEvent("search", {
    search_term: term,
    ...(extra ?? {}),
  });
}

export function gaSearchNoResults(params: {
  search_term: string;
  locale?: string;
  source: "products_page" | "homepage";
}) {
  const term = String(params.search_term ?? "").trim();
  if (!term) return;

  gaEvent("search_no_results", {
    search_term: term,
    locale: params.locale,
    source: params.source,
  });
}

export function gaViewSearchResults(
  searchTerm: string,
  items: GAItem[],
  extra?: GAParams
) {
  const term = String(searchTerm ?? "").trim();
  if (!term) return;

  const safeItems = Array.isArray(items) ? items.filter((item) => item?.item_id) : [];

  pushEcommerceEvent("view_search_results", {
    search_term: term,
    result_count: safeItems.length,
    ecommerce: {
      item_list_id: "search_results",
      item_list_name: "Search Results",
      items: safeItems,
    },
    ...(extra ?? {}),
  });
}

export function gaViewItem(item: GAItem, extra?: GAParams) {
  if (!item?.item_id) return;

  return pushEcommerceEvent("view_item", {
    ecommerce: { items: [item] },
    item_id: item.item_id,
    item_name: item.item_name,
    item_brand: item.item_brand,
    item_category: item.item_category,
    quantity: item.quantity,
    ...(extra ?? {}),
  });
}

export function gaOfficialReferenceClick(params: {
  item_id: string;
  item_brand?: string;
  source: "product_detail";
}) {
  const itemId = String(params.item_id ?? "").trim();
  if (!itemId) return;

  gaEvent("official_reference_click", {
    item_id: itemId,
    item_brand: params.item_brand,
    source: params.source,
  });
}

export function gaAddToQuote(item: GAItem, extra?: GAParams) {
  if (!item?.item_id) return;

  pushEcommerceEvent("add_to_cart", {
    ecommerce: {
      items: [item],
    },
    ...(extra ?? {}),
  });
}

export function gaViewCart(items: GAItem[], extra?: GAParams) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.item_id) : [];

  if (safeItems.length === 0) return;

  pushEcommerceEvent("view_cart", {
    ecommerce: {
      items: safeItems,
    },
    ...(extra ?? {}),
  });
}

export function gaBeginCheckout(items: GAItem[], extra?: GAParams) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.item_id) : [];

  if (safeItems.length === 0) return;

  pushEcommerceEvent("begin_checkout", {
    ecommerce: {
      items: safeItems,
    },
    ...(extra ?? {}),
  });
}

export function gaSubmitRFQ(items: GAItem[], extra?: GAParams, metaReceipt?: string) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.item_id) : [];
  const itemCount = safeItems.length;
  const totalQuantity = safeItems.reduce((sum, item) => {
    const nextQty = Number(item.quantity ?? 0);
    return sum + (Number.isFinite(nextQty) ? nextQty : 0);
  }, 0);

  const requestId = safeId(extra?.request_id);
  if (!requestId || !requestId.startsWith("RFQ-")) return false;
  return pushEcommerceEvent("generate_lead", {
    event_id: `rfq_submitted:${requestId}`,
    item_count: itemCount,
    total_quantity: totalQuantity,
    ecommerce: {
      items: safeItems,
    },
    ...(extra ?? {}),
  }, true, metaReceipt);
}

export function gaMissingProductRequestSubmit(params: {
  request_id?: string;
  filter_type?: string;
  has_part_no: boolean;
  has_dimensions: boolean;
  source_page?: string;
  locale?: string;
}) {
  gaEvent("missing_product_request_submit", {
    request_id: params.request_id,
    filter_type: params.filter_type,
    has_part_no: params.has_part_no,
    has_dimensions: params.has_dimensions,
    source_page: params.source_page,
    locale: params.locale,
  });
}

export function gaLineClick(params: {
  source: string;
  locale?: string;
}) {
  const source = String(params.source ?? "").trim();
  if (!source) return;

  gaEvent("line_click", {
    source,
    locale: params.locale,
  });
}
