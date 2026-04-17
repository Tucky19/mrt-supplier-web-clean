"use client";

import Link from "next/link";

type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  refs?: string[];
};

type SearchHit = {
  product: Product;
  score?: number;
  reasons?: string[];
};

type Props = {
  hit: SearchHit;
};

export default function ResultCard({ hit }: Props) {
  const product = hit.product;
  const reasons = hit.reasons ?? [];
  const refs = Array.isArray(product.refs) ? product.refs : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mt-3">
            <Link
              href={`/products/${product.id}`}
              className="inline-block text-xl font-bold tracking-tight text-white transition hover:text-blue-300"
            >
              {product.partNo}
            </Link>

            <div className="mt-1 text-sm text-neutral-400">
              {product.category}
            </div>
          </div>

          {product.title ? (
            <p className="mt-3 text-sm leading-6 text-neutral-200">
              {product.title}
            </p>
          ) : null}

          {product.spec ? (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-400">
              {product.spec}
            </p>
          ) : null}

          {refs.length > 0 ? (
            <div className="mt-3">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Cross Reference
              </div>

              <div className="flex flex-wrap gap-2">
                {refs.slice(0, 6).map((ref: string) => (
                  <span
                    key={ref}
                    className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {reasons.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {reasons.slice(0, 5).map((reason: string) => (
                <span
                  key={reason}
                  className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-xs text-blue-200"
                >
                  {reason}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-white">{product.brand}</div>

          {product.officialUrl ? (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-xs text-blue-300 underline underline-offset-2 transition hover:text-blue-200"
            >
              Official link
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}