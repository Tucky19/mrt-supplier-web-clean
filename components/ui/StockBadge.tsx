// app/components/StockBadge.tsx
import React from "react";

export default function StockBadge({ status }: { status?: string }) {
  const st = (status || "request") as "in_stock" | "low_stock" | "request";

  if (st === "in_stock") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        พร้อมส่ง
      </span>
    );
  }
  if (st === "low_stock") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        ของเข้าเร็ว ๆ นี้
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-700">
      ขอใบเสนอราคา
    </span>
  );
}
