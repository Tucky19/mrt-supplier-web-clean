import type { Product } from "@/types/product";
import { donaldsonProducts } from "@/data/products/brand-donaldson";
import { ntnProducts } from "@/data/products/brand-ntn";
import { mannProducts } from "@/data/products/brand-mann";
import { batch4Products } from "./products.batch4";
import { batch4FeaturedProducts } from "./products.batch4.featured";

function normalizePartNo(value: string): string {
  if (!value) return "";
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

const rawProducts: Product[] = [
  ...donaldsonProducts,
  ...ntnProducts,
  ...mannProducts,
  ...batch4Products,
  ...batch4FeaturedProducts,
].filter((product): product is Product => {
  return (
    Boolean(product) &&
    typeof product.partNo === "string" &&
    product.partNo.trim() !== ""
  );
});

export const products: Product[] = Array.from(
  new Map(
    rawProducts.map((product) => [normalizePartNo(product.partNo), product])
  ).values()
);