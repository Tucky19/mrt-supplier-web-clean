"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  partNo: string;
  brand?: string;
  category?: string;
  title?: string;
  isBestConverting?: boolean;
};

export default function SingleSearch({
  locale,
  autoFocus = false,
}: {
  locale: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cleaned = query.trim();

    if (cleaned.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(cleaned)}`
        );
        const data = await res.json();

        setResults(Array.isArray(data.items) ? data.items : []);
        setOpen(true);
        setActiveIndex(0);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 160);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  function goTo(partNo: string) {
    router.push(`/${locale}/products/${encodeURIComponent(partNo)}`);
    setOpen(false);
  }

  function goToSearch() {
    const cleaned = query.trim();

    if (!cleaned) return;

    router.push(`/${locale}/products?q=${encodeURIComponent(cleaned)}`);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (open && results[activeIndex]) {
        goTo(results[activeIndex].partNo);
        return;
      }

      goToSearch();
      return;
    }

    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? results.length - 1 : prev - 1));
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value.toUpperCase())}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 140)}
        onKeyDown={onKeyDown}
        placeholder="Search part number..."
        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
      />

      {open && results.length > 0 ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.partNo}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  goTo(item.partNo);
                }}
                className={[
                  "group flex w-full items-start justify-between gap-3 border-l-4 px-4 py-3 text-left text-sm transition",
                  isActive
                    ? "border-red-600 bg-slate-900 text-white"
                    : "border-transparent hover:bg-slate-700 hover:text-white active:border-red-600 active:bg-slate-900 active:text-white",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        isActive
                          ? "text-white"
                          : "text-slate-900 group-hover:text-white group-active:text-white"
                      }`}
                    >
                      {item.partNo}
                    </span>

                    {item.isBestConverting ? (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                          isActive
                            ? "border-slate-500 bg-slate-800 text-slate-100"
                            : "border-amber-200 bg-amber-50 text-amber-700 group-hover:border-slate-500 group-hover:bg-slate-800 group-hover:text-slate-100 group-active:border-slate-500 group-active:bg-slate-800 group-active:text-slate-100"
                        }`}
                      >
                        Popular RFQ
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`mt-0.5 truncate text-xs ${
                      isActive
                        ? "text-slate-200"
                        : "text-slate-500 group-hover:text-slate-200 group-active:text-slate-200"
                    }`}
                  >
                    {[item.brand, item.category].filter(Boolean).join(" • ")}
                  </div>

                  {item.title ? (
                    <div
                      className={`mt-0.5 truncate text-xs ${
                        isActive
                          ? "text-slate-200"
                          : "text-slate-600 group-hover:text-slate-200 group-active:text-slate-200"
                      }`}
                    >
                      {item.title}
                    </div>
                  ) : null}
                </div>

                <span
                  className={`shrink-0 text-xs ${
                    isActive
                      ? "text-slate-200"
                      : "text-slate-400 group-hover:text-slate-200 group-active:text-slate-200"
                  }`}
                >
                  Open
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            className="flex w-full items-center justify-center border-t border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Search all results for “{query}”
          </button>
        </div>
      ) : null}
    </div>
  );
}
