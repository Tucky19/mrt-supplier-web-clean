"use client";

import Link from "next/link";
import { useQuote } from "@/providers/QuoteProvider";

export default function StickyQuoteBar() {
  const { items } = useQuote();

  if (!items || items.length === 0) return null;

  const totalQty = items.reduce((sum, i) => sum + (i.qty || 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="text-sm text-gray-700">
          <span className="font-semibold">{totalQty}</span> items in quote
        </div>

        <Link
          href="/quote"
          className="inline-flex items-center rounded-lg bg-[#0F172A] px-4 py-2 text-sm text-white hover:bg-black transition"
        >
          View Quote
        </Link>

      </div>
    </div>
  );
}