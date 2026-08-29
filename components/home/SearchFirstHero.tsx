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

const SECONDARY_BRANDS = [
  {
    name: "Fleetguard",
    logo: "/images/brands/secondary/fleetguard.png",
    width: 225,
    height: 225,
    slotClassName: "h-10 sm:h-11",
  },
  {
    name: "Baldwin Filters",
    logo: "/images/brands/secondary/baldwin-filters.png",
    width: 600,
    height: 600,
    slotClassName: "h-10 sm:h-11",
  },
  {
    name: "Wix Filters",
    logo: "/images/brands/secondary/wix-filters.png",
    width: 2000,
    height: 1862,
    slotClassName: "h-10 sm:h-11",
  },
  {
    name: "Parker",
    logo: "/images/brands/secondary/parker.png",
    width: 518,
    height: 518,
    slotClassName: "h-9 sm:h-10",
  },
  {
    name: "K-FLO",
    logo: "/images/brands/secondary/k-flo.png",
    width: 210,
    height: 90,
    slotClassName: "h-8 sm:h-9",
  },
  {
    name: "Atlas Copco",
    logo: "/images/brands/secondary/atlas-copco.webp",
    width: 330,
    height: 159,
    slotClassName: "h-8 sm:h-9",
  },
  {
    name: "XCMG",
    logo: "/images/brands/secondary/xcmg.png",
    width: 1020,
    height: 680,
    slotClassName: "h-8 sm:h-9",
  },
  {
    name: "SANY",
    logo: "/images/brands/secondary/sany.png",
    width: 824,
    height: 1000,
    slotClassName: "h-11 sm:h-12",
  },
  {
    name: "LiuGong",
    logo: "/images/brands/secondary/liugong.png",
    width: 2000,
    height: 707,
    slotClassName: "h-7 sm:h-8",
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

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="grid overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] sm:grid-cols-3">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/${locale}/products?q=${encodeURIComponent(brand.query)}`}
                  className={`flex min-h-24 items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 transition hover:bg-[var(--color-primary-soft)] sm:border-b-0 sm:border-r last:border-0 ${insetFocusClass}`}
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
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">→</span>
                </Link>
              ))}
            </div>

            <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
              <div className="mx-auto max-w-xl text-center">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {isThai
                    ? "รับตรวจสอบเบอร์เทียบจากหลายแบรนด์"
                    : "Cross-reference support for multiple brands"}
                </p>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)] sm:text-sm sm:leading-6">
                  {isThai
                    ? "ส่งเบอร์เดิมของคุณ เพื่อค้นหาตัวเลือก Donaldson หรือ MANN-FILTER ที่เหมาะกับการใช้งาน"
                    : "Send us your existing part number to find a suitable Donaldson or MANN-FILTER option."}
                </p>
              </div>

              <ul
                aria-label={isThai ? "แบรนด์ที่รองรับการตรวจสอบเบอร์เทียบ" : "Brands supported for cross-reference review"}
                className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center"
              >
                {SECONDARY_BRANDS.map((brand, index) => (
                  <li
                    key={brand.name}
                    className={`flex min-h-16 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 sm:min-h-14 ${
                      index > 4 ? "sm:basis-[calc(25%-0.5rem)]" : "sm:basis-[calc(20%-0.5rem)]"
                    }`}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className={`w-full object-contain ${brand.slotClassName}`}
                      sizes="(max-width: 640px) 30vw, 120px"
                    />
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-center text-xs leading-5 text-[var(--color-text-muted)]">
                {isThai
                  ? "ไม่พบแบรนด์ของคุณในรายการ? ส่ง Part No. ให้ทีมงานตรวจสอบได้"
                  : "Don’t see your brand listed? Send us the part number and our team will check it."}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-7 grid max-w-7xl overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex gap-4 border-b border-[var(--color-border)] p-5 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div>
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
