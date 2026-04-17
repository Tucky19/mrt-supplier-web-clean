"use client";

import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  productId: string;
  partNo: string;
  brand?: string;
  title?: string;
  spec?: string;
  qty?: number;
  className?: string;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AddToQuoteButton({
  productId,
  partNo,
  brand,
  title,
  qty = 1,
  className,
}: Props) {
  const { addItem } = useQuote();

  const handleClick = () => {
    addItem({
      productId,
      partNo,
      brand,
      title,
      qty,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800",
        className
      )}
    >
      Add to Quote
    </button>
  );
}