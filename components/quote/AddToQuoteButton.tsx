"use client";

import { useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  product: {
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
  };
};

export default function AddToQuoteButton({ product }: Props) {
  const { addItem } = useQuote();

  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (loading) return;

    setLoading(true);

    try {
      addItem({
        productId: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title,
        qty: 1,
      });

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`
        relative overflow-hidden
        rounded-xl px-4 py-2 text-sm font-medium text-white
        transition-all duration-200
        ${
          added
            ? "bg-emerald-600"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
        }
        disabled:opacity-50
      `}
    >
      <span className="relative z-10">
        {loading
          ? "กำลังเพิ่ม..."
          : added
          ? "เพิ่มแล้ว ✓"
          : "เพิ่มในใบขอราคา"}
      </span>

      {loading && (
        <span className="absolute inset-0 animate-pulse bg-white/10" />
      )}
    </button>
  );
}