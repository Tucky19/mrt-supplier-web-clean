"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function SearchHero() {
  const t = useTranslations("searchHero");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function buildHref(value: string) {
    const trimmed = value.trim();
    return trimmed
      ? `/${locale}/products?q=${encodeURIComponent(trimmed)}`
      : `/${locale}/products`;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(buildHref(query));
  }

  const quickLinks = ["P550958", "P164384", "Hydraulic Filter", "Donaldson"];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
        {t("label")}
      </label>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {t("button")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickLinks.map((item) => (
          <Link
            key={item}
            href={`/${locale}/products?q=${encodeURIComponent(item)}`}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
          >
            {item}
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{t("hint")}</p>
    </div>
  );
}