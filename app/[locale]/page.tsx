import Link from "next/link";
import type { Metadata } from "next";
import BrandShowcase from "@/components/home/BrandShowcase";
import ProductGrid from "@/components/home/ProductGrid";
import QuoteCTASection from "@/components/home/QuoteCTASection";
import SearchFirstHero from "@/components/home/SearchFirstHero";
import { ClipboardList, Search, Send } from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import styles from "@/components/home/Homepage.module.css";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import JsonLd from "@/components/seo/JsonLd";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const LOCALES = ["th", "en"] as const;
const SITE_URL = "https://www.mrtsupplier.com";
const lightFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";

function getLocalizedAlternates(path = "") {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";
  const title = isThai
    ? "MRT Supplier | หาอะไหล่อุตสาหกรรม ไส้กรอง ลูกปืน และ RFQ"
    : "MRT Supplier | Industrial Parts, Filters, Bearings & RFQ";
  const description = isThai
    ? "MRT Supplier ช่วยโรงงาน ผู้ใช้ปลายทาง ช่างซ่อมบำรุง และร้านค้าค้นหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมด้วย Part No. / Cross Reference พร้อมส่ง RFQ ให้ทีมตรวจสอบ"
    : "MRT Supplier helps factories, end users, maintenance teams, and resellers source filters, bearings, and industrial spare parts by Part No. / Cross Reference and submit RFQs for review.";
  const canonical = `${SITE_URL}/${locale}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...getLocalizedAlternates(),
        "x-default": `${SITE_URL}/th`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MRT Supplier",
      type: "website",
      locale: isThai ? "th_TH" : "en_US",
    },
  };
}

export default async function Page({
  params,
}: PageProps) {
  const { locale } = await params;
  const isThai = locale === "th";
  const canonicalUrl = `${SITE_URL}/${locale}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isThai ? "หน้าแรก" : "Home",
        item: canonicalUrl,
      },
    ],
  };

  const featuredBrands = [
    {
      key: "donaldson",
      name: "Donaldson",
      logo: "/brands/donaldson.png",
    },
    {
      key: "mann",
      name: "MANN-FILTER",
      logo: "/brands/mann-filter.png",
    },
    {
      key: "ntn",
      name: "NTN",
      logo: "/brands/ntn.png",
    },
  ];

  const productCategories = [
    {
      id: "air-filters",
      image: "/images/products/donaldson/p181080.jpg",
      href: `/${locale}/products?q=air%20filter`,
      title: {
        th: "Air Filters",
        en: "Air Filters",
      },
      subtitle: {
        th: "ไส้กรองอากาศ",
        en: "",
      },
      description: {
        th: "รองรับกรองอากาศลูกนอก ลูกใน และชุดกรองที่ใช้คู่กันสำหรับเครื่องจักรและงานอุตสาหกรรม",
        en: "Primary, safety, and paired air filters for machinery and industrial applications.",
      },
    },
    {
      id: "oil-filters",
      image: "/images/products/donaldson/p558615.jpg",
      href: `/${locale}/products?q=lube%20filter`,
      title: { th: "Oil Filters", en: "Oil Filters" },
      subtitle: { th: "ไส้กรองน้ำมันเครื่อง", en: "" },
      description: {
        th: "ไส้กรองน้ำมันเครื่องสำหรับเครื่องยนต์และงานซ่อมบำรุง",
        en: "Engine oil filters for maintenance and industrial applications.",
      },
    },
    {
      id: "fuel-filters",
      image: "/images/products/donaldson/p551864.jpg",
      href: `/${locale}/products?q=fuel%20filter`,
      title: { th: "Fuel Filters", en: "Fuel Filters" },
      subtitle: { th: "ไส้กรองเชื้อเพลิง", en: "" },
      description: {
        th: "ค้นหาไส้กรองเชื้อเพลิงและกรองแยกน้ำด้วย Part No.",
        en: "Find fuel filters and fuel/water separators by part number.",
      },
    },
    {
      id: "hydraulic-filters",
      image: "/images/products/donaldson/p550148.jpg",
      href: `/${locale}/products?q=hydraulic%20filter`,
      title: {
        th: "Hydraulic Filters",
        en: "Hydraulic Filters",
      },
      subtitle: {
        th: "ไส้กรองไฮดรอลิก",
        en: "",
      },
      description: {
        th: "รองรับไส้กรองแบบ Spin-On, Cartridge, Return Line และระบบไฮดรอลิกอุตสาหกรรม",
        en: "Support for spin-on, cartridge, return line, and industrial hydraulic filtration applications.",
      },
    },
    {
      id: "bearings",
      image: "/bearing-01.jpg",
      href: `/${locale}/products?q=bearing`,
      title: {
        th: "Bearings",
        en: "Bearings",
      },
      subtitle: {
        th: "ตลับลูกปืนอุตสาหกรรม",
        en: "",
      },
      description: {
        th: "รองรับตลับลูกปืนสำหรับงานซ่อมบำรุง เครื่องจักร และระบบส่งกำลังในโรงงาน",
        en: "Industrial bearings for maintenance, machinery, and power transmission applications.",
      },
    },
  ];

  const workflowSteps = [
    { step: "01", title: isThai ? "ค้นหาสินค้า" : "Search products", description: isThai ? "ค้นด้วย Part Number หรือรายละเอียดสินค้า" : "Search by part number or product details." },
    { step: "02", title: isThai ? "เพิ่มสินค้าลงในรายการ RFQ" : "Add items to your RFQ", description: isThai ? "รวบรวมสินค้าที่ต้องการไว้ในรายการเดียว" : "Collect the products you need in one list." },
    { step: "03", title: isThai ? "ส่งคำขอใบเสนอราคา (RFQ)" : "Submit a Request for Quotation", description: isThai ? "ส่งรายการให้ทีม MRT ตรวจสอบและติดตาม" : "Send your list to MRT for review and follow-up." },
  ];

  return (
    <main className={styles.page}>
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} homepage />

      <SearchFirstHero locale={locale}>
        <ProductGrid products={productCategories} locale={locale} />
      </SearchFirstHero>

      <section className={styles.workflow}>
        <div className={styles.container}>
          <h2>{isThai ? <>ขั้นตอนการจัดหา<br />ง่ายใน 3 ขั้นตอน</> : <>Simple sourcing<br />in 3 steps</>}</h2>
          <div className={styles.steps}>
            {workflowSteps.map((item, index) => {
              const Icon = [Search, ClipboardList, Send][index];
              return <article key={item.step}>
                <div className={styles.stepIcon}><span>{index + 1}</span><Icon size={23} aria-hidden="true" /></div>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
              </article>;
            })}
          </div>
        </div>
      </section>

      <BrandShowcase brands={featuredBrands} locale={locale} />
      <section className={styles.assistance}>
        <div className={styles.container}>
          <article><h3>{isThai ? "โรงงาน / ทีมซ่อมบำรุง" : "Factories & maintenance"}</h3><p>{isThai ? "ค้นหาอะไหล่ตาม Part No. และรวบรวมรายการ PM ใน RFQ เดียว" : "Search by part number and collect a maintenance list in one RFQ."}</p><Link href={`/${locale}/products`}>{isThai ? "ค้นหาสินค้า →" : "Explore products →"}</Link></article>
          <article><h3>{isThai ? "มีแค่รูปหรือ Nameplate?" : "Only have a photo or nameplate?"}</h3><p>{isThai ? "ส่งรูป รุ่นเครื่อง หรือเบอร์เดิมให้ทีมช่วยตรวจสอบก่อนเสนอราคา" : "Send a photo, machine model or original number for review before quotation."}</p><TrackedLineLink href="https://lin.ee/PsQGAuu" source="home_audience_technician" locale={locale}>{isThai ? "ส่งข้อมูลทาง LINE →" : "Send details via LINE →"}</TrackedLineLink></article>
          <article><h3>{isThai ? "ร้านค้า / ทีมจัดซื้อ" : "Resellers & purchasing teams"}</h3><p>{isThai ? "ส่งรายการหลายเบอร์ให้ทีมตรวจสอบสินค้าและ Cross Reference" : "Send multiple part numbers for product and cross-reference review."}</p><Link href={`/${locale}/quote`}>{isThai ? "ส่งรายการ RFQ →" : "Send an RFQ list →"}</Link></article>
        </div>
      </section>

      <section className={styles.knowledge}>
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 lg:px-8">
          <div className="max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              {isThai ? "MRT KNOWLEDGE" : "MRT KNOWLEDGE"}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
              {isThai ? "รู้จักอะไหล่ก่อนตัดสินใจ" : "Practical knowledge before you choose"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {isThai
                ? "อ่านแนวทางตรวจสอบสเปกและดูแลไส้กรองจากบทความที่เผยแพร่แล้ว เพื่อช่วยเตรียมข้อมูลก่อนค้นหาหรือขอใบเสนอราคา"
                : "Read existing guides on filter specifications and maintenance to help prepare the right information before searching or requesting a quote."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <Link
              href={`/${locale}/articles/industrial-filter-selection-guide`}
              className={`group flex h-full min-h-[188px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${lightFocusClass}`}
            >
              <span className="text-xs font-semibold tracking-[0.1em] text-blue-700">
                {isThai ? "การเลือกสินค้า" : "PRODUCT SELECTION"}
              </span>
              <h3 className="mt-3 text-base font-bold leading-6 text-slate-900">
                {isThai ? "เลือกไส้กรองอุตสาหกรรมอย่างไรให้ตรงสเปก" : "How to verify an industrial filter"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isThai ? "สิ่งสำคัญที่ควรตรวจสอบก่อนเลือกเบอร์และสั่งซื้อ" : "Key checks before matching a part number or ordering."}
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                {isThai ? "อ่านบทความ →" : "Read article →"}
              </span>
            </Link>

            <Link
              href={`/${locale}/articles/when-to-replace-engine-air-filter`}
              className={`group flex h-full min-h-[188px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${lightFocusClass}`}
            >
              <span className="text-xs font-semibold tracking-[0.1em] text-orange-600">
                {isThai ? "การซ่อมบำรุง" : "MAINTENANCE"}
              </span>
              <h3 className="mt-3 text-base font-bold leading-6 text-slate-900">
                {isThai ? "ควรเปลี่ยนไส้กรองอากาศเมื่อไร?" : "When should an engine air filter be replaced?"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isThai ? "ทำไมความสกปรกที่มองเห็นจึงไม่ใช่เกณฑ์เดียว" : "Why visual appearance alone is not enough."}
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                {isThai ? "อ่านบทความ →" : "Read article →"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <QuoteCTASection locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
