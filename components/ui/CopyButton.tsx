"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  label?: string;
  copiedLabel?: string;
  failedLabel?: string;
  className?: string;
  disabled?: boolean;
};

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  failedLabel,
  className = "",
  disabled = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function onCopy() {
    if (disabled || status === "copying") return;

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setStatus("copying");
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      resetTimerRef.current = window.setTimeout(() => {
        setStatus("idle");
        resetTimerRef.current = null;
      }, 1200);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled || status === "copying"}
      aria-live="polite"
      className={
        className ||
        "rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {status === "copied" ? copiedLabel : status === "failed" ? failedLabel ?? label : label}
    </button>
  );
}
