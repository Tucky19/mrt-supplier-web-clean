import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function QuoteCTASection() {
  const t = useTranslations("quoteSection");
  const locale = useLocale();
  const lineUrl = "http://line.me/ti/p/hA4-akZkxn";

  return (
    <section id="contact" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white shadow-sm lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
              MRT Supplier
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 lg:text-base">
              {t("description")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/quote`}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              {t("primaryCta")}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-medium text-white transition hover:border-slate-400"
            >
              {t("secondaryCta")}
            </Link>

            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <MessageCircle className="h-4 w-4" />
              {t("lineCta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
