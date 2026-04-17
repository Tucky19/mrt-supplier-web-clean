// app/components/StickyActions.tsx
"use client";

import React from "react";

export default function StickyActions({
  partNo,
  brand,
  officialUrl,
  pdfHref,
  hasStructuredSpecs,
  hasReferences,
  children,
}: {
  partNo: string;
  brand: string;
  officialUrl?: string;
  pdfHref?: string;
  hasStructuredSpecs: boolean;
  hasReferences: boolean;
  children: React.ReactNode; // AddToQuoteButton (passed from page)
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-neutral-900">{partNo}</span>
            <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
              {brand}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-neutral-600">
            <span className={`rounded-full border px-2 py-0.5 ${hasStructuredSpecs ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
              {hasStructuredSpecs ? "Structured specs" : "Basic specs"}
            </span>
            <span className={`rounded-full border px-2 py-0.5 ${hasReferences ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
              {hasReferences ? "References ready" : "No references"}
            </span>
            <span className={`rounded-full border px-2 py-0.5 ${pdfHref ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
              {pdfHref ? "Datasheet ready" : "No datasheet"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {officialUrl ? (
            <a
              href={officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              title="Open official brand page"
            >
              Official
            </a>
          ) : null}

          {pdfHref ? (
            <a
              href={pdfHref}
              download
              className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              title="Download datasheet"
            >
              Download
            </a>
          ) : null}

          <div className="min-w-[180px]">{children}</div>

          <a
            href={`/quote`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-900 px-4 text-sm font-semibold text-white hover:opacity-90"
            title="Open Quote page to submit RFQ"
          >
            Go RFQ
          </a>
        </div>
      </div>
    </div>
  );
}
