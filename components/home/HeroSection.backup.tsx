import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 shadow-sm">
            {t("badge")}
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/quote`}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {t("primaryCta")}
            </Link>

            <Link
              href={`/${locale}#products`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {t("secondaryCta")}
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-500">{t("secondaryNote")}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {t("trust.1.label")}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {t("trust.1.value")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {t("trust.2.label")}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {t("trust.2.value")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {t("trust.3.label")}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {t("trust.3.value")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative h-[340px] overflow-hidden rounded-2xl bg-slate-100 lg:h-[460px]">
            <Image
              src="/hero/warehouse-main.png"
              alt="Industrial warehouse with NTN, Donaldson, and MANN-FILTER products"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}