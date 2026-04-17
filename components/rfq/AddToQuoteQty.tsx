"use client";

import { ReactNode, useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  productId?: string;
  partNo: string;
  brand?: string;
  qty?: number;
  className?: string;
  children?: ReactNode;
};

export default function AddToQuoteButton({
  productId,
  partNo,
  brand,
  className = "",
  qty = 1,
  children,
}: Props) {
  const { addItem } = useQuote();
  const [flash, setFlash] = useState(false);

  const onAdd = () => {
    addItem({
      productId: productId || partNo,
      partNo,
      brand,
      qty,
    });

    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className={`${className} ${flash ? "ring-2 ring-blue-400" : ""}`}
    >
      {children ?? "Add to RFQ"}
    </button>
  );
}