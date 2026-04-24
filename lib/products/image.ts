export function getProductImageUrl(partNo: string | undefined | null) {
  const cleaned = String(partNo ?? "").trim();

  if (!cleaned) return "";

  return `/products/${encodeURIComponent(cleaned)}.jpg`;
}