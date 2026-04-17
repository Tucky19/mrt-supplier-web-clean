"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddNoteFormProps = {
  rfqId: string;
};

export default function AddNoteForm({ rfqId }: AddNoteFormProps) {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = note.trim();

    if (!trimmed) {
      setError("Please enter a note.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/admin/rfq/${rfqId}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: trimmed,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to save note");
      }

      setNote("");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save note";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="rfq-note"
          className="mb-2 block text-sm font-medium text-neutral-200"
        >
          Add internal note
        </label>

        <textarea
          id="rfq-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Write note for this RFQ..."
          className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-neutral-600"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          Internal only • not visible to customer
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save note"}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      ) : null}
    </form>
  );
}