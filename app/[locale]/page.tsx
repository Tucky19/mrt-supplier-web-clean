import BrandShowcase from "@/components/home/BrandShowcase";
import ProductGrid from "@/components/home/ProductGrid";
import ProductOverviewBanner from "@/components/home/ProductOverviewBanner";
import QuoteCTASection from "@/components/home/QuoteCTASection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SearchBar from "@/components/search/SearchBar";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isThai = locale === "th";

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

  const featuredProducts = [
    {
      id: "donaldson-p550958",
      brand: "Donaldson",
      image: "/products/filter-air-01.jpg",
      name: {
        th: "ไส้กรองเชื้อเพลิงหลักแบบ Spin-on",
        en: "Fuel Spin-on Primary",
      },
      spec: {
        th: "OD 119mm x L 227mm x 1 1/4-12",
        en: "OD 119mm x L 227mm x 1 1/4-12",
      },
    },
    {
      id: "donaldson-p550388",
      brand: "Donaldson",
      image: "/products/filter-oil-01.jpg",
      name: {
        th: "ไส้กรองน้ำมันเครื่องแบบ Spin-on",
        en: "Spin-On Lube Filter",
      },
      spec: {
        th: "OD 93mm x L 173mm x 1-12 UN",
        en: "OD 93mm x L 173mm x 1-12 UN",
      },
    },
    {
      id: "donaldson-p553000",
      brand: "Donaldson",
      image: "/products/filter-air-01.jpg",
      name: {
        th: "ไส้กรองเชื้อเพลิง / แยกน้ำ",
        en: "Fuel Filter / Water Separator",
      },
      spec: {
        th: "OD 108mm x L 260mm x 10µ",
        en: "OD 108mm x L 260mm x 10µ",
      },
    },
    {
      id: "donaldson-p164384",
      brand: "Donaldson",
      image: "/products/filter-oil-01.jpg",
      name: {
        th: "ไส้กรองไฮดรอลิก",
        en: "Hydraulic Filter",
      },
      spec: {
        th: "OD 128mm x L 303mm",
        en: "OD 128mm x L 303mm",
      },
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="bg-gradient-to-b from-slate-950 to-slate-800 px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Industrial Parts & RFQ Service
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {isThai
              ? "ค้นหาอะไหล่อุตสาหกรรมด้วย Part Number"
              : "Search Industrial Parts by Part Number"}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {isThai
              ? "ค้นหาด้วย Part Number, Cross Reference หรือชื่อสินค้า แล้วส่ง RFQ ให้ทีม MRT Supplier ช่วยตรวจสอบและเสนอราคาได้ทันที"
              : "Search by part number, cross reference, or product keyword, then send your RFQ to MRT Supplier for fast review and quotation."}
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar autoFocus={false} />
          </div>

          <p className="mt-4 text-xs text-slate-400">
            {isThai
              ? "ตัวอย่าง: P551315, P553004, Fuel Filter, Hydraulic Filter"
              : "Try: P551315, P553004, Fuel Filter, Hydraulic Filter"}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-300">
            <span>OEM Reference Support</span>
            <span>•</span>
            <span>Cross Reference Matching</span>
            <span>•</span>
            <span>
              {isThai
                ? "ตอบกลับ RFQ ภายใน 24 ชั่วโมง"
                : "RFQ response within 24 hours"}
            </span>
          </div>
        </div>
      </section>

      <BrandShowcase brands={featuredBrands} />
      <WhyChooseUsSection />
      <ProductOverviewBanner />
      <ProductGrid products={featuredProducts} />
      <QuoteCTASection />
      <SiteFooter locale={locale} />
    </main>
  );
}
