"use client";

import { useMemo } from "react";
import {
  searchProducts,
  sortSearchSuggestions,
  type SearchResult,
} from "@/lib/search/search";

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
      const exactBrands = new Set(
        exactMatches.map((result) => result.brand.trim().toLowerCase()),
      );
      const exactPartNumbers = exactMatches.map((result) =>
        result.partNo.trim().toLowerCase().replace(/[\s/_-]+/g, ""),
      );
      const sameBrandPartVariants = results.filter((result) => {
        if (result._matchType !== "Prefix") return false;
        if (!exactBrands.has(result.brand.trim().toLowerCase())) return false;

        const candidatePartNo = result.partNo
          .trim()
          .toLowerCase()
          .replace(/[\s/_-]+/g, "");
        return exactPartNumbers.some(
          (exactPartNo) =>
            candidatePartNo.startsWith(exactPartNo) &&
            candidatePartNo.length > exactPartNo.length,
        );
      });

      return sortSearchSuggestions([
        ...exactMatches,
        ...sameBrandPartVariants,
      ]).slice(0, SUGGESTION_LIMIT);
    }

    const seenPartNumbers = new Set<string>();

    return sortSearchSuggestions(results)
      .filter((result) => {
        const key = result.partNo
          .trim()
          .toLowerCase()
          .replace(/[\s/_-]+/g, "");

        if (!key || seenPartNumbers.has(key)) return false;
        seenPartNumbers.add(key);
        return true;
      })
      .slice(0, SUGGESTION_LIMIT);
  }, [query]);
}
