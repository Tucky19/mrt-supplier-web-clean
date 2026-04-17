"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqId: string;
  currentStatus: string;
  initialQuoteDocumentUrl?: string | null;
  initialQuoteSentAt?: string | null;
  initialQuoteSentNote?: string | null;
};

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function QuoteDocumentForm({
  rfqId,
  currentStatus,
  initialQuoteDocumentUrl,
  initialQuoteSentAt,
  initialQuoteSentNote,
}: Props) {
  const router = useRouter();

  const [quoteDocumentUrl, setQuoteDocumentUrl] = useState(
    initialQuoteDocumentUrl || ""
  );
  const [quoteSentAt, setQuoteSentAt] = useState(
    toDateTimeLocal(initialQuoteSentAt) || toDateTimeLocal(new Date().toISOString())
  );
  const [quoteSentNote, setQuoteSentNote] = useState(initialQuoteSentNote || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const disabled = currentStatus === "closed" || currentStatus === "spam";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (disabled) {
      setError("This RFQ cannot be updated.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/admin/rfq/${rfqId}/quote-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteDocumentUrl,
          quoteSentAt,
          quoteSentNote,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to save quote document.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save quote document."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="quote-document-url"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Quote Document URL
        </label>
        <input
          id="quote-document-url"
          type="url"
          value={quoteDocumentUrl}
          onChange={(e) => setQuoteDocumentUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="quote-sent-at"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Quote Sent At
        </label>
        <input
          id="quote-sent-at"
          type="datetime-local"
          value={quoteSentAt}
          onChange={(e) => setQuoteSentAt(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="quote-sent-note"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Quote Sent Note
        </label>
        <textarea
          id="quote-sent-note"
          rows={4}
          value={quoteSentNote}
          onChange={(e) => setQuoteSentNote(e.target.value)}
          placeholder="Sent quotation to customer by email / LINE..."
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        />
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
        {submitting ? "Saving..." : "Save Quote Document"}
      </button>
    </form>
  );
}