import type { StockStatus } from "@/lib/product-contract";

export default function StockBadge({
  status,
  qty,
}: {
  status?: StockStatus;
  qty?: number;
}) {
  if (status === "in_stock") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
        ● พร้อมส่ง {typeof qty === "number" ? `(${qty})` : ""}
      </span>
    );
  }

  if (status === "low_stock") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
        ● สต็อกน้อย {typeof qty === "number" ? `(${qty})` : ""}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-500/15 px-2.5 py-1 text-xs font-semibold text-neutral-300 ring-1 ring-neutral-500/30">
      ● สั่งเข้า
    </span>
  );
}
