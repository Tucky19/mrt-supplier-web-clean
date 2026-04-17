"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RfqNoteBox({ rfqId }: { rfqId: string }) {
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    const cleanNote = note.trim();
    if (!cleanNote) return;

    setErrorMsg("");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/rfq/${rfqId}/note`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: cleanNote }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Failed to save note.");
        }

        setNote("");
        router.refresh();
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "Failed to save note.");
      }
    });
  }

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6">
      <p className="text-sm font-semibold text-white">Add internal note</p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-3 min-h-[120px] w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-emerald-400"
        placeholder="e.g. Called customer, waiting for supplier price, requested delivery confirmation..."
      />

      {errorMsg ? (
        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {errorMsg}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="mt-3 rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save note"}
      </button>
    </div>
  );
}