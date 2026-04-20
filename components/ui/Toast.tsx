"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

type Props = {
  show: boolean;
  onClose: () => void;
  count?: number;
};

export default function ToastRFQ({ show, onClose, count }: Props) {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    setVisible(true);
    const t = window.setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2600);

    return () => window.clearTimeout(t);
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="animate-slide-in flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/85 px-4 py-3 text-white shadow-2xl backdrop-blur">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm font-bold">
          {typeof count === "number" ? count : "✓"}
        </span>

        <div className="min-w-[140px]">
          <div className="text-sm font-semibold leading-tight">Added to RFQ</div>
          <div className="text-[11px] text-white/70">พร้อมส่งคำขอราคาแล้ว</div>
        </div>

        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
        >
          Open RFQ →
        </Link>
      </div>
    </div>
  );
}
