"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { gaSearch } from "@/lib/analytics/ga";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

type Props = {
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
};

const SEARCH_DEBOUNCE_MS = 200;
const EXAMPLE_QUERIES = ["P551315", "P553004", "hydraulic filter"];
const RECENT_SEARCHES_KEY = "mrt_recent_searches_v1";
const RECENT_SEARCHES_LIMIT = 5;
const RESULTS_SECTION_ID = "results";

function getSuggestionLabel(matchType?: string) {
  if (matchType === "Exact" || matchType === "Prefix") {
    return "Part Number";
  }

  if (matchType === "Cross Ref") {
    return "Cross Ref";
  }

  return "Match";
}

function getSuggestionSectionTitle(label: string) {
  if (label === "Part Number") return "Part Number Matches";
  if (label === "Cross Ref") return "Cross References";
  return "Related Matches";
}

function highlightMatch(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex < 0) return text;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmed.length);
  const after = text.slice(matchIndex + trimmed.length);

  return (
    <>
      {before}
      <mark className="rounded bg-yellow-100 px-0.5 text-inherit">{match}</mark>
      {after}
    </>
  );
}

export default function SearchBar({
  defaultValue = "",
  className = "",
  autoFocus = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastSyncedQueryRef = useRef(defaultValue.trim());
  const suggestions = useSearchSuggestions(query);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.map((item) => String(item)).filter(Boolean));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
      lastSyncedQueryRef.current = urlQuery.trim();
    }
  }, [searchParams]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, recentSearches, query]);

  const scrollToResults = () => {
    window.setTimeout(() => {
      document
        .getElementById(RESULTS_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const saveRecentSearch = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (trimmed.length < 2) return;

    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(
        0,
        RECENT_SEARCHES_LIMIT
      );

      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {}

      return next;
    });
  };

  const navigateToQuery = (
    nextQuery: string,
    options?: { scrollToResults?: boolean }
  ) => {
    const trimmed = nextQuery.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed.length >= 2) {
      params.set("q", trimmed);
      gaSearch(trimmed, { search_source: "products_searchbar" });
      saveRecentSearch(trimmed);
    } else {
      params.delete("q");
    }

    const nextPath = `/${locale}/products`;
    const nextUrl = params.toString()
      ? `${nextPath}?${params.toString()}`
      : nextPath;

    lastSyncedQueryRef.current = trimmed;

    startTransition(() => {
      if (pathname === nextPath) {
        router.replace(nextUrl);
      } else {
        router.push(nextUrl);
      }
    });

    if (options?.scrollToResults) {
      scrollToResults();
    }
  };

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length > 0 && trimmed.length < 2) return;
    if (trimmed === lastSyncedQueryRef.current) return;

    const timeout = window.setTimeout(() => {
      navigateToQuery(trimmed);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [query, searchParams, pathname, locale, router]);

  const visibleRecents = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return recentSearches
      .filter((item) =>
        trimmed ? item.toLowerCase().includes(trimmed) : true
      )
      .slice(0, RECENT_SEARCHES_LIMIT);
  }, [query, recentSearches]);

  const groupedSuggestions = useMemo(() => {
    const groups = new Map<string, typeof suggestions>();

    for (const suggestion of suggestions) {
      const label = getSuggestionLabel(suggestion._matchType);
      const current = groups.get(label) ?? [];
      current.push(suggestion);
      groups.set(label, current);
    }

    return Array.from(groups.entries()).map(([label, items]) => ({
      label,
      title: getSuggestionSectionTitle(label),
      items,
    }));
  }, [suggestions]);

  const flattenedSuggestions = useMemo(
    () => groupedSuggestions.flatMap((group) => group.items),
    [groupedSuggestions]
  );

  const showSuggestions = isFocused && flattenedSuggestions.length > 0;
  const showRecents =
    isFocused && query.trim().length < 2 && visibleRecents.length > 0;
  const dropdownItems = showSuggestions
    ? flattenedSuggestions.map((suggestion) => ({
        type: "suggestion" as const,
        value: suggestion.partNo,
      }))
    : showRecents
    ? visibleRecents.map((recent) => ({
        type: "recent" as const,
        value: recent,
      }))
    : [];

  const selectDropdownItem = (value: string) => {
    setQuery(value);
    navigateToQuery(value, { scrollToResults: true });
  };

  const focusDropdownOption = (index: number) => {
    const target = dropdownOptionRefs.current[index];
    if (!target) return;

    setHighlightedIndex(index);
    target.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (highlightedIndex >= 0 && dropdownItems[highlightedIndex]) {
      selectDropdownItem(dropdownItems[highlightedIndex].value);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    navigateToQuery(trimmed, { scrollToResults: true });
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    navigateToQuery(example, { scrollToResults: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && !showRecents) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < dropdownItems.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : dropdownItems.length - 1
      );
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setHighlightedIndex(-1);
      setIsFocused(false);
    }
  };

  const handleDropdownKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
    totalCount: number
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusDropdownOption(currentIndex < totalCount - 1 ? currentIndex + 1 : 0);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusDropdownOption(currentIndex > 0 ? currentIndex - 1 : totalCount - 1);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    }
  };

  let flatIndex = -1;

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[820px] ${className}`}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          nextTarget instanceof Node &&
          containerRef.current?.contains(nextTarget)
        ) {
          return;
        }

        setIsFocused(false);
        setHighlightedIndex(-1);
      }}
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="flex min-h-[60px] items-center gap-3 rounded-full border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:shadow-md sm:px-5">
          <span className="text-slate-400">
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
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search part number, cross reference, or description"
            className="h-full w-full bg-transparent py-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-50 sm:px-5"
          >
            {isPending ? "..." : "Search"}
          </button>
        </div>

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-[68px] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {groupedSuggestions.map((group) => (
              <div key={group.label}>
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:px-5">
                  {group.title}
                </div>

                {group.items.map((suggestion) => {
                  flatIndex += 1;
                  const currentIndex = flatIndex;

                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      ref={(node) => {
                        dropdownOptionRefs.current[currentIndex] = node;
                      }}
                      onClick={() => selectDropdownItem(suggestion.partNo)}
                      onMouseDown={(event) => event.preventDefault()}
                      onFocus={() => {
                        setIsFocused(true);
                        setHighlightedIndex(currentIndex);
                      }}
                      onKeyDown={(event) =>
                        handleDropdownKeyDown(
                          event,
                          currentIndex,
                          flattenedSuggestions.length + 1
                        )
                      }
                      className={`flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 sm:gap-4 sm:px-5 sm:py-3.5 ${
                        highlightedIndex === currentIndex ? "bg-slate-50" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-slate-900">
                            {highlightMatch(suggestion.partNo, query)}
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {group.label}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {highlightMatch(suggestion.brand, query)}
                          {suggestion.title ? (
                            <>
                              {" • "}
                              {highlightMatch(suggestion.title, query)}
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="shrink-0 text-xs text-slate-400">
                        {suggestion._matchType}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}

            <button
              type="button"
              ref={(node) => {
                dropdownOptionRefs.current[flattenedSuggestions.length] = node;
              }}
              onClick={() => navigateToQuery(query, { scrollToResults: true })}
              onMouseDown={(event) => event.preventDefault()}
              onFocus={() => {
                setIsFocused(true);
                setHighlightedIndex(flattenedSuggestions.length);
              }}
              onKeyDown={(event) =>
                handleDropdownKeyDown(
                  event,
                  flattenedSuggestions.length,
                  flattenedSuggestions.length + 1
                )
              }
              className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 sm:px-5 sm:py-3.5"
            >
              <span>View all results for &quot;{query.trim()}&quot;</span>
              <span className="text-slate-400">↵</span>
            </button>
          </div>
        )}

        {showRecents && (
          <div className="absolute left-0 right-0 top-[68px] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:px-5 sm:py-3.5">
              Recent Searches
            </div>

            {visibleRecents.map((recent) => (
              <button
                key={recent}
                type="button"
                ref={(node) => {
                  dropdownOptionRefs.current[visibleRecents.indexOf(recent)] = node;
                }}
                onClick={() => selectDropdownItem(recent)}
                onMouseDown={(event) => event.preventDefault()}
                onFocus={() => {
                  setIsFocused(true);
                  setHighlightedIndex(visibleRecents.indexOf(recent));
                }}
                onKeyDown={(event) =>
                  handleDropdownKeyDown(
                    event,
                    visibleRecents.indexOf(recent),
                    visibleRecents.length
                  )
                }
                className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 last:border-b-0 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 sm:px-5 sm:py-3.5 ${
                  highlightedIndex === visibleRecents.indexOf(recent)
                    ? "bg-slate-50"
                    : ""
                }`}
              >
                <span>{recent}</span>
                <span className="text-xs text-slate-400">Recent</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Try:</span>
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => handleExampleClick(example)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
