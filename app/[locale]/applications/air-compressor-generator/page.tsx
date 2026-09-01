import type { Metadata } from "next";
import Link from "next/link";
import {
  Droplets,
  Factory,
  FileText,
  Filter,
  Gauge,
  Search,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

const SITE_URL = "https://www.mrtsupplier.com";

const applicationItems = [
  { key: "screw", icon: Wind },
  { key: "piston", icon: Gauge },
  { key: "tank", icon: Factory },
  { key: "dryer", icon: Droplets },
  { key: "line", icon: Filter },
  { key: "spares", icon: Wrench },
  { key: "generator", icon: Zap },
] as const;

function getCopy(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "Air Compressor & Generator",
    title: isThai
      ? "ไส้กรองและอะไหล่สำหรับระบบอัดอากาศและเครื่องกำเนิดไฟฟ้า"
      : "Filters and spare parts for compressed-air and generator systems",
    intro: isThai
      ? "MRT Supplier ช่วยจัดหาไส้กรองและอะไหล่สำหรับ Screw Compressor, Piston Compressor, Air Tank, Air Dryer, Line Filter และ Generator โดยตรวจสอบจาก Part Number, รุ่นเครื่องจักร, Cross Reference หรือรูปสินค้า เน้นการค้นหาตัวเลือก MANN-FILTER และแบรนด์อื่นตามข้อมูลอ้างอิงที่ตรวจสอบได้"
      : "MRT Supplier sources filters and spare parts for screw compressors, piston compressors, air tanks, air dryers, line filters, and generators. We can work from a part number, machine model, documented cross reference, or product photo, with emphasis on MANN-FILTER options and other evidence-backed alternatives.",
    applicationsTitle: isThai ? "กลุ่มงานที่รองรับ" : "Applications we support",
    applicationsBody: isThai
      ? "ส่งรุ่นเครื่องจักรหรือเบอร์เดิมมาให้ทีมงานตรวจสอบก่อนเสนอราคา โดยไม่สมมติว่าเบอร์เทียบใช้แทนกันได้หากยังไม่มีหลักฐาน"
      : "Send the machine model or existing part number for review before quotation. We do not assume interchangeability where supporting evidence is not available.",
    items: {
      screw: {
        title: "Screw Compressor",
        body: isThai
          ? "งานกรองและอะไหล่สำหรับเครื่องอัดอากาศแบบสกรู รวมถึง AUGUST, Atlas Copco, Hitachi และ Kobelco ตามรุ่นและข้อมูลอ้างอิงที่ลูกค้าส่งมา"
          : "Filters and service parts for screw compressors, including AUGUST, Atlas Copco, Hitachi, and Kobelco applications when supported by the supplied model or reference data.",
      },
      piston: {
        title: "Piston Compressor",
        body: isThai
          ? "งานกรองและอะไหล่สำหรับเครื่องอัดอากาศแบบลูกสูบ ตรวจสอบจากรุ่นเครื่องและ Part Number เดิม"
          : "Filters and service parts for piston compressors, checked against the machine model and original part number.",
      },
      tank: {
        title: "Air Tank",
        body: isThai
          ? "อุปกรณ์และชิ้นส่วนที่เกี่ยวข้องกับระบบถังลม โดยยึดสเปกและรุ่นใช้งานจริง"
          : "Related air-receiver components sourced against the actual specification and application.",
      },
      dryer: {
        title: "Air Dryer",
        body: isThai
          ? "ไส้กรองและชิ้นส่วนสำหรับระบบทำลมแห้ง ตรวจสอบให้ตรงกับรุ่นและเงื่อนไขการใช้งาน"
          : "Filters and parts for compressed-air drying systems, matched to the dryer model and operating requirement.",
      },
      line: {
        title: "Line Filter",
        body: isThai
          ? "ไส้กรองในไลน์ลมและชุดกรองตามจุดใช้งาน ตรวจสอบขนาด การต่อ และระดับการกรองก่อนเลือกสินค้า"
          : "Compressed-air line filters and point-of-use filtration, checked for size, connection, and filtration requirement.",
      },
      spares: {
        title: "Compressor Spares",
        body: isThai
          ? "อะไหล่บำรุงรักษาสำหรับ Compressor โดยค้นจาก Part Number, Nameplate, คู่มือ หรือรูปสินค้า"
          : "Compressor maintenance spares sourced from part numbers, nameplates, manuals, or product photos.",
      },
      generator: {
        title: "Generator Filters",
        body: isThai
          ? "กรองอากาศ กรองน้ำมันเครื่อง และกรองเชื้อเพลิงสำหรับเครื่องกำเนิดไฟฟ้า โดยตรวจสอบรุ่นเครื่องยนต์และเบอร์เดิมก่อนเสนอราคา"
          : "Air, lube, and fuel filtration for generator sets, checked against the engine model and existing part number before quotation.",
      },
    },
    mannTitle: isThai ? "เน้น MANN-FILTER สำหรับงานกลุ่มนี้" : "MANN-FILTER emphasis for these applications",
    mannBody: isThai
      ? "เมื่อมีรุ่นเครื่องหรือเบอร์อ้างอิง ทีมงานจะตรวจสอบตัวเลือก MANN-FILTER เป็นลำดับต้น ๆ และสามารถตรวจสอบแบรนด์อื่นเพิ่มเติมได้ตามหลักฐานที่มี เพื่อให้ข้อมูลก่อนเสนอราคาไม่เกินกว่าที่ตรวจสอบได้"
      : "When a machine model or reference number is available, our team will check MANN-FILTER options early in the sourcing process and can review other brands where evidence supports the match. Quotation information is kept within what can be verified.",
    processTitle: isThai ? "ส่งข้อมูลแบบไหนให้ตรวจสอบได้เร็ว" : "What to send for faster checking",
    process: [
      isThai
        ? "Part Number เดิม หรือ Cross Reference ที่ลูกค้าใช้อยู่"
        : "Existing part number or cross reference currently in use",
      isThai
        ? "ยี่ห้อและรุ่นเครื่องจักร / รุ่นเครื่องยนต์"
        : "Machine brand and model / engine model",
      isThai
        ? "รูปสินค้า ป้าย Nameplate หรือรูปสเปกบนตัวอะไหล่"
        : "Product photo, nameplate, or specification marking",
      isThai
        ? "จำนวนที่ต้องการ และเงื่อนไขการใช้งานที่สำคัญ"
        : "Required quantity and any important operating condition",
    ],
    searchButton: isThai ? "ค้นหาสินค้า" : "Search products",
    quoteButton: isThai ? "ส่ง RFQ ให้ทีมงานตรวจสอบ" : "Send RFQ for review",
    note: isThai
      ? "ชื่อแบรนด์เครื่องจักรที่แสดงในหน้านี้ใช้เพื่อระบุประเภทการใช้งานและการค้นหาอะไหล่ ไม่ได้สื่อว่า MRT Supplier เป็นตัวแทนจำหน่ายอย่างเป็นทางการของแบรนด์ดังกล่าว"
      : "Machine-brand names on this page are used to identify applications and support part sourcing. They do not imply that MRT Supplier is an authorized distributor of those brands.",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";
  const path = `/${locale}/applications/air-compressor-generator`;

  return {
    title: isThai
      ? "ไส้กรอง Compressor และ Generator | MRT Supplier"
      : "Compressor & Generator Filters | MRT Supplier",
    description: isThai
      ? "จัดหาไส้กรองและอะไหล่สำหรับ Screw Compressor, Piston Compressor, Air Dryer, Line Filter และ Generator เน้น MANN-FILTER พร้อมบริการตรวจสอบ Part Number และ RFQ"
      : "Source filters and spare parts for screw compressors, piston compressors, air dryers, line filters, and generators with MANN-FILTER emphasis and RFQ support.",
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        th: `${SITE_URL}/th/applications/air-compressor-generator`,
        en: `${SITE_URL}/en/applications/air-compressor-generator`,
        "x-default": `${SITE_URL}/th/applications/air-compressor-generator`,
      },
    },
  };
}

export default async function AirCompressorGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = getCopy(locale);

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            {text.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {text.intro}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/products`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {text.searchButton}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {text.quoteButton}
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">
              {text.applicationsTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {text.applicationsBody}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applicationItems.map((item) => {
              const Icon = item.icon;
              const copy = text.items[item.key];

              return (
                <article
                  key={item.key}
                  className="min-w-0 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-text)]">
                    {copy.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {copy.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {text.mannTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {text.mannBody}
            </p>
          </div>

          <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {text.processTitle}
            </h2>
            <ol className="mt-4 space-y-3">
              {text.process.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold text-[var(--color-primary)]">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <p className="mt-8 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">
          {text.note}
        </p>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
