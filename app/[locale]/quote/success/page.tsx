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
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <Suspense fallback={null}>
        <RFQSuccessDataLayer locale={locale} />
      </Suspense>

      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] lg:p-10">
          <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-success-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-success-text)]">
            {text.requestSubmitted}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            {text.successTitle}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">
            {text.successBody}
          </p>

          {rid ? (
            <div className="mt-6 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                {text.rfqReference}
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-[var(--color-text)]">
                {rid}
              </p>
            </div>
          ) : null}

          {partialFailure ? (
            <div className="mt-6 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-warning-soft)] p-5 text-sm leading-7 text-[var(--color-warning-text)]">
              <p className="font-semibold">{text.partialFailureTitle}</p>
              <p className="mt-2">{text.partialFailureBody}</p>
              {lineFailed ? <p className="mt-2">{text.partialLineNote}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] p-5 text-sm leading-7 text-[var(--color-text)]">
            {text.sendMoreInfo}
          </div>

          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {text.nextSteps}
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {text.nextStep1Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {text.nextStep1Body}
                </p>
              </div>

              <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {text.nextStep2Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {text.nextStep2Body}
                </p>
              </div>

              <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {text.nextStep3Title}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {text.nextStep3Body}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {text.backToHome}
            </Link>

            <Link
              href={`/${locale}/products`}
              className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {text.backToProducts}
            </Link>

            <a
              href="https://lin.ee/S676yYH"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-success-text)] bg-[var(--color-success-soft)] px-5 py-3 text-sm font-medium text-[var(--color-success-text)] transition hover:bg-[var(--color-surface)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {text.sendDetailsOnLine}
            </a>

            <a
              href="mailto:sales@mrtsupplier.com"
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              sales@mrtsupplier.com
            </a>

            <a
              href="tel:0970122111"
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              097 012 2111
            </a>

            <a
              href="tel:0815581323"
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
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
