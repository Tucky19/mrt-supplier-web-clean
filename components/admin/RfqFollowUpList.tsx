"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FollowUpRow = {
  id: string;
  note: string | null;
  dueAt: string | Date;
  doneAt: string | Date | null;
};

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RfqFollowUpList({
  followUps,
}: {
  followUps: FollowUpRow[];
}) {
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  async function markDone(id: string) {
    if (loadingId) return;

    setErrorMsg("");
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/rfq/follow-up/${id}/done`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to mark follow-up as done.");
      }

      router.refresh();
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to mark follow-up as done."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (followUps.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6">
        <p className="text-sm text-neutral-400">No follow-ups yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {followUps.map((followUp) => {
        const dueAt = new Date(followUp.dueAt);
        const overdue = !followUp.doneAt && dueAt.getTime() < Date.now();
        const isLoading = loadingId === followUp.id;

        return (
          <div
            key={followUp.id}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {followUp.note || "Follow-up"}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Due: {formatDate(followUp.dueAt)}
                </p>
              </div>

              {overdue ? (
                <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                  Overdue
                </span>
              ) : null}
            </div>

            {followUp.doneAt ? (
              <p className="mt-3 text-xs text-neutral-500">
                Done: {formatDate(followUp.doneAt)}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => markDone(followUp.id)}
                disabled={!!loadingId}
                className="mt-3 rounded-2xl border border-neutral-800 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Updating..." : "Mark done"}
              </button>
            )}
          </div>
        );
      })}

      {errorMsg ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {errorMsg}
        </div>
      ) : null}
    </div>
  );
}