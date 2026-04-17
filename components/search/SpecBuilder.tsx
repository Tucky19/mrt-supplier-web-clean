"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function safeNum(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  // allow digits + dot only
  const cleaned = s.replace(/[^\d.]/g, "");
  // prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join("")}`;
  return cleaned;
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function SpecBuilder({
  className = "",
  defaultOpen = false,
}: {
  className?: string;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [open, setOpen] = useState(defaultOpen);

  const [od, setOd] = useState("");
  const [id, setId] = useState("");
  const [h, setH] = useState("");
  const [thread, setThread] = useState("");

  const canSearch = useMemo(() => {
    return Boolean(od.trim() || id.trim() || h.trim() || thread.trim());
  }, [od, id, h, thread]);

  function buildQuery() {
    const parts: string[] = [];
    if (od.trim()) parts.push(`od${od.trim()}`);
    if (id.trim()) parts.push(`id${id.trim()}`);
    if (h.trim()) parts.push(`h${h.trim()}`);
    if (thread.trim()) parts.push(thread.trim());
    return parts.join(" ");
  }

  function go() {
    const q = buildQuery().trim();
    if (!q) return;

    const next = new URLSearchParams(sp.toString());
    next.set("q", q);
    next.set("mode", "spec");
    router.push(`/search?${next.toString()}`);
  }

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Spec Builder</div>
          <div className="text-xs text-white/60">
            ใส่ขนาดเป็น mm ระบบจะค้นหาแบบ Spec Mode (Filter ±5mm / Bearing exact)
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
        >
          {open ? "Hide" : "Open"}
        </button>
      </div>

      {open && (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Field label="OD (mm)" value={od} onChange={(v) => setOd(safeNum(v))} placeholder="108" />
            <Field label="ID (mm)" value={id} onChange={(v) => setId(safeNum(v))} placeholder="93" />
            <Field label="H (mm)" value={h} onChange={(v) => setH(safeNum(v))} placeholder="262" />
            <Field
              label="Thread (optional)"
              value={thread}
              onChange={setThread}
              placeholder='1-1/8-16'
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-white/60">
              Query:{" "}
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-white/80">
                {buildQuery() || "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOd("");
                  setId("");
                  setH("");
                  setThread("");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={!canSearch}
                onClick={go}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Search Spec
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