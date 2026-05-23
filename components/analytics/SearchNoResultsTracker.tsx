"use client";

import { useEffect, useRef } from "react";
import { gaSearchNoResults } from "@/lib/analytics/ga";

type Props = {
  searchTerm: string;
  locale: string;
  source: "products_page" | "homepage";
};

export default function SearchNoResultsTracker({
  searchTerm,
  locale,
  source,
}: Props) {
  const lastTrackedKeyRef = useRef("");

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) return;

    const key = `${source}:${locale}:${term.toLowerCase()}`;
    if (lastTrackedKeyRef.current === key) return;

    gaSearchNoResults({
      search_term: term,
      locale,
      source,
    });

    lastTrackedKeyRef.current = key;
  }, [locale, searchTerm, source]);

  return null;
}
