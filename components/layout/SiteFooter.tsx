import Link from "next/link";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";

const LINE_URL = "https://lin.ee/S676yYH";
const darkFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

type Props = {
  locale?: string;
  className?: string;
};

export default function SiteFooter({ locale = "th", className = "" }: Props) {
  const isThai = locale === "th";

  return (
    <footer
      className={`w-full border-t border-slate-200 bg-slate-950 text-slate-200 ${className}`}
import Link from "next/link";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";

const LINE_URL = "https://lin.ee/S676yYH";
const darkFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

type Props = {
  locale?: string;
  className?: string;
};

export default function SiteFooter({ locale = "th", className = "" }: Props) {
  const isThai = locale === "th";

  return (
    <footer
      className={`w-full border-t border-slate-200 bg-slate-950 text-slate-200 ${className}`}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">
            {isThai ? "บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด" : "MRT Supplier Co., Ltd."}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            {isThai
              ? "บริการจัดหาอะไหล่อุตสาหกรรมสำหับโรงงาน ทีมซ่อมบำภุง และฝ่ายจัดซื้อ พร้อมการตอบกลับอย่างมืออาชีพ"
              : "Industrial spare parts sourcing for factories, maintenance teams, and procurement departments."}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isThai ? "ลิงก์ด่วน" : "Quick Links"}
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href={`/${locale}`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "หน้าแรก" : "Home"}
            </Link>
            <Link href={`/${locale}/brands`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "แบรนด์" : "Brands"}
            </Link>
            <Link href={`/${locale}#products`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "สินค้า" : "Products"}
            </Link>
            <Link href={`/${locale}/contact`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ติดต่อเรา" : "Contact"}
            </Link>
            <Link href={`/${locale}/feedback`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ติชมการใช้งาน" : "Website Feedback"}
            </Link>
            <Link href={`/${locale}/quote`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isThai ? "ข้อมูลติดต่อ" : "Contact Information"}
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>sales@mrtsupplier.com</p>
            <a href="tel:0970122111" className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              097 012 2111
            </a>
            <a href="tel:0815581323" className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ฝ่ายขาย" : "Sales"}: 081 558 1323
            </a>
            <TrackedLineLink
              href={LINE_URL}
              source="site_footer"
              locale={locale}
              className={`block rounded-sm hover:text-white ${darkFocusClass}`}
            >
              LINE: @mrtsupplier
            </TrackedLineLink>
            <p>www.mrtsupplier.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500 lg:px-8">
          {isThai
            ? "© 2026 บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด สงวนลิขสิทธิ์"
            : "© 2026 MRT Supplier Co., Ltd. All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">
            {isThai ? "บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด" : "MRT Supplier Co., Ltd."}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            {isThai
              ? "บริการจัดหาอะไหล่อุตสาหกรรมสำหรับโรงงาน ทีมซ่อมบำรุง และฝ่ายจัดซื้อ พร้อมการตอบกลับอย่างมืออาชีพ"
              : "Industrial spare parts sourcing for factories, maintenance teams, and procurement departments."}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isThai ? "ลิงก์ด่วน" : "Quick Links"}
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href={`/${locale}`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "หน้าแรก" : "Home"}
            </Link>
            <Link href={`/${locale}/brands`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "แบรนด์" : "Brands"}
            </Link>
            <Link href={`/${locale}#products`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "สินค้า" : "Products"}
            </Link>
            <Link href={`/${locale}/contact`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ติดต่อเรา" : "Contact"}
            </Link>
            <Link href={`/${locale}/feedback`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ติชมการใช้งาน" : "Website Feedback"}
            </Link>
            <Link href={`/${locale}/quote`} className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isThai ? "ข้อมูลติดต่อ" : "Contact Information"}
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>sales@mrtsupplier.com</p>
            <a href="tel:0970122111" className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              097 012 2111
            </a>
            <a href="tel:0815581323" className={`block rounded-sm hover:text-white ${darkFocusClass}`}>
              081 558 1323
            </a>
            <TrackedLineLink
              href={LINE_URL}
              source="site_footer"
              locale={locale}
              className={`block rounded-sm hover:text-white ${darkFocusClass}`}
            >
              LINE: @mrtsupplier
            </TrackedLineLink>
            <p>www.mrtsupplier.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500 lg:px-8">
          {isThai
            ? "© 2026 บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด สงวนลิขสิทธิ์"
            : "© 2026 MRT Supplier Co., Ltd. All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
