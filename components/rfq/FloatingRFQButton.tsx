"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useQuote } from "@/providers/QuoteProvider";

export default function StickyRFQ() {
  const q = useQuote() as any;

  const items = Array.isArray(q?.items) ? q.items : [];
  const itemCount = items.reduce(
    (sum: number, item: any) => sum + (Number(item?.qty) || 1),
    0
  );

  if (itemCount <= 0) {
    return null;
  }

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-1">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Quote List
              </p>
              <p className="truncate text-sm font-medium text-white">
                {itemCount} item{itemCount > 1 ? "s" : ""} selected
              </p>
            </div>
          </div>

          <Link
            href={`/quote`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-semibold text-neutral-950 transition hover:opacity-90"
          >
            View Quote
          </Link>
        </div>
      </div>

      {/* Desktop floating button */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <Link
          href={`/quote`}
          className="inline-flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/95 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200">
            <ShoppingCart className="h-5 w-5" />
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              RFQ
            </span>
            <span className="mt-1 text-sm text-white">
              {itemCount} item{itemCount > 1 ? "s" : ""}
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}