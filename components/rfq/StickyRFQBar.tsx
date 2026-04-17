"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

export default function StickyRFQBar() {
  const { totalItems } = useQuote();

  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!totalItems) return;
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 500);
    return () => window.clearTimeout(t);
  }, [totalItems]);

  return (
    <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="text-sm text-slate-700">
          RFQ / Quote{" "}
          <span
            className={[
              "ml-2 inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
              totalItems ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700",
              pulse ? "scale-110 transition-transform" : "transition-transform",
            ].join(" ")}
          >
            {totalItems}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Search
          </Link>

          <Link
            href={`/quote`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Open RFQ
          </Link>
        </div>
      </div>
    </div>
  );
}
