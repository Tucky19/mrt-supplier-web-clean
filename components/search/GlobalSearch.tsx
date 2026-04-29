'use client';
import { useState, useMemo, useEffect } from 'react';
import { track } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/lib/search/search';
import { useQuote } from '@/providers/QuoteProvider';
import type { SearchResult } from '@/lib/search/search';
import { searchFallback } from '@/lib/search/search';
type Variant = 'hero' | 'header';

export default function GlobalSearch({ variant = 'header' }: { variant?: Variant }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { addItem } = useQuote();

const results: SearchResult[] = useMemo(() => {
  if (q.trim().length < 2) return [];

  const res = searchProducts(q, { limit: 6 });

  if (res.length === 0) {
    // fallback
  }

  return res;
}, [q]);
useEffect(() => {
  if (q.trim().length >= 2) {
    track({
      type: 'search',
      query: q,
      resultCount: results.length,
    });
  }
}, [q, results.length]);
  const handleSelect = (item: any) => {
    router.push(`/products/${item.id}`);
  };

  const handleAdd = (item: any) => {
    addItem(item);
    // lightweight feedback
    console.log('Added:', item.partNo);
  };

  return (
    <div className={`relative ${variant === 'hero' ? 'max-w-2xl mx-auto' : 'w-full max-w-md'}`}>
      
      {/* INPUT */}
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(true);
        }}
        onFocus={() => setActive(true)}
        placeholder="Search part number (e.g. P558615)"
        className={`
          w-full 
          ${variant === 'hero' ? 'h-14 text-lg' : 'h-10 text-sm'}
          px-4 rounded-xl border 
          shadow-sm focus:outline-none 
          focus:ring-2 focus:ring-blue-900
        `}
      />
      {results.length === 0 && q.length >= 2 && (
     <div className="p-4 text-sm text-gray-500">
         No exact match. Showing closest results.
     </div>
     )}

      {/* RESULT DROPDOWN */}
      {active && results.length > 0 && (
        <div className="absolute z-50 w-full bg-white border mt-2 rounded-xl shadow-lg overflow-hidden">
          
          {results.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
            >
              {/* LEFT: info */}
              <div
                className="cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                <div className="font-semibold text-blue-900">
                  {item.partNo}
                </div>

                <div className="text-xs text-gray-500">
                  {item.brand}
                  {item._matchType && (
                    <span className="ml-2 text-green-600">
                      • {item._matchType}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT: quick add */}
              <button
                onClick={() => handleAdd(item)}
                className="text-xs bg-blue-900 text-white px-3 py-1 rounded-lg hover:bg-blue-800"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}