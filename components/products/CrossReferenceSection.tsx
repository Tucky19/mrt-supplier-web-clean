"use client";

import Link from "next/link";

type Product = {
  partNo: string;
  refs?: string[];
  crossReferences?: string[];
};

type Props = {
  product: Product;
  allProducts: Product[];
  locale: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s/_-]+/g, "");
}

export default function CrossReferenceSection({
  product,
  allProducts,
  locale,
}: Props) {
  const refs = Array.from(
    new Set([...(product.refs || []), ...(product.crossReferences || [])])
  ).filter(Boolean);

  if (refs.length === 0) return null;

  // 🔥 map ref → product (ถ้ามี)
  const mapRefToProduct = (ref: string) => {
    const key = normalize(ref);

    return allProducts.find(
      (p) =>
        normalize(p.partNo) === key ||
        (p.refs || []).some((r) => normalize(r) === key) ||
        (p.crossReferences || []).some((r) => normalize(r) === key)
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Cross Reference
      </h2>

      <div className="flex flex-wrap gap-2">
        {refs.map((ref) => {
          const target = mapRefToProduct(ref);

          const href = target
            ? `/${locale}/products/${target.partNo}` // ✅ ไป product
            : `/${locale}/search?q=${encodeURIComponent(ref)}`; // 🔁 fallback

          return (
            <Link
              key={ref}
              href={href}
              className="px-3 py-1.5 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              {ref}
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Click to view equivalent or compatible parts.
      </p>
    </div>
  );
}