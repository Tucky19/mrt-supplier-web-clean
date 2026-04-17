"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqId: string;
  initialAssignedTo?: string | null;
};

const OWNER_OPTIONS = ["", "Tucky", "Sales", "Admin", "Owner"];

export default function OwnerAssignmentForm({
  rfqId,
  initialAssignedTo,
}: Props) {
  const router = useRouter();
  const [assignedTo, setAssignedTo] = useState(initialAssignedTo || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const res = await fetch(`/api/admin/rfq/${rfqId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to assign owner.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign owner.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="assigned-to"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Assigned To
        </label>

        <select
          id="assigned-to"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        >
          {OWNER_OPTIONS.map((owner) => (
            <option key={owner || "unassigned"} value={owner}>
              {owner || "Unassigned"}
            </option>
          ))}
        </select>
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
        {submitting ? "Saving..." : "Save Owner"}
      </button>
    </form>
  );
}