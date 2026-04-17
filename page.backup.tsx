import BrandShowcase from "@/components/home/BrandShowcase";
import HeroSection from "@/components/home/HeroSection";
import ProductGrid from "@/components/home/ProductGrid";
import ProductOverviewBanner from "@/components/home/ProductOverviewBanner";
import QuoteCTASection from "@/components/home/QuoteCTASection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

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
      th: "OD 119mm × L 227mm × 1 1/4-12",
      en: "OD 119mm × L 227mm × 1 1/4-12",
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
      th: "OD 93mm × L 173mm × 1-12 UN",
      en: "OD 93mm × L 173mm × 1-12 UN",
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
      th: "OD 108mm × L 260mm × 10µ",
      en: "OD 108mm × L 260mm × 10µ",
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
      th: "OD 128mm × L 303mm",
      en: "OD 128mm × L 303mm",
    },
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <HeroSection />
      <BrandShowcase brands={featuredBrands} />
      <WhyChooseUsSection />
      <ProductOverviewBanner />
      <ProductGrid products={featuredProducts} />
      <QuoteCTASection />
      <SiteFooter />
    </main>
  );
}