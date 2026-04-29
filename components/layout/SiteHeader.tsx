'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

type Props = {
  locale: string;
};

export default function SiteHeader({ locale }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const activeLocale = useLocale();
  const isThai = activeLocale === 'th';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={`/${locale}`} className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-blue-950">
            MRT Supplier Co.,Ltd
          </span>
          <span className="text-[10px] text-gray-400">
            Industrial Parts & RFQ Service
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href={`/${locale}`} className="hover:text-blue-900">
            {isThai ? 'หน้าแรก' : 'Home'}
          </Link>
          <Link href={`/${locale}/products`} className="hover:text-blue-900">
            {isThai ? 'สินค้า' : 'Products'}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-blue-900">
            {isThai ? 'ติดต่อเรา' : 'Contact'}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/quote`}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            {isThai ? 'ขอใบเสนอราคา' : 'Request Quote'}
          </Link>
        </div>
      </div>
    </header>
  );
}
