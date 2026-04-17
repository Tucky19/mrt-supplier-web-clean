"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/quote"); // ไม่รบกวนตอนอยู่หน้า quote

  if (hidden) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-sm font-semibold text-slate-900">
          Search
        </Link>
        <Link
          href={`/quote`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          RFQ
        </Link>
        <Link href="/faq" className="text-sm font-semibold text-slate-900">
          FAQ
        </Link>
      </div>
    </div>
  );
}
