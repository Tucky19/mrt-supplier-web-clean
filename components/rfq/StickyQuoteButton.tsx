"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useQuote } from "@/providers/QuoteProvider";

export default function StickyQuoteButton() {
  const locale = useLocale();
  const { totalItems } = useQuote();

  if (!totalItems) return null;

  return (
    <Link
      href={`/${locale}/quote`}
      className="
        fixed bottom-6 right-6 z-50
        rounded-xl
        bg-white text-black
        px-6 py-3
        font-semibold
        shadow-lg
        hover:scale-105
        transition
      "
    >
      Quote ({totalItems})
    </Link>
  );
}
