import { normalize } from "@/lib/search/normalize";
import React from "react";

export function highlightText(text: string, query: string) {
  if (!text || !query) return text;

  const qn = normalize(query);
  if (!qn) return text;

  const raw = String(text);
  const normalizedRaw = normalize(raw);

  const idx = normalizedRaw.indexOf(qn);
  if (idx === -1) return raw;

  const before = raw.substring(0, idx);
  const match = raw.substring(idx, idx + query.length);
  const after = raw.substring(idx + query.length);

  return (
    <>
      {before}
      <span className="bg-yellow-200 px-1 rounded">
        {match}
      </span>
      {after}
    </>
  );
}