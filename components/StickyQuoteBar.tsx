"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useQuote } from "@/providers/QuoteProvider";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function StickyQuoteBar() {
  const { items, totalItems } = useQuote();
  const locale = useLocale();
  const pathname = usePathname();

  const list = (items ?? []) as Array<{ qty?: number }>;
  const totalQty = list.reduce((sum, item) => sum + Number(item.qty ?? 0), 0);

  const show = totalQty > 0 && !pathname.endsWith("/quote");

  const label = useMemo(() => {
    if (totalQty <= 0) return "";
    return `${totalItems} item${totalItems === 1 ? "" : "s"} • ${totalQty} pcs`;
  }, [totalItems, totalQty]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-40 px-4 transition-all duration-200",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-neutral-950/95 px-4 py-3 shadow-2xl backdrop-blur">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">RFQ / Quote</div>
          <div className="text-xs text-white/70">
            In quote: <span className="font-semibold text-white">{label}</span>
          </div>
        </div>

        <Link
          href={`/${locale}/quote`}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:opacity-90"
        >
          Open Quote
        </Link>
      </div>
    </div>
  );
}
