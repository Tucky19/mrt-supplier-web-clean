import type { Product } from "@/types/product";
import { parseMillimeters } from "@/lib/search/dimensions";

/** Only physical dimensions, never thread designations, pressure or efficiency. */
export function isLinearDimensionLabel(label: string) {
  return /diameter|\b(?:od|id|length|height|width|thickness)\b/i.test(label) &&
    !/thread|restriction|pressure|reference|note/i.test(label);
}

export function metricDimensionValue(value: string | number) {
  if (typeof value === "string" && !/\b(?:mm|in|inch|inches)\b|"/i.test(value)) return value;
  const mm = parseMillimeters(value);
  return mm === undefined ? value : `${mm} mm`;
}

export function applyMetricDimensions(product: Product): Product {
  return {
    ...product,
    specifications: product.specifications?.map(row =>
      isLinearDimensionLabel(row.label)
        ? { ...row, value: metricDimensionValue(row.value) } : row,
    ),
    // Summary dimensions share the same canonical unit. Preserve imperial threads.
    spec: product.spec?.replace(/\b\d+(?:\.\d+)?\s*mm\s*\([^)]*(?:inch|\bin\b)[^)]*\)|\b\d+(?:\.\d+)?\s*(?:inches|inch|in)\b/g,
      value => String(metricDimensionValue(value))),
  };
}
