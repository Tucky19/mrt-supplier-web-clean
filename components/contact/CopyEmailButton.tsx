"use client";

import { useState } from "react";

type Props = {
  email: string;
  label: string;
  success: string;
  failure: string;
};

export default function CopyEmailButton({ email, label, success, failure }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    setStatus("idle");
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="px-4 pb-4">
      <button
        type="button"
        onClick={handleCopy}
        className="min-h-11 rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
      >
        {label}
      </button>
      <p role="status" aria-live="polite" className="mt-2 text-sm leading-5 text-[var(--color-text-muted)]">
        {status === "copied" ? success : status === "failed" ? failure : ""}
      </p>
    </div>
  );
}
