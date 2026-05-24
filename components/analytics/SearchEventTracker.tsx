"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

type Props = {
  query: string;
  locale: string;
  resultCount: number;
  matchType?: string | null;
};

export default function SearchEventTracker({
  query,
  locale,
  resultCount,
  matchType,
}: Props) {
  const lastTrackedKeyRef = useRef("");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const normalizedMatchType =
      resultCount === 0 ? "No Result" : matchType?.trim() || undefined;
    const key = [
      locale,
      trimmed.toLowerCase(),
      String(resultCount),
      normalizedMatchType || "",
    ].join(":");

    if (lastTrackedKeyRef.current === key) {
      return;
    }

    track({
      type: "search",
      query: trimmed,
      resultCount,
      matchType: normalizedMatchType,
    });

    lastTrackedKeyRef.current = key;
  }, [locale, matchType, query, resultCount]);

  return null;
}
