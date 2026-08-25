"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCardV2 from "@/components/products/ProductCardV2";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  locale: string;
  initialCount?: number;
  incrementCount?: number;
  searchQuery?: string;
};

export default function ProductListClient({
  products,
  locale,
  initialCount = 12,
  incrementCount = 12,
  searchQuery = "",
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
      <div className="py-10 text-center text-[var(--color-text-muted)]">
        {isThai ? "ไม่พบสินค้า" : "No products found"}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:gap-5 xl:gap-6">
        {visibleProducts.map((product) => (
          <ProductCardV2
            key={product.id}
            product={product}
            locale={locale}
            searchQuery={searchQuery}
            variant="search"
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-[var(--color-text-muted)]">
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
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]"
            >
              {isThai ? "โหลดเพิ่ม" : "Load more"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
