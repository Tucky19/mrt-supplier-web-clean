"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  className?: string;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function miniText(x: unknown) {
  const s = String(x ?? "").trim();
  if (!s) return "";
  return s.length > 64 ? `${s.slice(0, 64)}…` : s;
}

export default function RFQSidePanel({ className }: Props) {
  const locale = useLocale();
  const { items, totalItems, clear, removeItem } = useQuote();

  const list = (items ?? []) as Array<{
    productId: string;
    partNo: string;
    brand?: string;
    title?: string;
    qty: number;
  }>;

  const hasItems = list.length > 0;

  return (
    <aside className={cn("lg:sticky lg:top-[92px] h-fit", className)}>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/25 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-neutral-100">
              RFQ / Quote
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Search → Add → Submit
            </div>
          </div>

          <span className="rounded-full border border-neutral-800 bg-[#0B0B0B] px-2 py-0.5 text-xs text-neutral-300">
            {totalItems ?? 0}
          </span>
        </div>

        {!hasItems ? (
          <div className="mt-5 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/50 p-4 text-sm text-neutral-500">
            No items in quote yet.
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-3">
              {list.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-neutral-100">
                        {item.partNo}
                      </div>

                      {item.brand ? (
                        <div className="mt-1 text-xs text-neutral-400">
                          {item.brand}
                        </div>
                      ) : null}

                      {item.title ? (
                        <div className="mt-1 text-xs text-neutral-500">
                          {miniText(item.title)}
                        </div>
                      ) : null}

                      <div className="mt-2 text-xs text-neutral-300">
                        Qty: <span className="font-semibold">{item.qty}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="rounded-lg border border-neutral-800 px-2 py-1 text-xs text-neutral-300 transition hover:border-neutral-700 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:opacity-90"
              >
                Open Quote
              </Link>

              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-600 hover:text-white"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
