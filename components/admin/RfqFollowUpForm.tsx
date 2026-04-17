"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqId: string;
};

function getDefaultDueAtLocal() {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  now.setMinutes(0, 0, 0);

  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function RfqFollowUpForm({ rfqId }: Props) {
  const router = useRouter();

  const [dueAt, setDueAt] = useState(getDefaultDueAtLocal());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!dueAt) {
      setError("Please select due date.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/rfq/${rfqId}/follow-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dueAt,
          note,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to create follow-up.");
      }

      setNote("");
      setDueAt(getDefaultDueAtLocal());
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create follow-up."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="followup-dueAt"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Due Date / Time
        </label>
        <input
          id="followup-dueAt"
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="followup-note"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Note
        </label>
        <textarea
          id="followup-note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Call customer, send quote, confirm stock..."
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
        disabled={submitting}
        className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Add Follow-up"}
      </button>
    </form>
  );
}