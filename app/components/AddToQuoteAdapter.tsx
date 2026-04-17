"use client";

import React from "react";
import AddToQuoteButton from "@/components/rfq/AddToQuoteButton";

export default function AddToQuoteAdapter(props: {
  product: {
    id: string;
    partNo: string;
    brand?: string;
    category?: string;
    spec?: string;
    stockStatus?: string;
    title?: string;
  };
  className?: string;
}) {
  const { product, className } = props;

  return (
    <AddToQuoteButton
      productId={String(product.id)}
      partNo={String(product.partNo ?? "")}
      brand={product.brand}
      title={product.title}
      className={className}
    />
  );
}