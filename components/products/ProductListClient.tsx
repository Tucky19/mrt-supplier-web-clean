"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCardV2 from "@/components/products/ProductCardV2";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  locale: string;
  initialCount?: number;
  incrementCount?: number;
};

export default function ProductListClient({
  products,
  locale,
  initialCount = 12,
  incrementCount = 12,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const isThai = locale === "th";

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, products]);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMore = visibleCount < products.length;

  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        {isThai ? "ไม่พบสินค้า" : "No products found"}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCardV2
            key={product.id}
            product={product}
            locale={locale}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-slate-500">
              {isThai
                ? `กำลังแสดง ${visibleProducts.length} จาก ${products.length} รายการ`
                : `Showing ${visibleProducts.length} of ${products.length} items`}
            </div>

            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(current + incrementCount, products.length)
                )
              }
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {isThai ? "โหลดเพิ่ม" : "Load more"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
