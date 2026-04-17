"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqId: string;
  currentStatus: string;
};

function getDefaultNextFollowUpLocal() {
  const now = new Date();
  now.setDate(now.getDate() + 3);
  now.setHours(9, 0, 0, 0);

  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function QuoteWorkflowForm({
  rfqId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const disabled =
    currentStatus === "closed" || currentStatus === "spam";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (disabled) {
      setError("This RFQ cannot be quoted.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/rfq/${rfqId}/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note,
          nextFollowUpAt,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to mark RFQ as quoted.");
      }

      setNote("");
      setNextFollowUpAt("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark RFQ as quoted."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="quote-note"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Quote Note
        </label>
        <textarea
          id="quote-note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Quoted customer, sent pricing, waiting confirmation..."
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="quote-next-followup"
            className="block text-sm font-medium text-slate-800"
          >
            Next Follow-up
          </label>

          <button
            type="button"
            onClick={() => setNextFollowUpAt(getDefaultNextFollowUpLocal())}
            className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
          >
            Set +3 days
          </button>
        </div>

        <input
          id="quote-next-followup"
          type="datetime-local"
          value={nextFollowUpAt}
          onChange={(e) => setNextFollowUpAt(e.target.value)}
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
        {submitting
          ? "Saving..."
          : currentStatus === "quoted"
          ? "Update Quotation Workflow"
          : "Mark as Quoted"}
      </button>
    </form>
  );
}