"use client";

import { useId, useState, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { getSearchUiText } from "@/lib/i18n/searchUi";

export default function NoResultsContactActions({
  query,
  locale,
  children,
}: {
  query: string;
  locale: string;
  children: ReactNode;
}) {
  const text = getSearchUiText(locale);
  const feedbackId = useId();
  const fallbackId = useId();
  const [status, setStatus] = useState<"idle" | "copying" | "success" | "error">("idle");

  async function copyQuery() {
    setStatus("copying");
    try {
      // Copy the original decoded URL query, without normalization or formatting.
      await navigator.clipboard.writeText(query);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={copyQuery}
          disabled={!query || status === "copying"}
          aria-describedby={feedbackId}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 disabled:opacity-50"
        >
          <Copy className="h-5 w-5" aria-hidden="true" />
          {status === "copying" ? text.copyingSearchText : text.copySearchText}
        </button>
        {children}
      </div>
      <p id={feedbackId} role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm text-[var(--color-text-muted)]">
        {status === "success" ? text.searchTextCopied : status === "error" ? text.searchTextCopyFailed : text.copySearchHint}
      </p>
      {status === "error" && (
        <div className="mx-auto mt-3 max-w-xl text-left">
          <label htmlFor={fallbackId} className="text-sm font-medium text-[var(--color-text)]">{text.searchTextToCopy}</label>
          <textarea
            id={fallbackId}
            readOnly
            value={query}
            onFocus={(event) => event.currentTarget.select()}
            aria-describedby={feedbackId}
            rows={2}
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          />
        </div>
      )}
    </div>
  );
}
