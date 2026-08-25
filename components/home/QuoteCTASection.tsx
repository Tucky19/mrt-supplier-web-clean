import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getHomeQuoteCtaText } from "@/lib/i18n/homeUi";

const darkFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-text)]";

export default function QuoteCTASection({ locale }: { locale: string }) {
  const text = getHomeQuoteCtaText(locale);
  const lineUrl = "https://lin.ee/S676yYH";

  return (
    <section id="contact" className="mrt-blueprint-section border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-text)] px-6 py-10 text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-inverse)] opacity-70">
              {text.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {text.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-inverse)] opacity-75 lg:text-base">
              {text.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/quote`}
              className={`inline-flex min-h-11 items-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] ${darkFocusClass}`}
            >
              {text.primaryCta}
            </Link>

            <Link
              href={`/${locale}/products`}
              className={`inline-flex min-h-11 items-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-text-inverse)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] ${darkFocusClass}`}
            >
              {text.secondaryCta}
            </Link>

            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-success-soft)] bg-[var(--color-success-soft)] px-6 py-3 text-sm font-medium text-[var(--color-success-text)] transition hover:bg-[var(--color-surface)] ${darkFocusClass}`}
            >
              <MessageCircle className="h-4 w-4" />
              {text.lineCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
