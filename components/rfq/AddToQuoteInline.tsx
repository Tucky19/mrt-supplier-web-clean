"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

type AddPayload = {
  productId: string;
  partNo: string;
  brand?: string;
  title?: string;
  qty?: number;
};

type Props = {
  payload: AddPayload;
  className?: string;
  maxQty?: number;
  compact?: boolean;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function safeInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function clampQty(value: number, maxQty: number) {
  return Math.max(1, Math.min(maxQty, value));
}

export default function AddToQuoteInline({
  payload,
  className,
  maxQty = 999,
  compact = false,
}: Props) {
  const q = useQuote();

  const items = (q.items ?? []) as Array<{
    productId: string;
    qty: number;
  }>;

  const inQuote = useMemo(() => {
    return items.find((item) => item.productId === payload.productId) || null;
  }, [items, payload.productId]);

  const inQty = inQuote?.qty ?? 0;

  const [draftQty, setDraftQty] = useState<number>(
    clampQty(safeInt(payload.qty, 1), maxQty)
  );
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setDraftQty(clampQty(safeInt(payload.qty, 1), maxQty));
    setJustAdded(false);
  }, [payload.productId, payload.qty, maxQty]);

  const uiSize = compact ? "h-9 text-sm" : "h-10 text-sm";
  const qtyBox = compact ? "w-14" : "w-16";

  const disabled = !payload.productId || !payload.partNo;

  const onAdd = () => {
    if (disabled) return;

    const qty = clampQty(draftQty, maxQty);

    q.addItem({
      productId: payload.productId,
      partNo: payload.partNo,
      brand: payload.brand,
      title: payload.title,
      qty,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
        <button
          type="button"
          onClick={() => setDraftQty((prev) => clampQty(prev - 1, maxQty))}
          className={cn(
            "px-3 font-medium text-slate-700 transition hover:bg-slate-50",
            uiSize
          )}
          aria-label="Decrease quantity"
        >
          -
        </button>

        <div
          className={cn(
            "border-x border-slate-300 text-center font-semibold text-slate-900",
            uiSize,
            qtyBox
          )}
        >
          {draftQty}
        </div>

        <button
          type="button"
          onClick={() => setDraftQty((prev) => clampQty(prev + 1, maxQty))}
          className={cn(
            "px-3 font-medium text-slate-700 transition hover:bg-slate-50",
            uiSize
          )}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
          uiSize
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