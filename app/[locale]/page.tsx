import Image from "next/image";
import Link from "next/link";
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

  const trustPoints = [
    {
      title: isThai ? "MRT Supplier Co., Ltd." : "MRT Supplier Co., Ltd.",
      description: isThai
        ? "ทีมจัดหาอะไหล่อุตสาหกรรมสำหรับลูกค้าองค์กร โรงงาน ผู้รับเหมา และฝ่ายซ่อมบำรุง"
        : "A sourcing team for factories, contractors, maintenance teams, and B2B procurement.",
    },
    {
      title: isThai ? "ค้นหาด้วย Part No. / Cross Reference" : "Part No. & Cross Reference support",
      description: isThai
        ? "ส่ง Part Number, Cross Reference, เบอร์เทียบ แบรนด์ หรือข้อมูลเครื่องจักรเพื่อให้ทีมช่วยตรวจสอบ"
        : "Send Part No., cross references, equivalent numbers, brands, or machine details for review.",
    },
    {
      title: isThai ? "โฟกัส Filters และ Bearings" : "Focused on filters and bearings",
      description: isThai
        ? "รองรับไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมที่เกี่ยวข้องสำหรับงานโรงงานและเครื่องจักร"
        : "Support for filters, bearings, and related industrial spare parts for machinery work.",
    },
    {
      title: isThai ? "เหมาะกับงานจัดซื้อ B2B" : "Built for B2B procurement",
      description: isThai
        ? "รวบรวมหลายรายการ ส่ง RFQ และให้ทีมงานติดตามกลับด้วยข้อมูลที่ชัดเจนสำหรับการจัดซื้อ"
        : "Collect multiple items, submit an RFQ, and receive clear follow-up for purchasing.",
    },
    {
      title: isThai ? "ตรวจสอบก่อนเสนอราคา" : "Checked before quotation",
      description: isThai
        ? "ช่วยตรวจสอบ Spec, Cross Reference และการใช้งานก่อนดำเนินการเสนอราคา"
        : "Specs, cross references, and applications are reviewed before quotation follow-up.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: isThai ? "ค้นหาด้วย Part No. / Cross Reference" : "Search by Part No. / Cross Reference",
      description: isThai
        ? "เริ่มจาก Part Number, Cross Reference, แบรนด์ หรือรายละเอียดอะไหล่ที่มี"
        : "Start with a Part No., cross reference, brand, or the spare-part details you have.",
    },
    {
      step: "02",
      title: isThai ? "เพิ่มรายการเข้า RFQ" : "Add items to RFQ",
      description: isThai
        ? "เลือกรายการและจำนวนที่ต้องการ หรือส่งรายละเอียดสินค้าที่ยังไม่พบให้ทีมช่วยจัดหา"
        : "Choose items and quantities, or send missing-product details for sourcing support.",
    },
    {
      step: "03",
      title: isThai ? "ส่งคำขอและรอทีมติดต่อกลับ" : "Submit and receive follow-up",
      description: isThai
        ? "ส่งข้อมูลติดต่อและรายการ RFQ เพื่อให้ MRT Supplier ตรวจสอบราคา สต็อก และทางเลือกที่เหมาะสม"
        : "Submit contact details and RFQ items so MRT Supplier can review price, stock, and alternatives.",
    },
  ];

  const customerSegments = [
    isThai ? "ฝ่ายจัดซื้อโรงงาน" : "Factory purchasing",
    isThai ? "ทีมซ่อมบำรุง" : "Maintenance teams",
    isThai ? "Industrial Spare Parts Sourcing" : "Industrial spare parts sourcing",
    isThai ? "Filter และ Bearing" : "Filters and bearings",
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
                ? "B2B INDUSTRIAL SOURCING & RFQ"
                : "B2B Industrial Sourcing & RFQ"}
            </p>

            <h1 className="mt-5 text-3xl font-bold leading-[1.14] tracking-tight sm:text-5xl">
              {isThai
                ? "จัดหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมด้วย Part No. และ Cross Reference"
                : "Source filters, bearings, and industrial spare parts by Part No. and Cross Reference"}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {isThai
                ? "MRT Supplier Co., Ltd. ช่วยฝ่ายจัดซื้อและทีมซ่อมบำรุงค้นหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมจาก Part No., Cross Reference, แบรนด์ หรือข้อมูลเครื่องจักร พร้อมส่ง RFQ ให้ทีมตรวจสอบและเสนอราคา"
                : "MRT Supplier Co., Ltd. helps procurement and maintenance teams find filters, bearings, and industrial spare parts from Part No., Cross Reference, brand, or machine details, then submit a clear RFQ for review."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/products`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {isThai ? "ค้นหาสินค้า" : "Search products"}
              </Link>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
              </Link>
            </div>

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
                  ? "ค้นหาด้วย Part Number / Cross Reference"
                  : "Part Number & Cross Reference Support"}
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1.5">
                {isThai
                  ? "ส่งหลายรายการเข้า RFQ ได้"
                  : "Bulk RFQ for multiple items"}
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1.5">
                {isThai
                  ? "สำหรับ Maintenance และ Purchasing"
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
                      ? "ค้นหา Part No. ตรวจสอบ Cross Reference และส่ง RFQ"
                      : "Search Part No., check cross references, and submit RFQs"}
                  </p>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  {isThai ? "พร้อม Review" : "Ready to review"}
                </div>
              </div>

              <div className="relative aspect-[16/11]">
                <Image
                  src="/hero/warehouse-main.png"
                  alt={
                    isThai
                      ? "ภาพงานจัดหา Industrial Parts และแบรนด์ที่ MRT Supplier รองรับ"
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

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? "B2B SOURCING SUPPORT" : "B2B Sourcing Support"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {isThai
                ? "ความน่าเชื่อถือสำหรับงานจัดซื้อกับ MRT Supplier Co., Ltd."
                : "B2B trust for sourcing with MRT Supplier Co., Ltd."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {isThai
                ? "ออกแบบให้ผู้ซื้อเข้าใจทันทีว่าเราช่วยจัดหา Filters, Bearings และ Industrial Spare Parts ด้วยข้อมูล Part No. และ Cross Reference ที่ตรวจสอบได้"
                : "Designed so buyers quickly understand that MRT Supplier sources filters, bearings, and industrial spare parts using verifiable Part No. and Cross Reference details."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trustPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-sm font-semibold leading-6 text-slate-950">
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

      <section className="border-b border-slate-200 bg-slate-50">
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

      <section className="border-b border-slate-200 bg-white">
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
