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
    ? "MRT Supplier | จัดหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรม"
    : "MRT Supplier | Filters, Bearings & Industrial Spare Parts RFQ";
  const description = isThai
    ? "MRT Supplier Co., Ltd. ช่วยจัดหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมสำหรับงาน B2B ค้นหาด้วย Part No., Cross Reference และส่ง RFQ ให้ทีมตรวจสอบ"
    : "MRT Supplier Co., Ltd. sources filters, bearings, and industrial spare parts for B2B teams. Search by Part No. or Cross Reference and submit an RFQ for review.";
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

  const workflowSteps = [
    {
      step: "01",
      title: isThai ? "ค้นหาด้วย Part No. / Cross Reference" : "Search by Part No. / Cross Reference",
      description: isThai
        ? "ค้นหาไส้กรอง ลูกปืน หรืออะไหล่อุตสาหกรรมจาก Part No., Cross Reference, แบรนด์ หรือรายละเอียดที่มี"
        : "Search filters, bearings, or industrial spare parts by Part No., cross reference, brand, or the details you have.",
    },
    {
      step: "02",
      title: isThai ? "เพิ่มรายการเข้า RFQ" : "Add items to RFQ",
      description: isThai
        ? "เลือกรายการและจำนวนที่ต้องการ หรือส่งรายละเอียดสินค้าที่ยังไม่พบให้ทีมช่วยจัดหา"
        : "Select items and quantities, or send missing-product details for sourcing support.",
    },
    {
      step: "03",
      title: isThai ? "ส่ง RFQ และรอทีมติดต่อกลับ" : "Submit RFQ and receive follow-up",
      description: isThai
        ? "ส่งข้อมูลติดต่อและรายการ RFQ เพื่อให้ MRT Supplier Co., Ltd. ตรวจสอบราคา สต็อก และทางเลือกที่เหมาะสม"
        : "Submit contact details and RFQ items so MRT Supplier Co., Ltd. can review price, stock, and suitable alternatives.",
    },
  ];

  const customerSegments = [
    isThai ? "ฝ่ายจัดซื้อโรงงาน" : "Factory purchasing",
    isThai ? "ทีมซ่อมบำรุง" : "Maintenance teams",
    isThai ? "จัดหาอะไหล่อุตสาหกรรม" : "Industrial spare parts sourcing",
    isThai ? "ไส้กรองและลูกปืน" : "Filters and bearings",
  ];

  return (
    <main className="mrt-blueprint-shell min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <SearchFirstHero locale={locale} />

      <section className="mrt-blueprint-section border-b border-blue-200/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? "HOW IT WORKS" : "How It Works"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {isThai ? "RFQ 3 ขั้นตอนที่ชัดเจน" : "A clear 3-step RFQ workflow"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isThai
                ? "จากเบอร์อะไหล่ไปถึงการติดตามราคา โดยไม่ต้องเปลี่ยนขั้นตอนจัดซื้อเดิมของทีมคุณ"
                : "From part numbers to quote follow-up without changing your team’s purchasing process."}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isThai
                ? "ติดต่อผ่าน LINE Official @mrtsupplier เพื่อส่งรูปสินค้า Part No. หรือรายละเอียดเพิ่มเติม"
                : "Contact LINE Official @mrtsupplier to share photos, Part No., or additional details."}
            </p>
            <Link
              href={`/${locale}/quote`}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isThai ? "เริ่ม RFQ" : "Start RFQ"}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((item) => (
              <article key={item.step} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-semibold tracking-[0.14em] text-sky-700">
                  STEP {item.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-6 text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mrt-blueprint-section-strong border-b border-blue-200/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? "CUSTOMERS & APPLICATIONS" : "Customers & Applications"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {isThai ? "สำหรับงาน Purchasing และ Maintenance ในโรงงาน" : "Built for industrial purchasing and maintenance"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {customerSegments.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}
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
