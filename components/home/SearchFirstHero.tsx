import Image from "next/image";
import Link from "next/link";
import {
  AirVent,
  CircleGauge,
  Headset,
  Link2,
  MessageCircle,
  PackageSearch,
  Users,
} from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SearchBar from "@/components/search/SearchBar";

const LINE_URL = "https://lin.ee/S676yYH";

const EXAMPLE_QUERIES = [
  "FUEL FILTER",
  "LUBE FILTER",
  "HYDRAULIC FILTER",
  "AIR FILTER",
  "OIL SEPARATOR",
];

const BRANDS = [
  {
    name: "Donaldson",
    logo: "/brands/donaldson.png",
    query: "Donaldson",
  },
  {
    name: "MANN-FILTER",
    logo: "/brands/mann-filter.png",
    query: "MANN-FILTER",
  },
  {
    name: "NTN",
    logo: "/brands/ntn.png",
    query: "NTN",
  },
];

const CATEGORIES = [
  { name: "Air Filter", query: "air filter", icon: AirVent },
  { name: "Hydraulic Filter", query: "hydraulic filter", icon: PackageSearch },
  { name: "Bearings", query: "bearing", icon: CircleGauge },
];

export default function SearchFirstHero({ locale }: { locale: string }) {
  const isThai = locale === "th";
  const trustItems = [
    {
      icon: Link2,
      title: isThai ? "ค้นหาด้วย Cross Reference" : "Cross-reference search",
      description: isThai
        ? "เชื่อมโยงหมายเลขอะไหล่จากหลายแบรนด์เพื่อค้นหารายการที่เกี่ยวข้อง"
        : "Connect part numbers across brands to find relevant matches.",
    },
    {
      icon: Users,
      title: isThai ? "รองรับงานจัดซื้อ B2B" : "Built for B2B purchasing",
      description: isThai
        ? "รวมหลายรายการไว้ใน RFQ เดียว เหมาะกับฝ่ายจัดซื้อและซ่อมบำรุง"
        : "Collect multiple items in one RFQ for purchasing and maintenance teams.",
    },
    {
      icon: Headset,
      title: isThai ? "ทีมงานช่วยตรวจสอบรุ่น" : "Model verification support",
      description: isThai
        ? "ส่งข้อมูลหรือรูปสินค้าให้ทีมช่วยตรวจสอบและแนะนำรายการที่เหมาะสม"
        : "Send product details or photos for model and sourcing assistance.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-blue-200/70 bg-white/35 px-4 py-8 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(37,99,235,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.075)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div aria-hidden="true" className="absolute -left-24 top-28 h-64 w-64 rounded-full border border-blue-300/55" />
      <div aria-hidden="true" className="absolute -right-16 top-16 h-52 w-52 rotate-45 border border-blue-300/55" />
      <div aria-hidden="true" className="absolute left-[8%] top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-sm">
            B2B Industrial Sourcing &amp; RFQ
          </p>
          <h1 className="mt-3 text-[1.75rem] font-bold leading-[1.12] tracking-tight text-[#0b1f3a] sm:mt-4 sm:text-5xl lg:text-[3.55rem]">
            {isThai
              ? "ค้นหาอะไหล่อุตสาหกรรมด้วย Part No. และ Cross Reference"
              : "Find industrial parts by Part No. and Cross Reference"}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-7">
            {isThai
              ? "ช่วยทีมจัดซื้อและทีมซ่อมบำรุงค้นหา Filters, Bearings และอะไหล่อุตสาหกรรม พร้อมส่งขอใบเสนอราคาในขั้นตอนเดียว"
              : "Help purchasing and maintenance teams find filters, bearings, and industrial parts, then submit an RFQ in one flow."}
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_42px_rgba(15,23,42,0.12)] sm:mt-8 sm:p-5">
          <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <SearchBar
              locale={locale}
              className="max-w-none"
              autoFocus={false}
              exampleQueries={EXAMPLE_QUERIES}
              compactMobileExamples
            />
            <Link
              href={`/${locale}/quote`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-600 bg-white px-6 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 lg:min-h-[60px]"
            >
              {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              {isThai ? "ไม่พบสินค้าที่ต้องการ? " : "Cannot find the item? "}
              <Link
                href={`/${locale}/products?request=1#missing-product-request`}
                className="font-semibold text-blue-700 hover:text-blue-900"
              >
                {isThai ? "ส่งข้อมูลให้ทีมช่วยค้นหา →" : "Send details to our sourcing team →"}
              </Link>
            </div>
            <TrackedLineLink
              href={LINE_URL}
              source="hero_search"
              locale={locale}
              className="inline-flex items-center justify-center gap-1.5 font-semibold text-[#07883d] transition hover:text-[#056d31]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {isThai ? "ส่งรูปหรือ Part No. ทาง LINE" : "Send a photo or Part No. on LINE"}
            </TrackedLineLink>
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-7xl">
          <div className="flex items-center gap-4 text-sm font-semibold text-[#0b1f3a]">
            <span className="h-px flex-1 bg-slate-200" />
            <span>{isThai ? "ค้นหายอดนิยม" : "Popular searches"}</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-3">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/${locale}/products?q=${encodeURIComponent(brand.query)}`}
                  className="flex min-h-24 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-blue-50/60 sm:border-b-0 sm:border-r last:border-0"
                >
                  <div className="relative h-12 min-w-0 flex-1">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="180px"
                      className="object-contain object-left"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">→</span>
                </Link>
              ))}
            </div>

            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-3">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={`/${locale}/products?q=${encodeURIComponent(category.query)}`}
                    className="flex min-h-24 items-center gap-3 border-b border-slate-100 px-5 py-4 text-sm font-semibold text-[#0b1f3a] transition hover:bg-blue-50/60 sm:border-b-0 sm:border-r last:border-0"
                  >
                    <Icon className="h-8 w-8 shrink-0 text-blue-700" strokeWidth={1.6} />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-7 grid max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex gap-4 border-b border-slate-200 p-5 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-[#0b1f3a]">{item.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
