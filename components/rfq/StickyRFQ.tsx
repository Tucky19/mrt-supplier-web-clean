"use client";

import Link from "next/link";
import { FileText, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { useQuote } from "@/providers/QuoteProvider";

type QuoteItem = {
  qty?: number;
};

export default function StickyRFQ() {
  const locale = useLocale();
  const { items } = useQuote() as { items: QuoteItem[] };

  const itemCount = items.length;
  const totalQty = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(1, item.qty ?? 1), 0),
    [items]
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:bottom-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {itemCount > 0
                    ? `${itemCount} item${itemCount > 1 ? "s" : ""} in quote list`
                    : "Build your quote list"}
                </p>
                <p className="text-xs text-neutral-400">
                  {itemCount > 0
                    ? `Ready to get price? ${totalQty} total qty selected`
                    : "Add products and request pricing fast"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-900 hover:text-white"
              >
                Continue search
              </Link>

              <Link
                href={`/quote`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                <FileText className="h-4 w-4" />
                {itemCount > 0 ? "Get Quotation Now" : "Open Quote"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
