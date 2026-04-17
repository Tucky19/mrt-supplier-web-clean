"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useQuote } from "@/providers/QuoteProvider";

export default function FloatingRFQButton() {
  const { totalItems } = useQuote();

  const pathname = usePathname();

  const show = totalItems > 0 && pathname !== "/quote";
  if (!show) return null;

  return (
    <Link
      href={`/quote`}
      className="fixed bottom-24 right-5 z-50 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-white/15"
      aria-label="Open RFQ Quote"
    >
      <span className="rounded-xl bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
        {totalItems}
      </span>
      RFQ Quote
    </Link>
  );
}
