"use client";

import React from "react";
import { useQuote } from "@/providers/QuoteProvider";

type ApiItem = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  spec?: string;
};

export default function AddToQuoteControl({ it }: { it: ApiItem }) {
  const { addItem } = useQuote();
  const [qty, setQty] = React.useState(1);

  function onAdd() {
    // ใช้ any เพื่อกัน type ชน (เพราะแต่ละโปรเจกต์ quote schema ไม่เหมือนกัน 100%)
    (addItem as any)({
      productId: it.id,
      partNo: it.partNo,
      brand: it.brand,
      category: it.category,
      spec: it.spec,
      qty,
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="h-10 w-16 rounded-lg border border-neutral-700 bg-neutral-950 text-center text-white outline-none focus:ring-2 focus:ring-red-600/40"
      />

      <button
        type="button"
        onClick={onAdd}
        className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-500"
      >
        Add
      </button>
    </div>
  );
}
