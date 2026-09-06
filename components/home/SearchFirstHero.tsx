import Image from "next/image";
import Link from "next/link";
import {
  Headset,
  Link2,
  MessageCircle,
  Ruler,
  Users,
} from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import BrandApplicationCarousel from "@/components/home/BrandApplicationCarousel";
import SearchBar from "@/components/search/SearchBar";

const LINE_URL = "https://lin.ee/S676yYH";
const lightFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";
const insetFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)]";

const EXAMPLE_QUERIES = [
  "FUEL FILTER",
  "LUBE FILTER",
  "HYDRAULIC FILTER",
  "AIR FILTER",
  "OIL SEPARATOR",
];

const PRIMARY_BRAND_HOTSPOTS = [
  {
    name: "Donaldson",
    query: "Donaldson",
    position: "left-[3%] top-[15%] h-[35%] w-[47%]",
  },
  {
    name: "NTN",
    query: "NTN",
    position: "left-[50%] top-[16%] h-[32%] w-[46%]",
  },
  {
    name: "MANN-FILTER",
    query: "MANN-FILTER",
    position: "left-[6%] top-[49%] h-[32%] w-[39%]",
  },
  {
    name: "Fleetguard",
    query: "Fleetguard",
    position: "left-[45%] top-[51%] h-[33%] w-[47%]",
  },
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
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(37,99,235,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.075)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div aria-hidden="true" className="absolute -left-24 top-28 h-64 w-64 rounded-full border border-blue-300/55" />
      <div aria-hidden="true" className="absolute -right-16 top-16 h-52 w-52 rotate-45 border border-blue-300/55" />
      <div aria-hidden="true" className="absolute left-[8%] top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] sm:text-sm">
            B2B Industrial Sourcing &amp; RFQ
          </p>
          <h1 className="mt-3 text-[1.75rem] font-bold leading-[1.12] tracking-tight text-[var(--color-text)] sm:mt-4 sm:text-5xl lg:text-[3.55rem]">
            {isThai
              ? "ค้นหาอะไหล่อุตสาหกรรมด้วย Part No. และ Cross Reference"
              : "Find industrial parts by Part No. and Cross Reference"}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:mt-4 sm:text-lg sm:leading-7">
            {isThai
              ? "ช่วยทีมจัดซื้อและทีมซ่อมบำรุงค้นหา Filters, Bearings และอะไหล่อุตสาหกรรม พร้อมส่งขอใบเสนอราคาในขั้นตอนเดียว"
              : "Help purchasing and maintenance teams find filters, bearings, and industrial parts, then submit an RFQ in one flow."}
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-6xl rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-md)] sm:mt-8 sm:p-5">
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
              className={`inline-flex min-h-12 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-primary)] bg-[var(--color-surface)] px-6 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] lg:min-h-[60px] ${lightFocusClass}`}
            >
              {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex items-center justify-center gap-2 text-center sm:justify-start sm:text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Ruler className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {isThai
                    ? "ไม่มี Part No. แต่ทราบขนาดไส้กรอง?"
                    : "No Part No., but know the filter dimensions?"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {isThai
                    ? "ค้นหาจาก OD, ID, Length/Height และ Thread Size"
                    : "Search by OD, ID, Length/Height, and Thread Size"}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/products/dimensions`}
              className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-primary)] bg-[var(--color-surface)] px-4 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-text-inverse)] ${lightFocusClass}`}
            >
              {isThai ? "ค้นหาด้วยขนาด →" : "Search by dimensions →"}
            </Link>
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3 text-center text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              {isThai ? "ไม่พบสินค้าที่ต้องการ? " : "Cannot find the item? "}
              <Link
                href={`/${locale}/products?request=1#missing-product-request`}
                className={`rounded-[var(--mrt-radius-sm)] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
              >
                {isThai ? "ส่งข้อมูลให้ทีมช่วยค้นหา →" : "Send details to our sourcing team →"}
              </Link>
            </div>
            <TrackedLineLink
              href={LINE_URL}
              source="hero_search"
              locale={locale}
              className={`inline-flex items-center justify-center gap-1.5 rounded-[var(--mrt-radius-sm)] font-semibold text-[var(--color-success-text)] transition hover:text-[var(--color-success-hover)] ${lightFocusClass}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {isThai ? "ส่งรูปหรือ Part No. ทาง LINE" : "Send a photo or Part No. on LINE"}
            </TrackedLineLink>
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-7xl">
          <div className="flex items-center gap-4 text-sm font-semibold text-[var(--color-text)]">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span>{isThai ? "ค้นหายอดนิยม" : "Popular searches"}</span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <div className="mt-4 grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-white/40 shadow-[var(--shadow-sm)] backdrop-blur-[1px]">
              <div className="relative aspect-video w-full overflow-hidden bg-transparent">
                <Image
                  src="/images/brands/primary-brand-showcase.webp"
                  alt={isThai ? "แบรนด์หลัก Donaldson, NTN, MANN-FILTER และ Fleetguard" : "Primary brands: Donaldson, NTN, MANN-FILTER, and Fleetguard"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {PRIMARY_BRAND_HOTSPOTS.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/${locale}/products?q=${encodeURIComponent(brand.query)}`}
                  className={`group absolute rounded-lg transition hover:bg-white/15 ${brand.position} ${insetFocusClass}`}
                  aria-label={`${isThai ? "ค้นหาสินค้าแบรนด์" : "Search products from"} ${brand.name}`}
                >
                  <span
                    className="absolute bottom-2 right-2 inline-flex h-7 w-7 translate-x-1 items-center justify-center rounded-full border border-white/80 bg-white/95 text-sm font-semibold text-[var(--color-primary)] opacity-0 shadow-sm transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
                ))}
              </div>
              <div className="flex min-h-[58px] flex-col justify-center gap-1 border-t border-[var(--color-border)] bg-white/45 px-4 py-3 text-center backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {isThai ? "แบรนด์หลักที่ MRT รองรับ" : "Primary brands supported by MRT"}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {isThai ? "กดที่โลโก้เพื่อค้นหาสินค้า" : "Select a logo to search products"}
                </p>
              </div>
            </div>

            <BrandApplicationCarousel locale={locale} />
          </div>
        </div>

        <div className="mx-auto mt-7 grid max-w-7xl min-w-0 overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] md:grid-cols-[repeat(3,minmax(0,1fr))]">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex min-w-0 gap-4 border-b border-[var(--color-border)] p-5 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]">{item.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
