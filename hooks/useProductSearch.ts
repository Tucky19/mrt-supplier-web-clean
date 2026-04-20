"use client";

import { useEffect, useMemo, useState } from "react";
import { searchProducts } from "@/lib/search/search";

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

type SearchMode = "part" | "spec" | "all";

type UseProductSearchArgs = {
  products: ProductSearchItem[];
  initialQuery?: string;
  initialBrand?: string;
  initialMode?: string;
};

const SEARCH_DEBOUNCE_MS = 180;
const MAX_RENDERED_RESULTS = 48;

function normalize(value: string | undefined | null) {
  return String(value ?? "").trim().toLowerCase();
}

export function useProductSearch({
  products,
  initialQuery = "",
  initialBrand = "",
  initialMode = "all",
}: UseProductSearchArgs) {
  const [query, setQuery] = useState(initialQuery);
  const [brandFilter, setBrandFilter] = useState(initialBrand || "all");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [debouncedBrandFilter, setDebouncedBrandFilter] = useState(
    initialBrand || "all"
  );

  const fixedSearchMode: SearchMode =
    initialMode === "part" || initialMode === "spec" ? initialMode : "all";

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

  const searchableProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        partNo: product.partNo ?? "",
        brand: product.brand ?? "",
        category: product.category ?? "",
      })),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const needle = normalize(debouncedQuery);

    const searchBase = needle
      ? searchProducts(
          searchableProducts,
          debouncedQuery,
          fixedSearchMode,
          products.length
        ).map((hit) => hit.product as ProductSearchItem)
      : products;

    return searchBase.filter((product) => {
      const matchesBrand =
        debouncedBrandFilter === "all" ||
        normalize(product.brand) === normalize(debouncedBrandFilter);

      return matchesBrand;
    });
  }, [
    debouncedBrandFilter,
    debouncedQuery,
    fixedSearchMode,
    products,
    searchableProducts,
  ]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, MAX_RENDERED_RESULTS),
    [filteredProducts]
  );

  return {
    query,
    setQuery,
    brandFilter,
    setBrandFilter,
    brands,
    isSearching,
    totalResults: filteredProducts.length,
    visibleProducts,
    hasMoreResults: filteredProducts.length > visibleProducts.length,
    maxRenderedResults: MAX_RENDERED_RESULTS,
  };
}
