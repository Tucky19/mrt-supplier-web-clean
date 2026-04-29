export const BEST_CONVERTING_PARTS = new Set<string>([
  "P553004",
  "P550084",
  "P550162",
]);

export function isBestConvertingProduct(partNo?: string | null) {
  if (!partNo) return false;
  return BEST_CONVERTING_PARTS.has(partNo.trim().toUpperCase());
}