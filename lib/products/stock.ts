import type { Product } from "@/types/product";

const MRT_CORE_BRANDS = new Set(["donaldson", "mannfilter", "ntn"]);

function normalizeBrand(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isMrtCoreBrand(brand: string) {
  return MRT_CORE_BRANDS.has(normalizeBrand(brand));
}

export function hasVerifiedMrtStock(product: Product) {
  return (
    product.stockStatus === "in_stock" &&
    product.mrtStockEvidence?.status === "in_stock" &&
    typeof product.mrtStockEvidence.checkedAt === "string" &&
    product.mrtStockEvidence.checkedAt.trim().length > 0
  );
}
