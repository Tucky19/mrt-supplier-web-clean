"use client";

import ProductCardV2 from "@/components/products/ProductCardV2";
import {
  type ProductRelationInput,
  relationPartNumbers,
} from "@/lib/products/relations";

type Product = {
  id: string;
  partNo: string;
  brand: string;
  category?: string;
  spec?: string;
  imageUrl?: string;
  crossReferences?: ProductRelationInput[];
};

type Props = {
  current: Product;
  products: Product[];
};

export default function RelatedProducts({ current, products }: Props) {
  const related = products
    .filter((p) => p.partNo !== current.partNo)
    .filter(
      (p) =>
        p.brand === current.brand ||
        p.category === current.category ||
        relationPartNumbers(p.crossReferences || [], "unknown").some((ref) =>
          relationPartNumbers(
            current.crossReferences || [],
            "unknown",
          ).includes(ref)
        )
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Related Products
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {related.map((p) => (
          <ProductCardV2 key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
