"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqId: string;
  currentStatus: string;
  initialQuoteRef?: string | null;
  initialQuotedBy?: string | null;
  initialQuoteAmount?: string | null;
  initialQuoteCurrency?: string | null;
  initialQuotedAt?: string | null;
  initialValidUntil?: string | null;
};

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function QuoteRecordForm({
  rfqId,
  currentStatus,
  initialQuoteRef,
  initialQuotedBy,
  initialQuoteAmount,
  initialQuoteCurrency,
  initialQuotedAt,
  initialValidUntil,
}: Props) {
  const router = useRouter();

  const [quoteRef, setQuoteRef] = useState(initialQuoteRef || "");
  const [quotedBy, setQuotedBy] = useState(initialQuotedBy || "");
  const [quoteAmount, setQuoteAmount] = useState(initialQuoteAmount || "");
  const [quoteCurrency, setQuoteCurrency] = useState(
    initialQuoteCurrency || "THB"
  );
  const [quotedAt, setQuotedAt] = useState(
    toDateTimeLocal(initialQuotedAt) || toDateTimeLocal(new Date().toISOString())
  );
  const [validUntil, setValidUntil] = useState(toDateTimeLocal(initialValidUntil));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const disabled = currentStatus === "closed" || currentStatus === "spam";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (disabled) {
      setError("This RFQ cannot be updated as quoted.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/rfq/${rfqId}/quote-record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteRef,
          quotedBy,
          quoteAmount,
          quoteCurrency,
          quotedAt,
          validUntil,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to save quote record.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save quote record."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="quote-ref"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Quote Ref
          </label>
          <input
            id="quote-ref"
            type="text"
            value={quoteRef}
            onChange={(e) => setQuoteRef(e.target.value)}
            placeholder="QT-2026-001"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="quoted-by"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Quoted By
          </label>
          <input
            id="quoted-by"
            type="text"
            value={quotedBy}
            onChange={(e) => setQuotedBy(e.target.value)}
            placeholder="Sales / Admin"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="quote-amount"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Quote Amount
          </label>
          <input
            id="quote-amount"
            type="text"
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            placeholder="15000.00"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="quote-currency"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Currency
          </label>
          <input
            id="quote-currency"
            type="text"
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            placeholder="THB"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm uppercase text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="quoted-at"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Quoted At
          </label>
          <input
            id="quoted-at"
            type="datetime-local"
            value={quotedAt}
            onChange={(e) => setQuotedAt(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="valid-until"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Valid Until
          </label>
          <input
            id="valid-until"
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled || submitting}
        className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Quote Record"}
      </button>
    </form>
  );
}