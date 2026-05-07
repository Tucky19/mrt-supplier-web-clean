'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = {
  locale: string;
};

export default function SiteHeader({ locale }: Props) {
  const [scrolled, setScrolled] = useState(false);
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
    contact: isThai ? '\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32' : 'Contact',
    requestQuote: isThai
      ? '\u0e02\u0e2d\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'
      : 'Request Quote',
    menu: isThai ? '\u0e40\u0e21\u0e19\u0e39' : 'Menu',
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
    { href: `/${locale}/contact`, label: text.contact },
    { href: `/${locale}/quote`, label: text.requestQuote },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="min-w-0 flex-1 leading-tight md:flex-none">
          <span className="block truncate text-base font-bold text-blue-950 sm:text-lg">
            MRT Supplier Co.,Ltd
          </span>
          <span className="hidden text-[10px] text-gray-400 sm:block">{text.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href={`/${locale}`} className="hover:text-blue-900">
            {text.home}
          </Link>
          <Link href={`/${locale}/products`} className="hover:text-blue-900">
            {text.products}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-blue-900">
            {text.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <details className="group relative md:hidden">
            <summary
              aria-label={text.menu}
              className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50"
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

            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/70">
              <nav className="flex flex-col gap-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>

          <div
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1"
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
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition sm:px-3 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {targetLocale}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${locale}/quote`}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-900 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 sm:px-4"
          >
            <span className="sm:hidden">{isThai ? 'RFQ' : 'Quote'}</span>
            <span className="hidden sm:inline">{text.requestQuote}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
