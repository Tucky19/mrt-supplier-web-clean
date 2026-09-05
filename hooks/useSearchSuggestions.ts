"use client";

import { useMemo } from "react";
import { searchProducts, type SearchResult } from "@/lib/search/search";

const SUGGESTION_LIMIT = 4;

export function useSearchSuggestions(query: string): SearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return searchProducts(trimmed, {
      limit: 24,
      allowPartialRelationMatches: true,
    })
      .filter((result) =>
        [
          "Exact",
          "Prefix",
          "Cross Ref",
          "Same-brand Ref",
          "Kit Component",
        ].includes(result._matchType),
      )
      .slice(0, SUGGESTION_LIMIT);
  }, [query]);
}
