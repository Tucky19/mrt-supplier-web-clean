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
        ? "ผู้เชี่ยวชาญจัดหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมสำหรับโรงงาน ผู้รับเหมา และฝ่ายซ่อมบำรุง"
        : "Specialists in sourcing filters, bearings, and industrial spare parts for factories, contractors, and maintenance teams.",
    },
    {
      title: isThai ? "ค้นหาด้วย Part No. / Cross Reference" : "Part No. & Cross Reference support",
      description: isThai
        ? "ค้นหาหรือส่ง Part No., Cross Reference, เบอร์เทียบ แบรนด์ หรือข้อมูลเครื่องจักรให้ทีมช่วยตรวจสอบ"
        : "Search or send Part No., cross references, equivalent numbers, brands, or machine details for review.",
    },
    {
      title: isThai ? "โฟกัสไส้กรองและลูกปืน" : "Focused on filters and bearings",
      description: isThai
        ? "ครอบคลุมไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมที่ใช้ในเครื่องจักรและงานซ่อมบำรุง"
        : "Coverage for filters, bearings, and related industrial spare parts used in machinery and maintenance work.",
    },
    {
      title: isThai ? "เหมาะกับงานจัดซื้อ B2B" : "Built for B2B procurement",
      description: isThai
        ? "รวบรวมหลายรายการ ส่ง RFQ ครั้งเดียว และรับการติดตามกลับที่ชัดเจนสำหรับฝ่ายจัดซื้อ"
        : "Collect multiple line items, submit one RFQ, and receive clear follow-up for your purchasing team.",
    },
    {
      title: isThai ? "ตรวจสอบก่อนเสนอราคา" : "Checked before quotation",
      description: isThai
        ? "ตรวจสอบ Spec, Cross Reference และการใช้งานก่อนสรุปราคา สต็อก และทางเลือกที่เหมาะสม"
        : "Specs, cross references, and applications are reviewed before price, stock, and alternatives are confirmed.",
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
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <section className="overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(47,128,237,0.12),_transparent_34%),linear-gradient(180deg,_#ffffff_0%,_#f7f9fc_100%)] px-4 py-14 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              {isThai
                ? "B2B INDUSTRIAL SOURCING & RFQ"
                : "B2B Industrial Sourcing & RFQ"}
            </p>

            <h1 className="mt-5 text-3xl font-bold leading-[1.14] tracking-tight text-[#0b1f3a] sm:text-5xl lg:text-[3.5rem]">
              {isThai
                ? "ค้นหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมจากเบอร์ที่คุณมี"
                : "Find filters, bearings, and industrial spare parts from the numbers you have"}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {isThai
                ? "ใส่ Part Number, Cross Reference หรือชื่อสินค้า ระบบจะแสดงรายการที่เกี่ยวข้องเพื่อเพิ่มเข้า RFQ หากไม่พบ ทีม MRT Supplier จะช่วยตรวจสอบและจัดหาให้"
                : "Enter a part number, cross reference, or product name. Review relevant matches and add them to your RFQ, or ask MRT Supplier to identify and source a missing item."}
            </p>
          </div>

          <div className="mt-9 w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-4 text-left shadow-[0_22px_60px_rgba(15,23,42,0.10)] sm:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0b1f3a]">
                  {isThai
                    ? "ค้นหาสินค้าและเบอร์เทียบ"
                    : "Search products and cross references"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {isThai
                    ? "เริ่มจากข้อมูลที่มี ระบบจะแนะนำผลลัพธ์ที่ใกล้เคียงที่สุด"
                    : "Start with the information you have and review the closest matches."}
                </p>
              </div>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex w-fit items-center text-sm font-semibold text-blue-700 transition hover:text-blue-900"
              >
                {isThai
                  ? "มีรายการแล้ว? เปิด RFQ →"
                  : "Already have a list? Open RFQ →"}
              </Link>
            </div>

            <div className="flex justify-center">
              <SearchBar
                locale={locale}
                autoFocus={false}
                exampleQueries={homepageExampleQueries}
              />
            </div>

            <MissingProductRequestCta locale={locale} variant="light" />
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              {isThai
                ? "ค้นหาด้วย Part Number / Cross Reference"
                : "Part Number & Cross Reference Support"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              {isThai
                ? "ส่งหลายรายการเข้า RFQ ได้"
                : "Bulk RFQ for multiple items"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              {isThai
                ? "สำหรับ Maintenance และ Purchasing"
                : "Built for maintenance and procurement teams"}
            </span>
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
                ? "ออกแบบให้ผู้ซื้อเข้าใจทันทีว่า MRT Supplier Co., Ltd. ช่วยจัดหาไส้กรอง ลูกปืน และอะไหล่อุตสาหกรรมด้วย Part No. และ Cross Reference ที่ตรวจสอบได้"
                : "Designed so buyers quickly understand that MRT Supplier Co., Ltd. sources filters, bearings, and industrial spare parts using verifiable Part No. and Cross Reference details."}
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
