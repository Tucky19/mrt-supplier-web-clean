"use client";

import Link from "next/link";
import { parseMultiPartText } from "@/lib/search/multiPartInput";
import { useMultiPartSearch } from "@/hooks/useMultiPartSearch";

type Props = {
  locale: string;
  initiallyExpanded?: boolean;
  parseInput?: typeof parseMultiPartText;
};

export default function MultiPartNumberSearch(props: Props) {
  const { locale } = props;
  const { isThai, expanded, setExpanded, value, results, loading, error, added,
    canAddResults, foundCount, missingCount,
    ambiguousCount, text, handleLookup, handleAddAll, handleReset,
    handleInputChange } = useMultiPartSearch(props);

  return (
    <div className="mt-4 w-full">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          {text.trigger}
        </button>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                {text.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {text.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-fit rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {text.reset}
            </button>
          </div>

          <textarea
            value={value}
            onChange={(event) => handleInputChange(event.target.value)}
            placeholder={text.placeholder}
            aria-label={text.title}
            rows={6}
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-500">{text.quantityHint}</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleLookup}
              disabled={loading}
              className="inline-flex justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? text.checking : text.check}
            </button>

            {results.length > 0 ? (
              <p className="text-sm text-slate-600">
                {text.summary(foundCount, missingCount, ambiguousCount)}
              </p>
            ) : null}
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          {results.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="divide-y divide-slate-100">
                {results.map((result) => {
                  const isFound = result.status === "found";
                  const isAmbiguous = result.status === "ambiguous";
                  const isReference =
                    isFound && result.product.matchType !== "Exact";
                  const statusLabel = isFound
                    ? isReference
                      ? text.referenceFound
                      : text.found
                    : isAmbiguous
                      ? text.ambiguous
                      : text.missing;

                  return (
                    <div
                      key={result.normalizedPartNo}
                      className="grid gap-2 bg-white px-4 py-3 text-sm sm:grid-cols-[1fr_1.2fr_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                          {isThai ? "รายการที่วาง" : "Entered"}
                        </div>
                        <div className="mt-0.5 break-all font-semibold text-slate-950">
                          {result.originalPartNo}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {text.quantity(result.qty)}
                        </div>
                      </div>

                      <div className="min-w-0">
                        {isFound ? (
                          <>
                            <div className="break-all font-medium text-slate-900">
                              {result.product.partNo}
                            </div>
                            <div className="mt-0.5 text-xs leading-5 text-slate-500">
                              {[
                                result.product.brand,
                                result.product.title ?? result.product.category,
                              ]
                                .filter(Boolean)
                                .join(" • ")}
                            </div>
                          </>
                        ) : isAmbiguous ? (
                          <div className="text-xs leading-5 text-amber-700">
                            {result.matches
                              .map((match) => match.partNo)
                              .join(", ")}
                          </div>
                        ) : (
                          <div className="text-xs leading-5 text-slate-500">
                            {text.description}
                          </div>
                        )}
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isFound
                            ? "bg-emerald-50 text-emerald-700"
                            : isAmbiguous
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {results.some(
            (result) =>
              result.status === "found" && result.product.matchType !== "Exact",
          ) ? (
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {text.referenceNotice}
            </p>
          ) : null}

          {results.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddAll}
                disabled={!canAddResults}
                className="inline-flex justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {text.addAll}
              </button>

              {added ? (
                <div className="flex flex-col gap-2 text-sm text-emerald-700 sm:flex-row sm:items-center">
                  <span>{text.added}</span>
                  <Link
                    href={`/${locale}/quote`}
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    {text.quoteCta}
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
