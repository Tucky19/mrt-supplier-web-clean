import Image from "next/image";
import type { Metadata } from "next";
import BrandShowcase from "@/components/home/BrandShowcase";
import MissingProductRequestCta from "@/components/home/MissingProductRequestCta";
import ProductGrid from "@/components/home/ProductGrid";
import QuoteCTASection from "@/components/home/QuoteCTASection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SearchBar from "@/components/search/SearchBar";
import JsonLd from "@/components/seo/JsonLd";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const LOCALES = ["th", "en"] as const;
const SITE_URL = "https://mrtsupplier.com";

function getLocalizedAlternates(path = "") {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `/${locale}${path}`]),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai
      ? "ค้นหาอะไหล่อุตสาหกรรมและส่ง RFQ"
      : "Industrial Parts RFQ",
    description: isThai
      ? "ค้นหาอะไหล่อุตสาหกรรมด้วย Part Number, Cross Reference หรือขนาดสินค้า แล้วส่ง RFQ ให้ทีม MRT Supplier ตรวจสอบและเสนอราคา"
      : "Search industrial parts by part number, cross reference, or dimensions and submit RFQs to MRT Supplier.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...getLocalizedAlternates(),
        "x-default": "/th",
      },
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
  const homepageExampleQueries = [
    "FUEL FILTER",
    "LUBE FILTER",
    "HYDRAULIC FILTER",
    "AIR FILTER",
    "OIL SEPARATOR",
  ];

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

  const supportingBrands = [
    "Fleetguard",
    "Komai",
    "K-FLO",
    "KOYO",
    "IKO",
    "Timken",
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
        th: "แบริ่งและลูกปืนอุตสาหกรรม",
        en: "",
      },
      description: {
        th: "รองรับแบริ่งสำหรับงานซ่อมบำรุง เครื่องจักร และระบบส่งกำลังในโรงงาน",
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

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#1e293b_100%)] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              {isThai
                ? "INDUSTRIAL PARTS SOURCING & RFQ"
                : "Industrial Parts Sourcing & RFQ"}
            </p>

            <h1 className="mt-5 text-3xl font-bold leading-[1.14] tracking-tight sm:text-5xl">
              {isThai ? (
                <>
                  <span className="block">จัดหาอะไหล่อุตสาหกรรมอย่างมั่นใจ</span>
                  <span className="mt-1 block text-slate-100">
                    สำหรับงานซ่อมบำรุงและจัดซื้อ
                  </span>
                </>
              ) : (
                <>
                  <span className="block">Reliable Industrial Parts.</span>
                  <span className="mt-1 block text-slate-100">
                    Responsive RFQ Support.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {isThai
                ? "ค้นหาด้วย Part Number, Cross Reference หรือส่งรายการหลายรายการ เพื่อให้ทีม MRT Supplier ตรวจสอบและเสนอราคา"
                : "Search by Part Number, Cross Reference, or paste multiple items to request a quotation from MRT Supplier. Built for maintenance teams, procurement, and industrial sourcing workflows."}
            </p>

            <div className="mt-8 max-w-3xl">
              <SearchBar
                locale={locale}
                autoFocus={false}
                exampleQueries={homepageExampleQueries}
              />
            </div>

            <MissingProductRequestCta locale={locale} />

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1.5">
                {isThai
                  ? "รองรับ Part Number และ Cross Reference"
                  : "Part Number & Cross Reference Support"}
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1.5">
                {isThai
                  ? "เพิ่มหลายรายการเข้า RFQ ได้"
                  : "Bulk RFQ for multiple items"}
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1.5">
                {isThai
                  ? "เหมาะสำหรับงานซ่อมบำรุงและจัดซื้อ"
                  : "Built for maintenance and procurement teams"}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-900/40 shadow-[0_30px_90px_rgba(2,6,23,0.45)]">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/55 px-5 py-3 backdrop-blur">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                    MRT SUPPLIER WORKFLOW
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {isThai
                      ? "ค้นหาอะไหล่ ตรวจสอบ Cross Reference และส่ง RFQ"
                      : "Search parts, check cross references, and submit RFQs"}
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  {isThai ? "พร้อมตรวจสอบ" : "Ready to review"}
                </div>
              </div>

              <div className="relative aspect-[16/11]">
                <Image
                  src="/hero/warehouse-main.png"
                  alt={
                    isThai
                      ? "คลังสินค้าอะไหล่อุตสาหกรรมและแบรนด์ที่ MRT Supplier รองรับ"
                      : "Industrial machinery and maintenance use cases supported by MRT Supplier"
                  }
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-[66%_center] lg:object-[62%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/75 via-slate-950/20 to-slate-950/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandShowcase
        brands={featuredBrands}
        supportingBrands={supportingBrands}
        locale={locale}
      />
      <WhyChooseUsSection locale={locale} />
      <ProductGrid products={productCategories} locale={locale} />
      <QuoteCTASection locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
