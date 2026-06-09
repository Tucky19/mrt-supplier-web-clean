"use client";

import { useEffect, useMemo, useRef } from "react";
import { gaViewSearchResults, type GAItem } from "@/lib/analytics/ga";

type SearchResultDataLayerProduct = {
  id?: string;
  partNo?: string;
  brand?: string;
  title?: string;
  category?: string;
};

type Props = {
  query: string;
  locale: string;
  products: SearchResultDataLayerProduct[];
};

export default function SearchResultsDataLayer({
  query,
  locale,
  products,
}: Props) {
  const lastTrackedKeyRef = useRef("");
  const trimmedQuery = query.trim();

  const items = useMemo<GAItem[]>(() => {
    return products.map((product, index) => ({
      item_id: product.partNo || product.id || `search-result-${index + 1}`,
      item_name: product.title || product.partNo || product.id,
      item_brand: product.brand,
      item_category: product.category,
      quantity: 1,
    }));
  }, [products]);

  useEffect(() => {
    if (trimmedQuery.length < 2) return;

    const key = [
      locale,
      trimmedQuery.toLowerCase(),
      String(items.length),
      items.map((item) => item.item_id).join("|"),
    ].join(":");

    if (lastTrackedKeyRef.current === key) return;

    gaViewSearchResults(trimmedQuery, items, {
      locale,
      page_location: window.location.href,
    });

    lastTrackedKeyRef.current = key;
  }, [items, locale, trimmedQuery]);

  return null;
}
