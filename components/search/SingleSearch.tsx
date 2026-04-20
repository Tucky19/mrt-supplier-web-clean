"use client";

import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  autocompleteProducts,
  type AutocompleteItem,
} from "@/lib/search/autocomplete";

type Props = {
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
};

function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function highlight(text: string, query: string) {
  const q = safeStr(query);
  if (!q) return text;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");

  return text.split(regex).map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-yellow-200 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SingleSearch({
  className = "",
  autoFocus = false,
  placeholder = "Search by part number, cross reference, brand, or application",
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const sp = useSearchParams();

  const currentQ = useMemo(() => safeStr(sp.get("q")), [sp]);
  const [q, setQ] = useState(currentQ);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const suggestions = useMemo<AutocompleteItem[]>(() => {
    const nextQ = safeStr(q);
    if (nextQ.length < 2) return [];
    return autocompleteProducts(nextQ, 8);
  }, [q]);

  const showSuggestions = isFocused && suggestions.length > 0 && safeStr(q).length >= 2;

  function goToSearch(nextQ: string) {
    const cleaned = safeStr(nextQ);
    const params = new URLSearchParams(sp.toString());

    if (cleaned) {
      params.set("q", cleaned);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const qs = params.toString();
    const href = qs ? `/${locale}/products?${qs}` : `/${locale}/products`;
    router.push(href);
    setIsFocused(false);
    setActiveIndex(-1);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
      const selected = suggestions[activeIndex];
      router.push(
        `/${locale}/products/${encodeURIComponent(selected.id || selected.partNo)}`
      );
      setIsFocused(false);
      setActiveIndex(-1);
      return;
    }

    goToSearch(q);
  }

  function clearSearch() {
    setQ("");
    setActiveIndex(-1);
    router.push(`/${locale}/products`);
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= suggestions.length ? 0 : next;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? suggestions.length - 1 : next;
      });
      return;
    }

    if (e.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }

  const hasValue = q.length > 0;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form onSubmit={onSubmit} role="search" aria-label="Product search">
        <div
          className={cn(
            "group flex w-full items-center gap-2 rounded-2xl border bg-white px-3 py-3 shadow-sm transition",
            isFocused
              ? "border-slate-900 ring-2 ring-slate-900/10"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <label htmlFor="single-search-input" className="sr-only">
              Search products
            </label>

            <input
              ref={inputRef}
              id="single-search-input"
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActiveIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={onKeyDown}
              autoFocus={autoFocus}
              placeholder={placeholder}
              className="w-full border-0 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
              autoComplete="off"
              spellCheck={false}
            />

            <div className="mt-1 text-xs text-neutral-500">
              Exact part numbers work best, for example: P550084, 6205-2RS, LF3345
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {hasValue ? (
              <button
                type="button"
                onClick={clearSearch}
                className="hidden rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 sm:inline-flex"
              >
                Clear
              </button>
            ) : null}

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
          <div className="border-b border-neutral-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Suggestions
          </div>

          <div className="max-h-[360px] overflow-y-auto py-1">
            {suggestions.map((item, index) => {
              const href = `/${locale}/products/${encodeURIComponent(
                item.id || item.partNo
              )}`;
              const isActive = index === activeIndex;

              return (
                <Link
                  key={`${item.id}-${item.partNo}`}
                  href={href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setIsFocused(false);
                    setActiveIndex(-1);
                  }}
                  className={cn(
                    "block px-4 py-3 transition",
                    isActive ? "bg-neutral-50" : "bg-white hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-neutral-900">
                        {highlight(item.partNo, q)}
                      </div>

                      <div className="mt-0.5 truncate text-sm text-neutral-700">
                        {item.title
                          ? highlight(item.title, q)
                          : item.brand || item.category || "Product"}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                        {item.brand ? <span>{item.brand}</span> : null}
                        {item.category ? (
                          <>
                            <span>•</span>
                            <span>{item.category}</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 text-xs font-medium text-neutral-400">
                      Open
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => goToSearch(q)}
            className="flex w-full items-center justify-center border-t border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Search all results for “{q}”
          </button>
        </div>
      ) : null}
    </div>
  );
}
