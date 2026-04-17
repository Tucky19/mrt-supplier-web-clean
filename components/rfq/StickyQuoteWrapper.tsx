"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuote } from "@/providers/QuoteProvider";

export default function StickyQuoteWrapper() {
  const pathname = usePathname() || "";
  const { totalItems } = useQuote();

  // ✅ hook-safe: คำนวณ hidden หลังเรียก hooks แล้ว
  const hidden = pathname.startsWith("/quote") || pathname.startsWith("/admin");
  if (hidden) return null;

  const hasItems = totalItems > 0;

  // ✅ optional: ถ้าอยากให้โผล่เฉพาะตอนมีของ
  // if (!hasItems) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white sm:flex">
                Q
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold text-neutral-900">
                  {hasItems ? `Quote: ${totalItems} item(s)` : "Start a quote"}
                </div>
                <div className="text-xs text-neutral-600">
                  {hasItems
                    ? "Review & submit your request in seconds"
                    : "Add products to build your quote"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/search"
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
      </div>
    </div>
  );
}