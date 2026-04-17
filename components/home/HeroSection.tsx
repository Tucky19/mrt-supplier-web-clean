import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SearchHero from "@/components/home/SearchHero";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
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

          <div className="mt-8">
            <SearchHero />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/th/quote"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {t("primaryCta")}
            </Link>

            <Link
              href="/th/contact"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {t("secondaryCta")}
            </Link>
          </div>

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
          <div className="relative h-[340px] overflow-hidden rounded-2xl bg-slate-100 lg:h-[520px]">
            <Image
              src="/hero/warehouse-main.png"
              alt="Industrial warehouse with NTN, Donaldson, and MANN-FILTER products"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}