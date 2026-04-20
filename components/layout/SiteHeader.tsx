"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const LINE_URL = "https://lin.ee/R3vfZW0";

function swapLocale(pathname: string, nextLocale: "th" | "en") {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (segments[0] === "th" || segments[0] === "en") {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  return `/${nextLocale}/${segments.join("/")}`;
}

export default function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as "th" | "en";
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-4">
          <div className="relative h-14 w-[150px] shrink-0">
            <Image
              src="/logo-mrt.png"
              alt="MRT Supplier Co., Ltd."
              fill
              priority
              sizes="150px"
              className="object-contain object-left"
            />
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold tracking-wide text-slate-900">
              MRT Supplier
            </p>
            <p className="text-xs text-slate-500">Industrial Parts Supplier</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}`}
            className="text-sm text-slate-700 transition hover:text-slate-950"
          >
            {t("home")}
          </Link>

          <Link
            href={`/${locale}#brands`}
            className="text-sm text-slate-700 transition hover:text-slate-950"
          >
            {t("brands")}
          </Link>

          <Link
            href={`/${locale}/products`}
            className="text-sm text-slate-700 transition hover:text-slate-950"
          >
            {locale === "th" ? "Search Product" : "Search Products"}
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="text-sm text-slate-700 transition hover:text-slate-950"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Add LINE
          </a>

          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <div className="px-2 text-slate-500">
              <Globe className="h-4 w-4" />
            </div>

            <Link
              href={swapLocale(pathname, "th")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                locale === "th"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ไทย
            </Link>

            <Link
              href={swapLocale(pathname, "en")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                locale === "en"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </Link>
          </div>

          <Link
            href={`/${locale}/quote`}
            className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 md:inline-flex"
          >
            {t("quote")}
          </Link>
        </div>
      </div>
    </header>
  );
}
