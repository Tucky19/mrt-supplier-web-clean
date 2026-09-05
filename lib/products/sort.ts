import type { Product } from "@/types/product";

export function sortProductsByPartNo<T extends Pick<Product, "partNo">>(
  products: T[],
): T[] {
  return [...products].sort((a, b) =>
    a.partNo.localeCompare(b.partNo, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}
