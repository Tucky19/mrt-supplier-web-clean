"use client";

import { useQuote } from "@/providers/QuoteProvider";
import Button from "@/components/ui/Button";

export default function QuoteClient() {
  const q = useQuote();

  return (
    <div className="max-w-3xl mx-auto py-10">

      <h1 className="text-xl font-semibold mb-6">
        Quote Items
      </h1>

      {q.items.map((it) => (
        <div
          key={it.productId}
          className="border border-white/10 rounded-lg p-4 mb-3"
        >
          {it.partNo} — qty {it.qty}
        </div>
      ))}

      <Button onClick={() => q.clear()} variant="secondary">
        Clear
      </Button>

    </div>
  );
}