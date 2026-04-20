"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";

function safeNum(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const cleaned = s.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join("")}`;
  return cleaned;
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function BearingBuilder({
  className = "",
  defaultOpen = false,
}: {
  className?: string;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const sp = useSearchParams();

  const [open, setOpen] = useState(defaultOpen);

  const [id, setId] = useState("");
  const [od, setOd] = useState("");
  const [w, setW] = useState("");

  const canSearch = useMemo(() => {
    return Boolean(id.trim() && od.trim() && w.trim());
  }, [id, od, w]);

  function buildTriple() {
    if (!canSearch) return "";
    return `${id.trim()}x${od.trim()}x${w.trim()}`;
  }

  function go() {
    const triple = buildTriple();
    if (!triple) return;

    const next = new URLSearchParams(sp.toString());
    next.set("q", triple);
    next.set("mode", "spec"); // spec mode แต่ engine บังคับ exact
    router.push(`/${locale}/products?${next.toString()}`);
  }

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">
            Bearing Builder (Exact Match)
          </div>
          <div className="text-xs text-white/60">
            ใส่ ID / OD / Width ระบบจะค้นหาแบบตรงขนาดเท่านั้น
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
        >
          {open ? "Hide" : "Open"}
        </button>
      </div>

      {open && (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Field label="ID (mm)" value={id} onChange={(v) => setId(safeNum(v))} placeholder="25" />
            <Field label="OD (mm)" value={od} onChange={(v) => setOd(safeNum(v))} placeholder="52" />
            <Field label="Width (mm)" value={w} onChange={(v) => setW(safeNum(v))} placeholder="15" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-white/60">
              Query:{" "}
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-white/80">
                {buildTriple() || "—"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setId("");
                  setOd("");
                  setW("");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
              >
                Clear
              </button>

              <button
                disabled={!canSearch}
                onClick={go}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                Search Bearing
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[11px] font-semibold text-white/60">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}
