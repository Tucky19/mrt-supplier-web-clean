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
      id: "hydraulic-filters",
      image: "/filter-oil-01.jpg",
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
      id: "air-filters",
      image: "/filter-air-01.jpg",
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
    {
      id: "oil-fuel-oil-separator",
      image: "/filter-oil-01.jpg",
      href: `/${locale}/products?q=oil%20separator`,
      title: {
        th: "Oil / Fuel / Oil Separator",
        en: "Oil, Fuel & Oil Separator",
      },
      subtitle: {
        th: "ไส้กรองน้ำมัน เชื้อเพลิง และ Oil Separator",
        en: "",
      },
      description: {
        th: "รองรับไส้กรองน้ำมัน ไส้กรองเชื้อเพลิง และ Oil Separator สำหรับเครื่องยนต์ เครื่องอัดลม และระบบอุตสาหกรรม",
        en: "Oil filters, fuel filters, and oil separator elements for engines, compressors, and industrial systems.",
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

      <SearchFirstHero locale={locale} />

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

      <ProductGrid products={productCategories} locale={locale} />
      <BrandShowcase brands={featuredBrands} locale={locale} />
      <WhyChooseUsSection locale={locale} />
      <QuoteCTASection locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
