"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  followUpId: string;
  disabled?: boolean;
};

export default function FollowUpDoneButton({
  followUpId,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (disabled || loading) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/rfq/follow-up/${followUpId}/done`, {
        method: "POST",
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to mark follow-up done.");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to mark follow-up done."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : "Mark Done"}
    </button>
  );
}