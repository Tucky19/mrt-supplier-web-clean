"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Copy, Search } from "lucide-react";

type Props = {
  partNo: string;
};

export default function ProductHeaderActions({ partNo }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(partNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        <span>Back</span>
      </button>

      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100"
      >
        <Copy className="h-4 w-4" strokeWidth={2} />
        <span>{copied ? "Copied" : "Copy part no."}</span>
      </button>

      <a
        href={`/search?q=${encodeURIComponent(partNo)}`}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
        <span>Search similar</span>
      </a>
    </div>
  );
}