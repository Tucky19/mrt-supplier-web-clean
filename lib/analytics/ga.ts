// lib/analytics/ga.ts
export type GAItem = {
  item_id: string;
  item_name?: string;
  item_brand?: string;
  item_category?: string;
  quantity?: number;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function hasGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function gaEvent(eventName: string, params?: Record<string, any>) {
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

export function gaSearch(searchTerm: string, extra?: Record<string, any>) {
  const term = String(searchTerm ?? "").trim();
  if (!term) return;
  gaEvent("search", { search_term: term, ...(extra ?? {}) });
}

export function gaViewItem(item: GAItem, extra?: Record<string, any>) {
  if (!item?.item_id) return;
  gaEvent("view_item", {
    items: [item],
    ...(extra ?? {}),
  });
}

export function gaAddToQuote(item: GAItem, extra?: Record<string, any>) {
  if (!item?.item_id) return;
  // ใช้ event มาตรฐาน GA4 ecommerce: add_to_cart (เอาไปทำ funnel ง่าย)
  gaEvent("add_to_cart", {
    items: [item],
    ...(extra ?? {}),
  });
}

export function gaSubmitRFQ(items: GAItem[], extra?: Record<string, any>) {
  const safe = Array.isArray(items) ? items.filter((x) => x?.item_id) : [];
  gaEvent("generate_lead", {
    items: safe,
    ...(extra ?? {}),
  });
}