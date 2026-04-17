"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRfqStatus } from "@/app/admin/rfq/[id]/actions";
import type { RfqStatusValue } from "@/lib/rfq/types";

type Props = {
  rfqId: string;
  currentStatus: string;
};

const STATUS_OPTIONS: Array<{ value: RfqStatusValue; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

function btnStyle(active: boolean) {
  return active
    ? "border-emerald-500/20 bg-emerald-400 text-black"
    : "border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800";
}

export default function RfqStatusActions({ rfqId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  function handle(status: RfqStatusValue) {
    setErrorMsg("");

    const formData = new FormData();
    formData.set("id", rfqId);
    formData.set("status", status);

    startTransition(async () => {
      try {
        await updateRfqStatus(formData);
        router.refresh();
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to update RFQ status."
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handle(option.value)}
            disabled={isPending}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${btnStyle(
              currentStatus === option.value
            )}`}
          >
            {isPending && currentStatus !== option.value ? "Updating..." : option.label}
          </button>
        ))}
      </div>

      {errorMsg ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {errorMsg}
        </div>
      ) : null}
    </div>
  );
}