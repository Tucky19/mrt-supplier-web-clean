"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rfqs: Array<{
    id: string;
    requestId: string;
  }>;
};

type BulkStatus = "in_progress" | "quoted" | "closed";

export default function BulkStatusActions({ rfqs }: Props) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<BulkStatus | null>(null);
  const [error, setError] = useState("");

  const allIds = useMemo(() => rfqs.map((rfq) => rfq.id), [rfqs]);

  const allSelected = selectedIds.length > 0 && selectedIds.length === allIds.length;

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));
  }

  async function runBulkAction(nextStatus: BulkStatus) {
    if (selectedIds.length === 0) {
      setError("Please select at least one RFQ.");
      return;
    }

    try {
      setError("");
      setLoadingStatus(nextStatus);

      const res = await fetch("/api/admin/rfq/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedIds,
          nextStatus,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to update selected RFQs.");
      }

      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update selected RFQs."
      );
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Bulk Actions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select multiple RFQs and update their status together.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {allSelected ? "Clear All" : "Select All"}
          </button>

          <button
            type="button"
            onClick={() => runBulkAction("in_progress")}
            disabled={loadingStatus !== null}
            className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 transition hover:border-amber-400 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingStatus === "in_progress" ? "Saving..." : "Mark In Progress"}
          </button>

          <button
            type="button"
            onClick={() => runBulkAction("quoted")}
            disabled={loadingStatus !== null}
            className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingStatus === "quoted" ? "Saving..." : "Mark Quoted"}
          </button>

          <button
            type="button"
            onClick={() => runBulkAction("closed")}
            disabled={loadingStatus !== null}
            className="inline-flex rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingStatus === "closed" ? "Saving..." : "Mark Closed"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Selected: <span className="font-semibold text-slate-900">{selectedIds.length}</span>
        </p>

        {error ? (
          <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </div>

      <input
        type="hidden"
        value={selectedIds.join(",")}
        readOnly
        aria-hidden="true"
      />

      <div className="hidden" id="bulk-status-actions-selection">
        {selectedIds.join(",")}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__mrtBulkSelection = ${JSON.stringify(selectedIds)};
          `,
        }}
      />
    </div>
  );
}

export function BulkCheckbox({
  rfqId,
  checked,
  onToggle,
}: {
  rfqId: string;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onToggle(rfqId)}
      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
      aria-label={`Select RFQ ${rfqId}`}
    />
  );
}