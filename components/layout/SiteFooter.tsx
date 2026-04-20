import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const LINE_URL = "https://lin.ee/R3vfZW0";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">{t("company")}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            {t("description")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {t("quickLinks")}
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href={`/${locale}`} className="block hover:text-white">
              {nav("home")}
            </Link>
            <Link href={`/${locale}#brands`} className="block hover:text-white">
              {nav("brands")}
            </Link>
            <Link href={`/${locale}#products`} className="block hover:text-white">
              {nav("products")}
            </Link>
            <Link href={`/${locale}/contact`} className="block hover:text-white">
              {nav("contact")}
            </Link>
            <Link href={`/${locale}/quote`} className="block hover:text-white">
              {nav("quote")}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {t("contactTitle")}
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>sales@mrtsupplier.com</p>
            <p>+66 81-558-1323</p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white"
            >
              LINE: @mrt-supplier
            </a>
            <p>www.mrtsupplier.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500 lg:px-8">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
