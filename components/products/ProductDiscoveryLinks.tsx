import type { Product } from "@/types/product";

type Props = {
  locale: string;
  items: { product: Product; label: string }[];
};

export default function ProductDiscoveryLinks({ locale, items }: Props) {
  if (!items.length) return null;
  const isThai = locale === "th";
  return (
    <nav aria-labelledby="product-discovery-title" className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 xl:px-8">
      <h2 id="product-discovery-title" className="text-base font-semibold text-[var(--color-text)]">
        {isThai ? "ดูสเปกไส้กรองตามเบอร์สินค้า" : "Filter specifications by part number"}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ product, label }) => (
          <li key={product.id}>
            <a
              href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
              className="block rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              <span className="font-semibold">{product.brand} {product.partNo}</span>
              <span className="mt-1 block text-xs text-[var(--color-text-muted)]">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
