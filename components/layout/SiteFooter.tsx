import Link from "next/link";

const LINE_URL = "https://lin.ee/R3vfZW0";

type Props = {
  locale?: string;
};

export default function SiteFooter({ locale = "en" }: Props) {
  const isThai = locale === "th";

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">
            {isThai ? "MRT Supplier Co., Ltd." : "MRT Supplier"}
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
            <Link href={`/${locale}`} className="block hover:text-white">
              {isThai ? "หน้าแรก" : "Home"}
            </Link>
            <Link href={`/${locale}#brands`} className="block hover:text-white">
              {isThai ? "แบรนด์" : "Brands"}
            </Link>
            <Link href={`/${locale}#products`} className="block hover:text-white">
              {isThai ? "สินค้า" : "Products"}
            </Link>
            <Link href={`/${locale}/contact`} className="block hover:text-white">
              {isThai ? "ติดต่อเรา" : "Contact"}
            </Link>
            <Link href={`/${locale}/quote`} className="block hover:text-white">
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
          {isThai
            ? "© 2026 MRT Supplier Co., Ltd. สงวนลิขสิทธิ์"
            : "© 2026 MRT Supplier. All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
