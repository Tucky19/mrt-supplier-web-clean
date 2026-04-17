"use client";

import { useMemo, useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

type AddToQuoteButtonProps = {
  productId: string;
  partNo: string;
  brand?: string;
  title?: string;
  qty?: number;
  className?: string;
  showQty?: boolean;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function safeInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function clampQty(value: number, min = 1, max = 999) {
  return Math.min(max, Math.max(min, value));
}

export default function AddToQuoteButton({
  productId,
  partNo,
  brand,
  title,
  qty = 1,
  className,
  showQty = false,
}: AddToQuoteButtonProps) {
  const q = useQuote();

  const items = (q.items ?? []) as Array<{
    productId: string;
    qty: number;
  }>;

  const inQuote = useMemo(() => {
    return items.find((item) => item.productId === productId) || null;
  }, [items, productId]);

  const inQty = inQuote?.qty ?? 0;

  const [draftQty, setDraftQty] = useState<number>(clampQty(safeInt(qty, 1), 1));
  const [justAdded, setJustAdded] = useState(false);

  const disabled = !productId || !partNo;

  const onAdd = () => {
    if (disabled) return;

    const qtyAdd = clampQty(showQty ? draftQty : safeInt(qty, 1), 1);

    q.addItem({
      productId,
      partNo,
      brand,
      title,
      qty: qtyAdd,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {showQty ? (
        <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() => setDraftQty((prev) => clampQty(prev - 1, 1))}
            className="px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <div className="min-w-[52px] border-x border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-900">
            {draftQty}
          </div>

          <button
            type="button"
            onClick={() => setDraftQty((prev) => clampQty(prev + 1, 1))}
            className="px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {justAdded ? "Added" : "Add to Quote"}
      </button>

      {inQuote ? (
        <span className="text-sm text-slate-600">
          In quote: <span className="font-semibold text-slate-900">{inQty}</span>
        </span>
      ) : null}
    </div>
  );
}