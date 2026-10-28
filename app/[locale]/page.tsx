import Link from "next/link";
import type { Metadata } from "next";
import BrandShowcase from "@/components/home/BrandShowcase";
import ProductGrid from "@/components/home/ProductGrid";
import QuoteCTASection from "@/components/home/QuoteCTASection";
import SearchFirstHero from "@/components/home/SearchFirstHero";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
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
    {
      step: "01",
      title: isThai
        ? "ค้นหา หรือส่งข้อมูลที่มี"
        : "Search or send the details you have",
      description: isThai
        ? "เริ่มจาก Part No., Cross Reference, รูปสินค้า, รุ่นเครื่อง หรือ Nameplate ก็ได้"
        : "Start with a Part No., cross reference, product photo, machine model, or nameplate.",
    },
    {
      step: "02",
      title: isThai
        ? "MRT ตรวจสอบข้อมูลและรายการที่เกี่ยวข้อง"
        : "MRT reviews specs and related references",
      description: isThai
        ? "ทีมงานช่วยตรวจสอบข้อมูลสินค้าและทางเลือกที่เกี่ยวข้องก่อนเข้าสู่ขั้นเสนอราคา"
        : "Our team reviews product details and related options before quotation.",
    },
    {
      step: "03",
      title: isThai
        ? "ส่ง RFQ และรับการติดตามจากทีม"
        : "Submit the RFQ and receive follow-up",
      description: isThai
        ? "รวมรายการที่ต้องการแล้วส่ง RFQ เพื่อให้ทีมติดตามรายละเอียด ราคา และขั้นตอนถัดไป"
        : "Collect the required items and submit an RFQ for pricing and next-step follow-up.",
    },
  ];

  return (
    <main className="mrt-blueprint-shell min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <SearchFirstHero locale={locale}>
        <ProductGrid products={productCategories} locale={locale} />
      </SearchFirstHero>

      <section className="mrt-blueprint-section border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange-500">
              {isThai ? "HOW IT WORKS" : "How It Works"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
              {isThai ? "จากข้อมูลที่มี ไปถึง RFQ ใน 3 ขั้นตอน" : "From the details you have to an RFQ in 3 steps"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              {isThai
                ? "ออกแบบให้ทั้งฝ่ายจัดซื้อ ช่าง และร้านค้าสามารถเริ่มจากข้อมูลที่ตัวเองมี โดยไม่ต้องรู้ Part No. ครบตั้งแต่แรก"
                : "Built so purchasing teams, technicians, and resellers can start with whatever information they already have."}
            </p>
            <Link
              href={`/${locale}/quote`}
              className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] ${lightFocusClass}`}
            >
              {isThai ? "เริ่ม RFQ" : "Start RFQ"}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="text-xs font-semibold tracking-[0.14em] text-[var(--color-primary)]">
                  STEP {item.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BrandShowcase brands={featuredBrands} locale={locale} />
      <WhyChooseUsSection locale={locale} />

      <section className="border-y border-[var(--color-border)] bg-slate-50/70">
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
