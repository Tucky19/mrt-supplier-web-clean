"use client";

import { useState } from "react";

type RfqNoteFormProps = {
  rfqId: string;
};

export default function RfqNoteForm({ rfqId }: RfqNoteFormProps) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/rfq/${rfqId}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save note.");
      }

      setNote("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Add internal note..."
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || !note.trim()}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save note"}
      </button>
    </form>
  );
}