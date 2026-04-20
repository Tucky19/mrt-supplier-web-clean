"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { gaSearch } from "@/lib/analytics/ga";

type Props = {
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
};

export default function SearchBar({
  defaultValue = "",
  className = "",
  autoFocus = false,
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    // ✅ Analytics: search
    gaSearch(trimmed, { search_source: "products_searchbar" });

    startTransition(() => {
      router.push(`/${locale}/products?q=${encodeURIComponent(trimmed)}`);
    });
  };

  return (
    <div className="w-full max-w-[720px]">
      <form
        onSubmit={handleSubmit}
        className={`token-surface token-focus flex h-14 w-full items-center gap-3 rounded-xl px-4 transition-colors ${className}`}
      >
        <span className="text-[color:var(--text-secondary)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Part Number, Cross Reference, Description"
          className="h-full w-full bg-transparent text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none"
        />

        <button
          type="submit"
          disabled={isPending}
          aria-label={isPending ? "Searching" : "Search"}
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--accent-red)] text-white transition-colors hover:bg-[color:var(--accent-red-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      <p className="mt-2 text-xs leading-6 text-[color:var(--text-secondary)]">
        ค้นหาด้วย Part Number, Cross Reference หรือ Description
      </p>
    </div>
  );
}
