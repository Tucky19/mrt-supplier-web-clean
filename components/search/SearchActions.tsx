"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function SearchActions() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        <span>Back</span>
      </button>

      <Link
        href={`/${locale}/products`}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100"
      >
        <X className="h-4 w-4" strokeWidth={2} />
        <span>Clear search</span>
      </Link>
    </div>
  );
}
