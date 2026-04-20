"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

type Tab = "part" | "spec";

type Props = {
  className?: string;
  defaultTab?: Tab;
  autoFocus?: boolean;

  // NEW
  defaultQuery?: string;
  defaultBrand?: string;
  defaultMode?: "part" | "spec";
};

function safeStr(v: any) {
  return String(v ?? "").trim();
}

export default function SearchPanel({
  className,
  defaultTab = "part",
  autoFocus = false,
  defaultQuery = "",
  defaultBrand = "",
  defaultMode,
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const sp = useSearchParams();

  const [tab, setTab] = useState<Tab>(defaultMode || defaultTab);
  const [query, setQuery] = useState(defaultQuery);
  const [brand, setBrand] = useState(defaultBrand);

  useEffect(() => {
    const q = safeStr(sp.get("q"));
    const b = safeStr(sp.get("brand"));
    const m = safeStr(sp.get("mode"));

    if (q) setQuery(q);
    if (b) setBrand(b);
    if (m === "part" || m === "spec") setTab(m);
  }, [sp]);

  function submitSearch() {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (brand) params.set("brand", brand);
    if (tab) params.set("mode", tab);

    router.push(`/${locale}/products?${params.toString()}`);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitSearch();
    }
  }

  return (
    <div className={`card card-padding ${className || ""}`}>

      {/* Tabs */}

      <div className="flex gap-2 mb-4">

        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "part"
              ? "bg-white text-black"
              : "bg-white/5 text-white/70"
          }`}
          onClick={() => setTab("part")}
        >
          Part / Cross Ref
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "spec"
              ? "bg-white text-black"
              : "bg-white/5 text-white/70"
          }`}
          onClick={() => setTab("spec")}
        >
          Spec Search
        </button>

      </div>

      {/* Inputs */}

      <div className="flex flex-col md:flex-row gap-3">

        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleEnter}
          placeholder={
            tab === "part"
              ? "Search part number / OEM / cross reference"
              : "Search specification (OD ID Height)"
          }
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40"
        />

        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand (optional)"
          className="w-full md:w-40 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40"
        />

        <button
          onClick={submitSearch}
          className="rounded-lg bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
        >
          Search
        </button>

      </div>

    </div>
  );
}
