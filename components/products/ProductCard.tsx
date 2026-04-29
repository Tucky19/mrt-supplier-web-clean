'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuote } from '@/providers/QuoteProvider';
import type { Product } from '@/types/product';

type ProductCardProduct = Product & {
  _matchType?: string;
};

type Props = {
  locale?: string;
  product: ProductCardProduct;
};

export default function ProductCard({ locale = 'th', product }: Props) {
  const { addItem, items } = useQuote();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const inCart = items.some((item) => item.partNo === product.partNo);

  const refs = Array.from(
    new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])])
  )
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 2);

  const handleAdd = async () => {
    if (loading) return;

    setLoading(true);

    try {
      addItem({
        productId: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title ?? '',
        qty: 1,
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  const isExact = product._matchType === 'Exact';

  return (
    <div className="flex flex-col rounded-xl border bg-white p-4 transition hover:shadow-lg hover:-translate-y-1">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-lg font-bold ${isExact ? 'text-green-700' : 'text-blue-900'}`}>
            {product.partNo}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {product.brand}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            OEM
          </span>

          {isExact && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
              Exact
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-slate-50 p-2">
        <img
          src={
            product.imageUrl ||
            product.officialImageUrl ||
            '/images/placeholder.jpg'
          }
          alt={product.partNo}
          className="h-24 w-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              '/images/placeholder.jpg';
          }}
        />
      </div>

      {/* Spec */}
      {product.spec && (
        <div className="mt-3 line-clamp-2 text-xs text-gray-600">
          {product.spec}
        </div>
      )}

      {/* Refs */}
      {refs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {refs.map((ref) => (
            <span
              key={ref}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
            >
              {ref}
            </span>
          ))}
        </div>
      )}

      {/* Official */}
      {product.officialUrl && (
        <a
          href={product.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-xs font-medium text-blue-700 hover:underline"
        >
          View Official →
        </a>
      )}

      {/* Status */}
      <div className="mt-3 text-xs text-gray-400">
        {inCart ? 'In Quote' : 'Available'}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
          className="flex-1 rounded-lg border py-2 text-center text-sm hover:bg-gray-50"
        >
          Details
        </Link>

        <button
          onClick={handleAdd}
          className={`flex-1 rounded-lg py-2 text-sm transition ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
        >
          {loading
            ? '...'
            : added
            ? 'Added ✓'
            : inCart
            ? 'Add More'
            : '+ Add'}
        </button>
      </div>
    </div>
  );
}
