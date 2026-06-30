"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  disabled?: boolean;
};

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
  disabled = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function onCopy() {
    if (disabled) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1200);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled}
      className={
        className ||
        "rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
