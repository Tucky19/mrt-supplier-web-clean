"use client";

import React, { useMemo } from "react";
import Button from "@/components/ui/Button";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  productId: string;
  partNo: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  qty?: number;
  className?: string;
  label?: string;
};

export default function AddToQuoteAction({
  productId,
  partNo,
  brand,
  category,
  title,
  spec,
  qty = 1,
  className,
  label = "Add to Quote",
}: Props) {
  const q = useQuote();

  const payload = useMemo(
    () => ({
      productId: String(productId),
      partNo: String(partNo),
      brand,
      category,
      title,
      spec,
      qty: Number(qty) || 1,
    }),
    [productId, partNo, brand, category, title, spec, qty]
  );

  function onAdd() {
    q.addItem(payload);
  }

  return (
    <Button
      onClick={onAdd}
      className={`w-full ${className || ""}`}
      variant="primary"
    >
      <span className="mr-2">+</span>
      {label}
    </Button>
  );
}