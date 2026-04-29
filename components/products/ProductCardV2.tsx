"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";

export default function ProductCardV2({
  product,
  locale = "en",
}: {
  product: Product;
  locale?: string;
}) {
  const { addItem } = useQuote();
  const { show } = useToast();

  const refs = Array.from(
    new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])])
  )
    .map((value) => String(value).trim())
    .filter(Boolean)
    .slice(0, 2);

  const image =
    product.imageUrl || product.officialImageUrl || "/images/placeholder.jpg";

  const handleAdd = () => {
    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      qty: 1,
    });

    show(`Added ${product.partNo} to quote`);
  };

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md sm:p-4">
      <div className="mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-50 transition-colors duration-200 group-hover:bg-slate-100 sm:mb-3 sm:h-32">
        <img
          src={image}
          alt={product.partNo}
          className="h-full object-contain transition duration-200 group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {product.brand}
      </div>

      <Link
        href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
        className="text-sm font-semibold leading-tight text-gray-900 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 sm:text-[15px]"
      >
        {product.partNo}
      </Link>

      {product.title && (
        <div className="mt-1 line-clamp-1 text-xs text-gray-700 sm:line-clamp-2 sm:text-sm">
          {product.title}
        </div>
      )}

      {product.spec && (
        <div className="mb-2 mt-2 line-clamp-2 text-[11px] text-gray-500 sm:text-xs">
          {product.spec}
        </div>
      )}

      {product.shortDescription && (
        <div className="mb-2 hidden line-clamp-2 text-xs text-gray-600 sm:block">
          {product.shortDescription}
        </div>
      )}

      {refs.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
          {refs.map((ref) => (
            <span
              key={ref}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-700 sm:text-[11px]"
            >
              {ref}
            </span>
          ))}
        </div>
      )}

      {product.officialUrl && (
        <a
          href={product.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 text-xs font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          View Official
        </a>
      )}

      <div className="mt-auto flex gap-2">
        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <ShoppingCart size={16} />
          Add
        </button>

        <Link
          href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
