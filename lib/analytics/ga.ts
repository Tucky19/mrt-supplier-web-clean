export type GAItem = {
  item_id: string;
  item_name?: string;
  item_brand?: string;
  item_category?: string;
  quantity?: number;
};

type GAParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function hasGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function gaEvent(eventName: string, params?: GAParams) {
  if (!hasGtag()) return;

  try {
    window.gtag!("event", eventName, params ?? {});
  } catch {
    // ignore
  }
}

export function gaPageView(url: string) {
  if (!hasGtag()) return;

  try {
    const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
    if (!GA_ID) return;

    window.gtag!("config", GA_ID, {
      page_path: url,
    });
  } catch {
    // ignore
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

export function gaViewItem(item: GAItem, extra?: GAParams) {
  if (!item?.item_id) return;

  gaEvent("view_item", {
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

  gaEvent("add_to_quote", {
    item_id: item.item_id,
    item_brand: item.item_brand,
    item_category: item.item_category,
    quantity: item.quantity,
    ...(extra ?? {}),
  });
}

export function gaSubmitRFQ(items: GAItem[], extra?: GAParams) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.item_id) : [];
  const itemCount = safeItems.length;
  const totalQuantity = safeItems.reduce((sum, item) => {
    const nextQty = Number(item.quantity ?? 0);
    return sum + (Number.isFinite(nextQty) ? nextQty : 0);
  }, 0);

  gaEvent("rfq_submit_success", {
    item_count: itemCount,
    total_quantity: totalQuantity,
    ...(extra ?? {}),
  });
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
