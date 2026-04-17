"use client";

import { useState } from "react";
import { Mail, MessageCircle, Phone, Copy, Check } from "lucide-react";

type Props = {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  lineId?: string | null;
};

export default function RfqQuickActions({
  name,
  company,
  email,
  phone,
  lineId,
}: Props) {
  const [copied, setCopied] = useState(false);

  const summary = [
    `Name: ${name || "-"}`,
    `Company: ${company || "-"}`,
    `Email: ${email || "-"}`,
    `Phone: ${phone || "-"}`,
    `LINE ID: ${lineId || "-"}`,
  ].join("\n");

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const normalizedLine = (lineId || "").replace(/^@/, "").trim();
  const lineUrl = normalizedLine
    ? `https://line.me/ti/p/~${encodeURIComponent(normalizedLine)}`
    : null;

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Quick actions</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Contact customer faster from this RFQ.
      </p>

      <div className="mt-4 grid gap-3">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15"
          >
            <Phone className="h-4 w-4" />
            Call customer
          </a>
        ) : null}

        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-900"
          >
            <Mail className="h-4 w-4" />
            Send email
          </a>
        ) : null}

        {lineUrl ? (
          <a
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15"
          >
            <MessageCircle className="h-4 w-4" />
            Open LINE
          </a>
        ) : null}

        <button
          type="button"
          onClick={copySummary}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy contact info"}
        </button>
      </div>

      {!phone && !email && !lineId ? (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          No direct contact info available on this RFQ.
        </div>
      ) : null}
    </div>
  );
}