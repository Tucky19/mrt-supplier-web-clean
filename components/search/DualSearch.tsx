"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function safeStr(v: any) {
  return String(v ?? "").trim();
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
  autoFocus?: boolean;
  initialPartQ?: string;
  initialSpecQ?: string;
  initialMode?: "part" | "spec";
};

export default function DualSearch({
  className = "",
  autoFocus = false,
  initialPartQ,
  initialSpecQ,
  initialMode,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [partQ, setPartQ] = useState(initialPartQ ?? "");
  const [specQ, setSpecQ] = useState(initialSpecQ ?? "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQ = safeStr(params.get("q"));
    const rawMode = safeStr(params.get("mode")).toLowerCase();
    const urlMode = rawMode === "spec" ? "spec" : rawMode === "part" ? "part" : "";

    const mode = initialMode ?? (urlMode as "part" | "spec" | "");

    if (!urlQ) return;

    if (mode === "spec") {
      setSpecQ((prev) => prev || urlQ);
    } else {
      setPartQ((prev) => prev || urlQ);
    }
  }, [initialMode]);

  function go(mode: "part" | "spec", q: string) {
    if (isPending) return;
    const qq = safeStr(q);
    if (!qq) return;

    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(qq)}&mode=${mode}`);
    });
  }

  const canSubmitPart = safeStr(partQ).length > 0;
  const canSubmitSpec = safeStr(specQ).length > 0;

  return (
    <div className={cn(className)}>
      <div className="grid gap-3 md:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go("part", partQ);
          }}
          className="token-surface token-focus rounded-xl p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-[color:var(--text-primary)]">
              Search Part / Cross / OEM
            </div>
            <div className="text-xs text-[color:var(--text-secondary)]">
              ตัวอย่าง: P554004 • LF667 • 1R-0658
            </div>
          </div>

          <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3">
            <span className="text-[color:var(--text-secondary)]">🔎</span>

            <input
              value={partQ}
              autoFocus={autoFocus}
              onChange={(e) => setPartQ(e.target.value)}
              placeholder="Part number / Cross reference / OEM…"
              className="h-full w-full bg-transparent text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none"
            />

            {partQ && (
              <button
                type="button"
                onClick={() => setPartQ("")}
                className="rounded-lg px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Clear part search"
                title="Clear"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              disabled={!canSubmitPart || isPending}
              className="h-9 rounded-lg bg-[color:var(--accent-red)] px-4 text-sm font-semibold text-white hover:bg-[color:var(--accent-red-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "..." : "Search"}
            </button>
          </div>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            go("spec", specQ);
          }}
          className="token-surface token-focus rounded-xl p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-[color:var(--text-primary)]">
              Search Spec / Dimensions
            </div>
            <div className="text-xs text-[color:var(--text-secondary)]">
              ตัวอย่าง: od108 h262 • 25x52x15
            </div>
          </div>

          <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3">
            <span className="text-[color:var(--text-secondary)]">📐</span>

            <input
              value={specQ}
              onChange={(e) => setSpecQ(e.target.value)}
              placeholder="OD/ID/Height/Thread… (e.g. od108 h262 1-1/8-16)"
              className="h-full w-full bg-transparent text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none"
            />

            {specQ && (
              <button
                type="button"
                onClick={() => setSpecQ("")}
                className="rounded-lg px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Clear spec search"
                title="Clear"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              disabled={!canSubmitSpec || isPending}
              className="h-9 rounded-lg bg-[color:var(--accent-red)] px-4 text-sm font-semibold text-white hover:bg-[color:var(--accent-red-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-2 text-xs text-white/50">
        Tip: ช่องซ้ายเหมาะกับ “มีเบอร์” • ช่องขวาเหมาะกับ “มีขนาด/สเปก”
      </div>
    </div>
  );
}