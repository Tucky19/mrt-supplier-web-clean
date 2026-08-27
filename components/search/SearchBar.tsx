"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gaSearch } from "@/lib/analytics/ga";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { getSearchUiText } from "@/lib/i18n/searchUi";
import { isPreliminaryRelation } from "@/lib/products/relations";

type Props = {
  locale: string;
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
  exampleQueries?: string[];
  compactMobileExamples?: boolean;
};

const SEARCH_DEBOUNCE_MS = 400;
const DEFAULT_EXAMPLE_QUERIES = ["hydraulic filter", "air filter", "Fleetguard"];
const RECENT_SEARCHES_KEY = "mrt_recent_searches_v1";
const RECENT_SEARCHES_LIMIT = 5;
const RESULTS_SECTION_ID = "results";

function getSuggestionLabel(
  matchType: string | undefined,
  text: ReturnType<typeof getSearchUiText>
) {
  if (matchType === "Exact" || matchType === "Prefix") {
    return text.partNumber;
  }

  if (matchType === "Cross Ref") {
    return text.crossRef;
  }

  if (matchType === "Same-brand Ref") {
    return text.sameBrandRef;
  }

  if (matchType === "Kit Component") {
    return text.usedTogether;
  }

  return text.match;
}

function getSuggestionSectionTitle(
  label: string,
  text: ReturnType<typeof getSearchUiText>
) {
  if (label === text.partNumber) return text.partNumberMatches;
  if (label === text.crossRef) return text.crossReferences;
  if (label === text.sameBrandRef) return text.sameBrandReferences;
  if (label === text.usedTogether) return text.usedTogetherMatches;
  return text.relatedMatches;
}

function getReferenceBadgeText(
  locale: string,
  query: string,
  isPreliminary = false,
) {
  if (isPreliminary) {
    return locale === "th" ? "ข้อมูลอ้างอิง" : "Reference data";
  }

  const trimmed = query.trim().toUpperCase();
  if (!trimmed) return locale === "th" ? "เทียบจากเบอร์ค้นหา" : "Reference match";

  return locale === "th"
    ? `เทียบจาก ${trimmed}`
    : `Reference for ${trimmed}`;
}

function formatBrandLabel(brand: string) {
  const trimmed = brand.trim();
  if (trimmed.toLowerCase() === "donaldson") return "Donaldson";
  return trimmed;
}

function normalizePartNumber(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
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
      <mark className="rounded bg-[var(--color-warning-soft)] px-0.5 text-[var(--color-warning-text)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-text-inverse)] group-active:bg-[var(--color-primary)] group-active:text-[var(--color-text-inverse)]">
        {match}
      </mark>
      {after}
    </>
  );
}

