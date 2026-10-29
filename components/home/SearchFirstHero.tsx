import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Boxes,
  Building2,
  ClipboardList,
  Headset,
  Link2,
  MessageCircle,
  PackageSearch,
  Store,
  Truck,
  Wrench,
} from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SearchBar from "@/components/search/SearchBar";

const LINE_URL = "https://lin.ee/PsQGAuu";
const lightFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";

const EXAMPLE_QUERIES = ["P181080", "P551864", "FS1242"];

export default function SearchFirstHero({
  locale,
  children,
}: {
  locale: string;
  children?: ReactNode;
}) {
  const isThai = locale === "th";

  const trustItems = [
    {
      icon: Boxes,
      value: "798+",
      title: isThai ? "รายการสินค้า" : "Products",
      description: isThai
        ? "ค้นหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรม"
        : "Search filters, bearings, and industrial spare parts.",
    },
    {
      icon: Link2,
      value: isThai ? "Cross Reference" : "Cross Reference",
      title: isThai ? "ช่วยเทียบเบอร์" : "Part-number support",
      description: isThai
        ? "ตรวจสอบ Part No. และรายการที่เกี่ยวข้องก่อนเสนอราคา"
        : "Review Part No. and related references before quotation.",
    },
    {
      icon: ClipboardList,
      value: isThai ? "Bulk RFQ" : "Bulk RFQ",
      title: isThai ? "รวมหลายรายการ" : "Multi-item RFQ",
      description: isThai
        ? "เหมาะกับงาน PM ฝ่ายจัดซื้อ และร้านค้าที่ต้องการหลายรายการ"
        : "Built for PM lists, purchasing teams, and multi-item inquiries.",
    },
    {
      icon: Truck,
      value: isThai ? "ทั่วประเทศ" : "Nationwide",
      title: isThai ? "รองรับคำขอจากต่างจังหวัด" : "Nationwide inquiries",
      description: isThai
        ? "โรงงาน ช่าง และร้านค้าสามารถส่งรายละเอียดให้ทีมตรวจสอบได้"
        : "Factories, technicians, and resellers can send requirements for review.",
    },
  ];

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="relative isolate z-10 bg-slate-950">
        <picture className="absolute inset-0 block">
          <source media="(min-width: 1024px)" srcSet="/images/hero/mrt-industrial-desktop.webp" />
          <img src="/images/hero/mrt-industrial-mobile.webp" alt="" width={1122} height={1402} fetchPriority="high" className="h-full w-full object-cover object-[center_20%] lg:object-center" />
        </picture>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,27,0.05)_0%,rgba(2,12,27,0.7)_25%,#020c1b_63%)] lg:bg-[linear-gradient(90deg,rgba(2,12,27,0.96)_0%,rgba(2,12,27,0.85)_38%,rgba(2,12,27,0.15)_75%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-40 sm:px-6 sm:pt-48 lg:px-8 lg:py-16">
          <div className="max-w-3xl lg:max-w-[65%]">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400 sm:text-sm">
              {isThai
                ? "อะไหล่อุตสาหกรรม • ไส้กรอง • Cross Reference • RFQ"
                : "Industrial Parts • Filters • Cross Reference • RFQ"}
            </p>

            <h1 className="mt-3 text-[1.8rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
              {isThai ? (
                <>
                  หาอะไหล่อุตสาหกรรม
                  <span className="block text-orange-400">ง่ายขึ้น เร็วขึ้น</span>
                </>
              ) : (
                <>
                  Find industrial parts
                  <span className="block text-orange-400">faster and with less guesswork</span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-5 sm:text-base sm:leading-7">
              {isThai
                ? "ค้นหาด้วย Part No. / Cross Reference หรือส่งรูปให้ทีมช่วยตรวจสอบก่อนเสนอราคา"
                : "Search by Part No. / Cross Reference, or send a photo for review before quotation."}
            </p>

            <div className="mt-5 hidden gap-2 text-sm text-slate-100 sm:grid sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <PackageSearch className="h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                <span>{isThai ? "ค้นหา/เทียบเบอร์" : "Part-number search"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                <span>{isThai ? "RFQ หลายรายการ" : "Multi-item RFQ"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headset className="h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                <span>{isThai ? "ส่งรูปผ่าน LINE" : "Send photos via LINE"}</span>
              </div>
            </div>

            <div className="relative z-30 mt-5 rounded-2xl border border-white/15 bg-white/95 p-2.5 sm:mt-7 shadow-2xl shadow-black/20 backdrop-blur sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <SearchBar
                  locale={locale}
                  className="max-w-none [&_button[type=submit]]:bg-orange-500 [&_button[type=submit]]:hover:bg-orange-600"
                  autoFocus={false}
                  exampleQueries={EXAMPLE_QUERIES}
                  compactMobileExamples
                />
                <Link
                  href={`/${locale}/quote`}
                  className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] lg:min-h-[60px] ${lightFocusClass}`}
                >
                  {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
                </Link>
              </div>

              <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-2 sm:mt-3 sm:pt-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={`/${locale}/products?request=1#missing-product-request`}
                  className={`hidden font-semibold text-[var(--color-primary)] sm:block hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
                >
                  {isThai
                    ? "ไม่มี Part No.? ส่งรุ่นเครื่อง / Nameplate / รายละเอียดสินค้า →"
                    : "No Part No.? Send machine model / nameplate / product details →"}
                </Link>
                <TrackedLineLink
                  href={LINE_URL}
                  source="hero_search"
                  locale={locale}
                  className={`inline-flex min-h-11 items-center gap-1.5 font-semibold text-[var(--color-success-text)] hover:text-[var(--color-success-hover)] ${lightFocusClass}`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {isThai ? "ส่งรูปหรือ Part No. ทาง LINE" : "Send a photo or Part No. on LINE"}
                </TrackedLineLink>
              </div>
            </div>
          </div>

          <Link href="#products" className={`mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white ${lightFocusClass}`}>
            {isThai ? "สำรวจหมวดสินค้า" : "Explore product categories"}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {children}

      <div className="mx-auto grid max-w-7xl border-x border-[var(--color-border)] bg-[var(--color-surface)] sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex gap-3 border-b border-[var(--color-border)] p-5 sm:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-5 text-[var(--color-text)]">{item.value}</p>
                <h2 className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              {isThai ? "เหมาะกับใคร" : "Who we serve"}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
              {isThai
                ? "เลือกเส้นทางที่ตรงกับงานของคุณ"
                : "Choose the path that matches your job"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
            {isThai
              ? "หน้าแรกออกแบบให้คนที่รู้ Part No. และคนที่ยังมีแค่รูป รุ่นเครื่อง หรือรายการ PM ไปต่อได้โดยไม่ต้องเดาว่าควรเริ่มตรงไหน"
              : "Start with a Part No., product photo, machine model, or PM list. Our team can help review the details."}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">
              {isThai ? "ผู้ใช้ปลายทาง / โรงงาน" : "End users / factories"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {isThai
                ? "ค้นหาอะไหล่ตาม Part No. รวบรวมรายการ และส่ง RFQ ให้ทีมจัดซื้อหรือซ่อมบำรุงติดตามต่อ"
                : "Search by Part No., collect items, and send an RFQ for purchasing or maintenance follow-up."}
            </p>
            <Link
              href={`/${locale}/products`}
              className={`mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
            >
              {isThai ? "ค้นหาสินค้า →" : "Search products →"}
            </Link>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Wrench className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">
              {isThai ? "ช่าง / ทีมซ่อมบำรุง" : "Technicians / maintenance"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {isThai
                ? "มีแค่รูป Nameplate รุ่นเครื่อง หรือเบอร์เดิมก็ส่งให้ทีมช่วยตรวจสอบและหาทางเลือกที่เกี่ยวข้องได้"
                : "Send a nameplate, machine model, product photo, or existing part number for review."}
            </p>
            <TrackedLineLink
              href={LINE_URL}
              source="home_audience_technician"
              locale={locale}
              className={`mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--color-success-text)] hover:text-[var(--color-success-hover)] ${lightFocusClass}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {isThai ? "ส่งข้อมูลทาง LINE →" : "Send details via LINE →"}
            </TrackedLineLink>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Store className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">
              {isThai ? "ร้านค้า / ตัวแทนต่างจังหวัด" : "Provincial shops / resellers"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {isThai
                ? "ส่งรายการหลายเบอร์เพื่อให้ช่วยตรวจสอบสินค้า Cross Reference และจัดทำ RFQ สำหรับงานต่อเนื่อง"
                : "Send multiple part numbers for product, cross-reference, and RFQ review."}
            </p>
            <Link
              href={`/${locale}/quote`}
              className={`mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
            >
              {isThai ? "ส่งรายการ RFQ →" : "Send an RFQ list →"}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
