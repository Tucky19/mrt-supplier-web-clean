import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RFQSuccessDataLayer from "@/components/analytics/RFQSuccessDataLayer";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getRfqUiText } from "@/lib/i18n/rfqUi";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ rid?: string; pf?: string; fx?: string; line?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = getRfqUiText(locale);

  return {
    title: `${text.requestSubmitted} | MRT Supplier`,
    description: text.successBody,
  };
}

export default async function QuoteSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { rid = "", pf = "", fx = "", line = "" } = await searchParams;
  const text = getRfqUiText(locale);
  const partialFailure = pf === "1";
  const failures = fx
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const lineFailed = line === "0" || failures.includes("line_notify");

  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={null}>
        <RFQSuccessDataLayer locale={locale} />
      </Suspense>

      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {text.requestSubmitted}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {text.successTitle}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {text.successBody}
          </p>

          {rid ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {text.rfqReference}
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-950">
                {rid}
              </p>
            </div>
          ) : null}

          {partialFailure ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
              <p className="font-semibold">{text.partialFailureTitle}</p>
              <p className="mt-2">{text.partialFailureBody}</p>
              {lineFailed ? <p className="mt-2">{text.partialLineNote}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-7 text-slate-700">
            {text.sendMoreInfo}
          </div>

          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {text.nextSteps}
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {text.nextStep1Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text.nextStep1Body}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {text.nextStep2Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text.nextStep2Body}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {text.nextStep3Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text.nextStep3Body}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              {text.backToHome}
            </Link>

            <Link
              href={`/${locale}/products`}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              {text.backToProducts}
            </Link>

            <a
              href="https://lin.ee/S676yYH"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              {text.sendDetailsOnLine}
            </a>

            <a
              href="mailto:sales@mrtsupplier.com"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              sales@mrtsupplier.com
            </a>

            <a
              href="tel:0970122111"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              097 012 2111
            </a>

            <a
              href="tel:0815581323"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              081 558 1323
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
