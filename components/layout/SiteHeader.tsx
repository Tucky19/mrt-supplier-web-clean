'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import TrackedLineLink from '@/components/analytics/TrackedLineLink';
import { useQuote } from '@/providers/QuoteProvider';

const LINE_URL = 'https://lin.ee/S676yYH';
const lightFocusClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]';

type Props = {
  locale: string;
};

export default function SiteHeader({ locale }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { ready, totalItems } = useQuote();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locales = ['th', 'en'] as const;
  const isThai = locale === 'th';

  const text = {
    tagline: isThai
      ? '\u0e2d\u0e30\u0e44\u0e2b\u0e25\u0e48\u0e2d\u0e38\u0e15\u0e2a\u0e32\u0e2b\u0e01\u0e23\u0e23\u0e21\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23 RFQ'
      : 'Industrial Parts & RFQ Service',
    home: isThai ? '\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01' : 'Home',
    products: isThai ? '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32' : 'Products',
    brands: isThai ? '\u0e41\u0e1a\u0e23\u0e19\u0e14\u0e4c\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32' : 'Brands',
    contact: isThai ? '\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32' : 'Contact',
    requestQuote: isThai
      ? '\u0e02\u0e2d\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'
      : 'Request Quote',
    contactLine: isThai ? 'LINE ติดต่อทีมงาน' : 'Contact on LINE',
    menu: isThai ? '\u0e40\u0e21\u0e19\u0e39' : 'Menu',
    quoteCount: isThai
      ? `${totalItems} \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e43\u0e19 RFQ`
      : `${totalItems} items in quote`,
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const getLocaleHref = (targetLocale: (typeof locales)[number]) => {
    const params = searchParams.toString();
    const query = params ? `?${params}` : '';

    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return `/${targetLocale}${query}`;
    }

    const segments = pathname.split('/');
    if (segments.length > 1 && locales.includes(segments[1] as (typeof locales)[number])) {
      segments[1] = targetLocale;
      return `${segments.join('/')}${query}`;
    }

    return `/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}${query}`;
  };

  const mobileNavItems = [
    { href: `/${locale}`, label: text.home },
    { href: `/${locale}/products`, label: text.products },
    { href: `/${locale}/brands`, label: text.brands },
    { href: `/${locale}/contact`, label: text.contact },
    { href: `/${locale}/quote`, label: text.requestQuote },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition ${
        scrolled
          ? 'bg-[var(--color-surface)] shadow-[var(--shadow-md)] backdrop-blur'
          : 'bg-[var(--color-surface)]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href={`/${locale}`}
          aria-label={isThai ? "MRT Supplier Co.,Ltd หน้าแรก" : "MRT Supplier Co.,Ltd Home"}
          className={`min-w-0 flex-1 rounded-[var(--mrt-radius-md)] leading-tight md:flex-none ${lightFocusClass}`}
        >
          <span className="block text-sm font-bold text-[var(--color-text)] sm:hidden">
            MRT
          </span>
          <span className="hidden text-lg font-bold text-[var(--color-text)] sm:block">
            MRT Supplier Co.,Ltd
          </span>
          <span className="hidden text-[10px] text-[var(--color-text-muted)] sm:block">{text.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href={`/${locale}`}
            className={`rounded-[var(--mrt-radius-md)] text-[var(--color-text)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
          >
            {text.home}
          </Link>
          <Link
            href={`/${locale}/products`}
            className={`rounded-[var(--mrt-radius-md)] text-[var(--color-text)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
          >
            {text.products}
          </Link>
          <Link
            href={`/${locale}/brands`}
            className={`rounded-[var(--mrt-radius-md)] text-[var(--color-text)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
          >
            {text.brands}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={`rounded-[var(--mrt-radius-md)] text-[var(--color-text)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
          >
            {text.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <details className="group relative md:hidden">
            <summary
              aria-label={text.menu}
              className={`inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] ${lightFocusClass}`}
            >
              <span className="sr-only">{text.menu}</span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 group-open:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="hidden h-5 w-5 group-open:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 6L18 18" />
                <path d="M6 18L18 6" />
              </svg>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-md)]">
              <nav className="flex flex-col gap-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-11 items-center whitespace-nowrap rounded-[var(--mrt-radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <TrackedLineLink
                  href={LINE_URL}
                  source="header_mobile_menu"
                  locale={locale}
                  className={`mt-1 inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-[var(--mrt-radius-md)] border border-[#06C755] bg-[#effcf4] px-3 py-2 text-sm font-semibold text-[var(--color-success-text)] transition hover:bg-[#e2f8ea] ${lightFocusClass}`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {text.contactLine}
                </TrackedLineLink>
              </nav>
            </div>
          </details>

          <div
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1"
            aria-label="Language switcher"
            title="Language switcher"
          >
            {locales.map((targetLocale) => {
              const isActive = locale === targetLocale;

              return (
                <Link
                  key={targetLocale}
                  href={getLocaleHref(targetLocale)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition sm:min-h-7 sm:px-3 ${lightFocusClass} ${
                    isActive
                      ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-sm)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {targetLocale}
                </Link>
              );
            })}
          </div>

          <TrackedLineLink
            href={LINE_URL}
            source="header_desktop"
            locale={locale}
            className={`hidden shrink-0 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-[#06C755] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-success-text)] transition hover:bg-[#effcf4] lg:inline-flex ${lightFocusClass}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xl:inline">{text.contactLine}</span>
            <span className="xl:hidden">LINE</span>
          </TrackedLineLink>

          <Link
            href={`/${locale}/quote`}
            aria-label={ready && totalItems > 0 ? `${text.requestQuote}, ${text.quoteCount}` : text.requestQuote}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] sm:min-h-0 sm:px-4 ${lightFocusClass}`}
          >
            <span className="sm:hidden">{isThai ? 'RFQ' : 'Quote'}</span>
            <span className="hidden sm:inline">{text.requestQuote}</span>
            {ready && totalItems > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[var(--color-primary-hover)]">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
