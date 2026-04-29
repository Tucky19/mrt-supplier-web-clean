"use client";

import { useEffect, useMemo, useState } from "react";
import { isBestConvertingProduct } from "@/data/merchandising/productHighlights";

export type ProductSearchItem = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  stockStatus?: "in_stock" | "low_stock" | "request";
  refs?: string[];
};

type UseProductSearchArgs = {
  products?: ProductSearchItem[];
  initialQuery?: string;
  initialBrand?: string;
  initialMode?: string;
};

const SEARCH_DEBOUNCE_MS = 180;
const MAX_RENDERED_RESULTS = 48;

function normalize(value: string | undefined | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");
}

export function useProductSearch({
  products = [],
  initialQuery = "",
  initialBrand = "",
  initialMode = "all",
}: UseProductSearchArgs) {
  const [query, setQuery] = useState(initialQuery);
  const [brandFilter, setBrandFilter] = useState(initialBrand || "all");
  const [mode, setMode] = useState(initialMode || "all");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [debouncedBrandFilter, setDebouncedBrandFilter] = useState(
    initialBrand || "all"
  );

  useEffect(() => {
    if (query === debouncedQuery && brandFilter === debouncedBrandFilter) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
      setDebouncedBrandFilter(brandFilter);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [brandFilter, debouncedBrandFilter, debouncedQuery, query]);

  const isSearching =
    query !== debouncedQuery || brandFilter !== debouncedBrandFilter;

  const brands = useMemo(() => {
    const unique = Array.from(
      new Set(
        products
          .map((product) => product.brand?.trim())
          .filter((brand): brand is string => Boolean(brand))
      )
    );

    return unique.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(debouncedQuery);

    const filtered = products.filter((product) => {
      const matchesBrand =
        debouncedBrandFilter === "all" ||
        normalize(product.brand) === normalize(debouncedBrandFilter);

      if (!matchesBrand) return false;
      if (!normalizedQuery) return true;

      const partNo = product.partNo ?? "";
      const title = product.title ?? "";
      const spec = product.spec ?? "";
      const category = product.category ?? "";
      const refs = Array.isArray(product.refs) ? product.refs.join(" ") : "";

      const searchableText = normalize(
        [partNo, title, spec, category, refs, product.brand ?? ""].join(" ")
      );

      const normalizedPartNo = normalize(partNo);

      if (mode === "part") {
        return (
          normalizedPartNo === normalizedQuery ||
          normalizedPartNo.startsWith(normalizedQuery) ||
          searchableText.includes(normalizedQuery)
        );
      }

      return searchableText.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      const aBoost = isBestConvertingProduct(a.partNo) ? 1 : 0;
      const bBoost = isBestConvertingProduct(b.partNo) ? 1 : 0;

      if (bBoost !== aBoost) return bBoost - aBoost;

      return 0;
    });
  }, [debouncedBrandFilter, debouncedQuery, mode, products]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, MAX_RENDERED_RESULTS),
    [filteredProducts]
  );

  return {
    query,
    setQuery,
    brandFilter,
    setBrandFilter,
    mode,
    setMode,
    brands,
    isSearching,
    totalResults: filteredProducts.length,
    visibleProducts,
    hasMoreResults: filteredProducts.length > visibleProducts.length,
    maxRenderedResults: MAX_RENDERED_RESULTS,
  };
}