export default function SearchBar({
  locale,
  defaultValue = "",
  className = "",
  autoFocus = true,
  exampleQueries = DEFAULT_EXAMPLE_QUERIES,
  compactMobileExamples = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const text = getSearchUiText(locale);
  const searchPlaceholder =
    locale === "th"
      ? "ใส่เบอร์สินค้า หรือเบอร์เทียบ"
      : "Enter a product number or cross-reference";

  const [draftQuery, setDraftQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastSyncedQueryRef = useRef(defaultValue.trim());
  const suggestions = useSearchSuggestions(draftQuery);

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
    lastSyncedQueryRef.current = urlQuery.trim();

    if (isFocused) return;
    if (urlQuery !== draftQuery) {
      setDraftQuery(urlQuery);
    }
  }, [draftQuery, isFocused, searchParams]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, recentSearches, draftQuery]);

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
    const trimmed = draftQuery.trim();

    if (trimmed.length > 0 && trimmed.length < 2) return;
    if (trimmed === lastSyncedQueryRef.current) return;

    const timeout = window.setTimeout(() => {
      navigateToQuery(trimmed);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [draftQuery, searchParams, pathname, locale, router]);

  const visibleRecents = useMemo(() => {
    const trimmed = draftQuery.trim().toLowerCase();
    return recentSearches
      .filter((item) => (trimmed ? item.toLowerCase().includes(trimmed) : true))
      .slice(0, RECENT_SEARCHES_LIMIT);
  }, [draftQuery, recentSearches]);

  const groupedSuggestions = useMemo(() => {
    const groups = new Map<string, typeof suggestions>();

    for (const suggestion of suggestions) {
      const label = getSuggestionLabel(suggestion._matchType, text);
      const current = groups.get(label) ?? [];
      current.push(suggestion);
      groups.set(label, current);
    }

    return Array.from(groups.entries()).map(([label, items]) => ({
      label,
      title: getSuggestionSectionTitle(label, text),
      items,
    }));
  }, [suggestions, text]);

  const flattenedSuggestions = useMemo(
    () => groupedSuggestions.flatMap((group) => group.items),
    [groupedSuggestions]
  );
  const hasExactPartNumberSuggestion = useMemo(() => {
    const normalizedQuery = normalizePartNumber(draftQuery);
    if (!normalizedQuery) return false;

    return flattenedSuggestions.some(
      (suggestion) =>
        suggestion._matchType === "Exact" &&
        normalizePartNumber(suggestion.partNo) === normalizedQuery
    );
  }, [draftQuery, flattenedSuggestions]);

  const trimmedQuery = draftQuery.trim();
  const showViewAllResults = trimmedQuery.length >= 2;
  const dropdownItems = [
    ...visibleRecents.map((recent) => ({
      type: "recent" as const,
      value: recent,
    })),
    ...flattenedSuggestions.map((suggestion) => ({
      type: "suggestion" as const,
      value: suggestion.partNo,
    })),
    ...(showViewAllResults
      ? [
          {
            type: "viewAll" as const,
            value: trimmedQuery,
          },
        ]
      : []),
  ];
  const showDropdown = isFocused && dropdownItems.length > 0;

  const selectDropdownItem = (value: string) => {
    setDraftQuery(value);
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

    const trimmed = draftQuery.trim();
    if (trimmed.length < 2) return;
    navigateToQuery(trimmed, { scrollToResults: true });
  };

  const handleExampleClick = (example: string) => {
    setDraftQuery(example);
    navigateToQuery(example, { scrollToResults: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

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

  const suggestionStartIndex = visibleRecents.length;
  const viewAllIndex = suggestionStartIndex + flattenedSuggestions.length;
  const suggestionsTitle = locale === "th" ? "คำแนะนำ" : "Suggestions";

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
      <form
        action={`/${locale}/products`}
        method="get"
        onSubmit={handleSubmit}
        aria-busy={isPending}
        className="relative w-full"
      >
        <div className="flex min-h-[60px] items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 shadow-[var(--shadow-sm)] transition focus-within:border-[var(--color-focus-ring)] focus-within:ring-2 focus-within:ring-[var(--color-focus-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-surface)] sm:px-5">
          <span className="text-[var(--color-text-muted)]">
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
            name="q"
            type="text"
            value={draftQuery}
            autoFocus={autoFocus}
            autoComplete="off"
            onChange={(e) => setDraftQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            aria-label={text.searchInputLabel}
            className="h-full w-full bg-transparent py-4 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:opacity-50 sm:px-5"
          >
            {isPending ? text.searching : text.searchButton}
          </button>
        </div>

        <span className="sr-only" role="status" aria-live="polite">
          {isPending ? text.searching : ""}
        </span>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-[68px] z-20 max-h-[340px] overflow-y-auto rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] sm:max-h-[380px]">
            {visibleRecents.length > 0 && (
              <section className="border-b border-[var(--color-border)]">
                <div className="bg-[var(--color-surface-muted)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:px-5">
                  {text.recentSearches}
                </div>

                <div className="divide-y divide-[var(--color-border)]">
                  {visibleRecents.map((recent, recentIndex) => (
                    <button
                      key={recent}
                      type="button"
                      ref={(node) => {
                        dropdownOptionRefs.current[recentIndex] = node;
                      }}
                      onClick={() => selectDropdownItem(recent)}
                      onMouseDown={(event) => event.preventDefault()}
                      onFocus={() => {
                        setIsFocused(true);
                        setHighlightedIndex(recentIndex);
                      }}
                      onKeyDown={(event) =>
                        handleDropdownKeyDown(
                          event,
                          recentIndex,
                          dropdownItems.length
                        )
                      }
                      className={`group block w-full border-l-4 px-4 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)] sm:px-5 ${
                        highlightedIndex === recentIndex
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                          : "border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-text-inverse)] active:border-[var(--color-primary)] active:bg-[var(--color-primary)] active:text-[var(--color-text-inverse)]"
                      }`}
                    >
                      <span
                        className={`block font-medium ${
                          highlightedIndex === recentIndex
                            ? "text-[var(--color-text-inverse)]"
                            : "text-[var(--color-text)] group-hover:text-[var(--color-text-inverse)] group-active:text-[var(--color-text-inverse)]"
                        }`}
                      >
                        {recent}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs ${
                          highlightedIndex === recentIndex
                            ? "text-[var(--color-primary-soft)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-soft)] group-active:text-[var(--color-primary-soft)]"
                        }`}
                      >
                        {text.recent}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {flattenedSuggestions.length > 0 && (
              <section className="border-b border-[var(--color-border)]">
                <div className="bg-[var(--color-surface-muted)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:px-5">
                  {suggestionsTitle}
                </div>

                <div className="divide-y divide-[var(--color-border)]">
                  {flattenedSuggestions.map((suggestion, suggestionIndex) => {
                    const currentIndex = suggestionStartIndex + suggestionIndex;
                    const label = getSuggestionLabel(suggestion._matchType, text);
                    const isHighlighted = highlightedIndex === currentIndex;
                    const isCrossReference =
                      suggestion._matchType === "Cross Ref" &&
                      !hasExactPartNumberSuggestion;
                    const isRelationMatch =
                      (suggestion._matchType === "Cross Ref" ||
                        suggestion._matchType === "Same-brand Ref" ||
                        suggestion._matchType === "Kit Component") &&
                      !hasExactPartNumberSuggestion;
                    const isPreliminaryReference =
                      isRelationMatch &&
                      isPreliminaryRelation(suggestion._matchedRelation);
                    const brandLabel = formatBrandLabel(suggestion.brand);
                    const secondaryText = isRelationMatch
                      ? [brandLabel, suggestion.title]
                          .filter(Boolean)
                          .join(" \u00B7 ")
                      : "";

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
                            dropdownItems.length
                          )
                        }
                        className={`group block w-full border-l-4 px-4 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)] sm:px-5 sm:py-3 ${
                          isHighlighted
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] [&_mark]:bg-[var(--color-primary-hover)] [&_mark]:text-[var(--color-text-inverse)]"
                            : "border-transparent hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-text-inverse)] active:border-[var(--color-primary)] active:bg-[var(--color-primary)] active:text-[var(--color-text-inverse)]"
                        }`}
                        >
                        <span className="flex min-w-0 flex-wrap items-center gap-2">
                          {isRelationMatch ? (
                            <span
                              className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${
                                isHighlighted
                                  ? isPreliminaryReference
                                    ? "border-[var(--color-warning-soft)] bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]"
                                    : "border-[var(--color-success-soft)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]"
                                  : isPreliminaryReference
                                    ? "border-[var(--color-warning-soft)] bg-[var(--color-warning-soft)] text-[var(--color-warning-text)] group-hover:border-[var(--color-warning-soft)] group-hover:bg-[var(--color-warning-soft)] group-hover:text-[var(--color-warning-text)] group-active:border-[var(--color-warning-soft)] group-active:bg-[var(--color-warning-soft)] group-active:text-[var(--color-warning-text)]"
                                    : "border-[var(--color-success-soft)] bg-[var(--color-success-soft)] text-[var(--color-success-text)] group-hover:border-[var(--color-success-soft)] group-hover:bg-[var(--color-success-soft)] group-hover:text-[var(--color-success-text)] group-active:border-[var(--color-success-soft)] group-active:bg-[var(--color-success-soft)] group-active:text-[var(--color-success-text)]"
                              }`}
                            >
                              {suggestion._matchType === "Kit Component"
                                ? label
                                : getReferenceBadgeText(
                                    locale,
                                    draftQuery,
                                    isPreliminaryReference,
                                  )}
                            </span>
                          ) : null}
                          <span
                            className={`min-w-0 break-all font-medium ${
                              isHighlighted
                                ? "text-[var(--color-text-inverse)]"
                                : "text-[var(--color-text)] group-hover:text-[var(--color-text-inverse)] group-active:text-[var(--color-text-inverse)]"
                            }`}
                          >
                            {highlightMatch(suggestion.partNo, draftQuery)}
                          </span>
                        </span>
                        <span
                          className={`mt-1 block text-xs leading-5 ${
                            isHighlighted
                              ? "text-[var(--color-primary-soft)]"
                              : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-soft)] group-active:text-[var(--color-primary-soft)]"
                          }`}
                        >
                          {isRelationMatch ? (
                            <span className="font-semibold">
                              {highlightMatch(secondaryText, draftQuery)}
                            </span>
                          ) : (
                            <>
                              <span
                                className={`font-semibold uppercase tracking-wide ${
                                  isHighlighted
                                    ? "text-[var(--color-primary-soft)]"
                                    : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-soft)] group-active:text-[var(--color-primary-soft)]"
                                }`}
                              >
                                {label}
                              </span>
                              <span className="px-1.5 text-[var(--color-border-strong)] group-hover:text-[var(--color-primary-soft)] group-active:text-[var(--color-primary-soft)]">•</span>
                              {highlightMatch(brandLabel, draftQuery)}
                              {suggestion.title ? (
                                <>
                                  {text.bySeparator}
                                  {highlightMatch(suggestion.title, draftQuery)}
                                </>
                              ) : null}
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {showViewAllResults && (
              <section>
                <button
                  type="button"
                  ref={(node) => {
                    dropdownOptionRefs.current[viewAllIndex] = node;
                  }}
                  onClick={() =>
                    navigateToQuery(draftQuery, { scrollToResults: true })
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onFocus={() => {
                    setIsFocused(true);
                    setHighlightedIndex(viewAllIndex);
                  }}
                  onKeyDown={(event) =>
                    handleDropdownKeyDown(event, viewAllIndex, dropdownItems.length)
                  }
                  className={`group block w-full border-l-4 px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)] sm:px-5 ${
                    highlightedIndex === viewAllIndex
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                      : "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-text-inverse)] active:border-[var(--color-primary)] active:bg-[var(--color-primary)] active:text-[var(--color-text-inverse)]"
                  }`}
                >
                  {text.viewAllResults} &quot;{trimmedQuery}&quot;
                  <span className="ml-2 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-soft)] group-active:text-[var(--color-primary-soft)]">→</span>
                </button>
              </section>
            )}
          </div>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-[var(--color-text-muted)]">{text.tryLabel}</span>
        {exampleQueries.map((example, index) => (
          <button
            key={example}
            type="button"
            onClick={() => handleExampleClick(example)}
            className={`rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
              compactMobileExamples && index >= 3 ? "hidden sm:inline-flex" : ""
            }`}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
