// components/search/ModeToggle.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function safeStr(v: any) {
  return String(v ?? "").trim();
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Mode = "part" | "spec";

export default function ModeToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = safeStr(sp.get("q"));
  const brand = safeStr(sp.get("brand"));
  const limit = safeStr(sp.get("limit"));

  const modeRaw = safeStr(sp.get("mode")).toLowerCase();
  const mode: Mode = modeRaw === "spec" ? "spec" : "part";

  function setMode(next: Mode) {
    const p = new URLSearchParams();

    if (q) p.set("q", q);
    if (brand) p.set("brand", brand);
    if (limit) p.set("limit", limit);
    p.set("mode", next);

    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => setMode("part")}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold transition",
          mode === "part"
            ? "bg-red-600 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
        aria-pressed={mode === "part"}
      >
        Part / Xref / OEM
      </button>

      <button
        type="button"
        onClick={() => setMode("spec")}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold transition",
          mode === "spec"
            ? "bg-red-600 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
        aria-pressed={mode === "spec"}
      >
        Spec / Dimensions
      </button>
    </div>
  );
}