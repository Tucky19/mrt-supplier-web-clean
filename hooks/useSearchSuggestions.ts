"use client";

import { useMemo } from "react";
import { searchProducts, type SearchResult } from "@/lib/search/search";

const SUGGESTION_LIMIT = 5;

export function useSearchSuggestions(query: string): SearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return searchProducts(trimmed, { limit: SUGGESTION_LIMIT });
  }, [query]);
}
