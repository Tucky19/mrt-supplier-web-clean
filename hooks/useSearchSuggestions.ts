"use client";

import { useMemo } from "react";
import { searchProducts, type SearchResult } from "@/lib/search/search";

const SUGGESTION_LIMIT = 4;

export function useSearchSuggestions(query: string): SearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    const results = searchProducts(trimmed, {
      limit: 24,
      allowPartialRelationMatches: true,
    }).filter((result) =>
      [
        "Exact",
        "Prefix",
        "Cross Ref",
        "Same-brand Ref",
        "Kit Component",
      ].includes(result._matchType),
    );

    const exactMatches = results.filter(
      (result) => result._matchType === "Exact",
    );

    if (exactMatches.length > 0) {
      return exactMatches.slice(0, SUGGESTION_LIMIT);
    }

    const seenPartNumbers = new Set<string>();

    return results
      .filter((result) => {
        const key = result.partNo
          .trim()
          .toLowerCase()
          .replace(/[\\s/_-]+/g, "");

        if (!key || seenPartNumbers.has(key)) return false;
        seenPartNumbers.add(key);
        return true;
      })
      .slice(0, SUGGESTION_LIMIT);
  }, [query]);
}
