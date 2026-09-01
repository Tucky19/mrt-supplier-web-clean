import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

const SITE_URL = "https://www.mrtsupplier.com";

const APPLICATION_SLUGS = [
  "screw-compressor",
  "piston-compressor",
  "air-tank",
  "air-dryer",
  "line-filter",
  "compressor-spares",
  "generator-filters",
] as const;

type ApplicationSlug = (typeof APPLICATION_SLUGS)[number];

type ApplicationCopy = {
  title: string;
  summary: string;
  checks: string[];
  machineBrands?: string[];
  mannNote: string;
};

function isApplicationSlug(value: string): value is ApplicationSlug {
  return APPLICATION_SLUGS.includes(value as ApplicationSlug);
}

function getApplicationCopy(slug: ApplicationSlug, locale: string): ApplicationCopy {
  const isThai = locale === "th";

  const copy: Record<ApplicationSlug, ApplicationCopy> = {
    "screw-compressor": {
      title: "Screw Compressor",
      summary: isThai
        ? "บริการจัดหาไส้กรองและอะไหล่บำรุงรักษาสำหรับเครื่องอัดอากาศแบบสกรู โดยตรวจสอบจากรุ่นเครื่อง Part Number เดิม คู่มือ หรือข้อมูล Cross Reference ที่มีแหล่งอ้างอิง"
        : "Sourcing support for screw-compressor filters and maintenance parts, checked against the machine model, original part number, manual, or documented cross-reference source.",
      checks: isThai
        ? [
            "ยี่ห้อและรุ่น Screw Compressor",
            "Part Number เดิมและจำนวนที่ต้องการ",
            "หน้าที่ของชิ้นส่วน เช่น กรองอากาศ กรองน้ำมัน หรือชุดบำรุงรักษา",
            "ขนาด เกลียว หรือสเปกที่ระบุบนชิ้นส่วนเมื่อมี",
          ]
        : [
            "Screw-compressor brand and model",
            "Existing part number and required quantity",
            "Part function, such as air filtration, oil filtration, or maintenance component",
            "Dimensions, thread, or marked specification when available",
          ],
      machineBrands: ["AUGUST", "Atlas Copco", "Hitachi", "Kobelco"],
      mannNote: isThai
        ? "ทีมงานจะตรวจสอบตัวเลือก MANN-FILTER ในรายการที่อยู่ในขอบเขตผลิตภัณฑ์และมีข้อมูลอ้างอิงรองรับ พร้อมตรวจสอบแบรนด์อื่นเมื่อจำเป็น โดยไม่ยืนยันการใช้แทนกันจากชื่อหรือขนาดเพียงอย่างเดียว"
        : "We check MANN-FILTER options where the requested item is within the supported product scope and the reference evidence is sufficient, then review other brands when needed. Interchangeability is not confirmed from name or dimensions alone.",
    },
    "piston-compressor": {
      title: "Piston Compressor",
      summary: isThai
        ? "บริการค้นหาไส้กรองและอะไหล่สำหรับเครื่องอัดอากาศแบบลูกสูบ โดยยึดรุ่นเครื่องและ Part Number เดิมเป็นข้อมูลหลักก่อนเสนอราคา"
        : "Sourcing support for piston-compressor filters and parts, using the machine model and original part number as the primary references before quotation.",
      checks: isThai
        ? [
            "รุ่นเครื่องและข้อมูลบน Nameplate",
            "Part Number หรือรหัสอะไหล่เดิม",
            "รูปชิ้นส่วนและตำแหน่งติดตั้ง",
            "ขนาดและการต่อที่เกี่ยวข้อง",
          ]
        : [
            "Machine model and nameplate information",
            "Existing part or spare-part number",
            "Part photo and installation position",
            "Relevant dimensions and connections",
          ],
      mannNote: isThai
        ? "สำหรับรายการกรองที่มีข้อมูลอ้างอิงเพียงพอ ทีมงานจะตรวจสอบ MANN-FILTER เป็นหนึ่งในตัวเลือกหลัก และจะไม่สร้างเบอร์เทียบใหม่หากยังไม่มีหลักฐาน"
        : "For filtration items with sufficient reference data, MANN-FILTER is checked as a primary option. We do not create new cross references without supporting evidence.",
    },
    "air-tank": {
      title: "Air Tank",
      summary: isThai
        ? "บริการจัดหาชิ้นส่วนที่เกี่ยวข้องกับระบบถังลมและอุปกรณ์ประกอบ โดยตรวจสอบจากสเปก การต่อ และเงื่อนไขการใช้งานจริง"
        : "Sourcing support for air-receiver system components and related accessories, checked against actual specifications, connections, and operating conditions.",
      checks: isThai
        ? [
            "ขนาดและแรงดันใช้งานของระบบ",
            "ชนิดและขนาดการต่อ",
            "Part Number หรือรูปชิ้นส่วนเดิม",
            "ตำแหน่งใช้งานในระบบลม",
          ]
        : [
            "System size and operating pressure",
            "Connection type and size",
            "Existing part number or part photo",
            "Installation position in the compressed-air system",
          ],
      mannNote: isThai
        ? "หากรายการเกี่ยวข้องกับชุดกรองในระบบลม ทีมงานจะตรวจสอบตัวเลือก MANN-FILTER เมื่อมีข้อมูลอ้างอิงที่เหมาะสม ส่วนอุปกรณ์ประเภทอื่นจะจัดหาตามสเปกและหลักฐานของผู้ผลิตที่เกี่ยวข้อง"
        : "Where the request involves filtration in the compressed-air system, MANN-FILTER options are checked when suitable reference data exists. Other component types are sourced against the relevant specification and manufacturer evidence.",
    },
    "air-dryer": {
      title: "Air Dryer",
      summary: isThai
        ? "บริการค้นหาไส้กรองและชิ้นส่วนสำหรับระบบทำลมแห้ง โดยต้องตรวจสอบรุ่น Dryer, Part Number และเงื่อนไขการใช้งานก่อนเลือกสินค้า"
        : "Sourcing support for filters and parts used with compressed-air dryers, with the dryer model, part number, and operating requirement checked before selection.",
      checks: isThai
        ? [
            "ยี่ห้อและรุ่น Air Dryer",
            "Part Number เดิมหรือข้อมูลจากคู่มือ",
            "ชนิดของชิ้นส่วนและตำแหน่งในระบบ",
            "เงื่อนไขการใช้งานที่ผู้ผลิตระบุ",
          ]
        : [
            "Air-dryer brand and model",
            "Existing part number or manual reference",
            "Component type and system position",
            "Manufacturer-stated operating requirement",
          ],
      mannNote: isThai
        ? "MANN-FILTER จะถูกตรวจสอบเมื่อรายการอยู่ในกลุ่มผลิตภัณฑ์ที่เกี่ยวข้องและมีหลักฐานรองรับ หากไม่อยู่ในขอบเขตนั้นทีมงานจะตรวจสอบแบรนด์อื่นตามสเปกจริง"
        : "MANN-FILTER is checked when the requested item falls within a relevant product range and evidence supports the match. Otherwise, other brands are reviewed against the actual specification.",
    },
    "line-filter": {
      title: "Line Filter",
      summary: isThai
        ? "บริการจัดหาไส้กรองในไลน์ลมและชุดกรองตามจุดใช้งาน โดยตรวจสอบขนาด การต่อ ระดับการกรอง และ Part Number ก่อนเสนอราคา"
        : "Sourcing support for compressed-air line filters and point-of-use filtration, checked for size, connection, filtration requirement, and part number before quotation.",
      checks: isThai
        ? [
            "Part Number และยี่ห้อเดิม",
            "ขนาดตัวกรองและขนาดการต่อ",
            "ระดับการกรองหรือสเปกที่ระบุ",
            "ตำแหน่งใช้งานในระบบลม",
          ]
        : [
            "Existing part number and brand",
            "Filter and connection size",
            "Filtration grade or stated specification",
            "Installation position in the air system",
          ],
      mannNote: isThai
        ? "ทีมงานจะตรวจสอบ MANN-FILTER เมื่อมีรายการและข้อมูลเทียบที่ตรวจสอบได้ พร้อมเสนอแบรนด์อื่นเมื่อสเปกหรือระบบใช้งานต้องการตัวเลือกที่ต่างออกไป"
        : "We check MANN-FILTER where a verifiable product or reference is available and review other brands where the system specification calls for a different option.",
    },
    "compressor-spares": {
      title: "Compressor Spares",
      summary: isThai
        ? "บริการจัดหาอะไหล่บำรุงรักษา Compressor จาก Part Number, Nameplate, คู่มือ หรือรูปสินค้า โดยแยกการตรวจสอบตามชนิดชิ้นส่วนก่อนเสนอราคา"
        : "Compressor maintenance-spare sourcing from part numbers, nameplates, manuals, or product photos, with each component reviewed according to its actual function before quotation.",
      checks: isThai
        ? [
            "รุ่นเครื่อง Compressor",
            "Part Number หรือเลขชุดบำรุงรักษาเดิม",
            "รูปชิ้นส่วนและข้อมูลบนฉลาก",
            "จำนวนและรอบการบำรุงรักษาที่ต้องการ",
          ]
        : [
            "Compressor model",
            "Existing part or maintenance-kit number",
            "Part photo and label information",
            "Required quantity and maintenance interval",
          ],
      mannNote: isThai
        ? "สำหรับชิ้นส่วนประเภทกรอง ทีมงานจะตรวจสอบ MANN-FILTER เป็นลำดับต้น ๆ เมื่อมีหลักฐานรองรับ ส่วนอะไหล่ประเภทอื่นจะจัดหาตามผู้ผลิตและสเปกของชิ้นส่วนนั้น"
        : "For filtration components, MANN-FILTER is checked early when evidence supports the application. Other spare-part types are sourced according to the relevant manufacturer and component specification.",
    },
    "generator-filters": {
      title: "Generator Filters",
      summary: isThai
        ? "บริการจัดหากรองอากาศ กรองน้ำมันเครื่อง และกรองเชื้อเพลิงสำหรับเครื่องกำเนิดไฟฟ้า โดยตรวจสอบรุ่นเครื่องยนต์และ Part Number เดิมก่อนเลือกสินค้า"
        : "Sourcing support for generator air, lube, and fuel filters, checked against the engine model and original part number before product selection.",
      checks: isThai
        ? [
            "ยี่ห้อและรุ่น Generator / รุ่นเครื่องยนต์",
            "Part Number ของกรองเดิม",
            "ประเภทกรอง: Air, Lube หรือ Fuel",
            "ขนาด เกลียว และสเปกสำคัญเมื่อมี",
          ]
        : [
            "Generator brand/model and engine model",
            "Existing filter part number",
            "Filter type: air, lube, or fuel",
            "Dimensions, thread, and critical specifications when available",
          ],
      mannNote: isThai
        ? "ทีมงานจะตรวจสอบตัวเลือก MANN-FILTER และแบรนด์หลักอื่นจากข้อมูล Part Number และสเปกที่ตรวจสอบได้ โดย Cross Reference ที่ยังไม่ยืนยันจะถูกใช้เป็นข้อมูลประกอบเท่านั้น"
        : "We check MANN-FILTER and other core-brand options from verifiable part-number and specification data. Unverified cross references remain informational only.",
    },
  };

  return copy[slug];
}

export function generateStaticParams() {
  return APPLICATION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isApplicationSlug(slug)) {
    return {
      title: "Application Not Found | MRT Supplier",
      robots: { index: false, follow: false },
    };
  }

  const copy = getApplicationCopy(slug, locale);
  const path = `/${locale}/applications/${slug}`;
  const isThai = locale === "th";

  return {
    title: `${copy.title} | MRT Supplier`,
    description: copy.summary,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        th: `${SITE_URL}/th/applications/${slug}`,
        en: `${SITE_URL}/en/applications/${slug}`,
        "x-default": `${SITE_URL}/th/applications/${slug}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${copy.title} | MRT Supplier`,
      description: copy.summary,
      url: `${SITE_URL}${path}`,
      siteName: "MRT Supplier",
      type: "website",
      locale: isThai ? "th_TH" : "en_US",
    },
  };
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isApplicationSlug(slug)) {
    notFound();
  }

  const isThai = locale === "th";
  const copy = getApplicationCopy(slug, locale);

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href={`/${locale}/applications/air-compressor-generator`}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--mrt-radius-md)] text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {isThai ? "กลับไปหมวด Compressor / Generator" : "Back to Compressor / Generator"}
        </Link>

        <div className="mt-5 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            {isThai ? "ประเภทการใช้งาน" : "Application"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {copy.summary}
          </p>
        </div>

        {copy.machineBrands && copy.machineBrands.length > 0 ? (
          <section className="mt-8 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <h2 className="text-lg font-semibold">
              {isThai ? "แบรนด์เครื่องจักรที่ใช้เป็นข้อมูลค้นหา" : "Machine brands used as sourcing references"}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.machineBrands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-text)]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <h2 className="text-xl font-semibold">
              {isThai ? "ข้อมูลที่ทีมงานใช้ตรวจสอบ" : "Information used for checking"}
            </h2>
            <ul className="mt-4 space-y-3">
              {copy.checks.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <h2 className="text-xl font-semibold">
              {isThai ? "แนวทางเลือกแบรนด์และเบอร์เทียบ" : "Brand and cross-reference approach"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
              {copy.mannNote}
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {isThai ? "มี Part Number หรือรูปสินค้าแล้ว?" : "Already have a part number or product photo?"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
            {isThai
              ? "ค้นหาในฐานข้อมูลก่อน หรือส่ง RFQ พร้อมรุ่นเครื่อง จำนวน และข้อมูลอ้างอิงให้ทีมงานตรวจสอบ"
              : "Search the catalog first, or send an RFQ with the machine model, quantity, and available reference information for review."}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/products`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {isThai ? "ค้นหาสินค้า" : "Search products"}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {isThai ? "ส่ง RFQ" : "Send RFQ"}
            </Link>
          </div>
        </section>

        <p className="mt-8 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">
          {isThai
            ? "ชื่อแบรนด์เครื่องจักรที่แสดงใช้เพื่อระบุประเภทการใช้งานและช่วยค้นหาอะไหล่ ไม่ได้สื่อว่า MRT Supplier เป็นตัวแทนจำหน่ายอย่างเป็นทางการของแบรนด์ดังกล่าว"
            : "Machine-brand names are used to identify applications and support part sourcing. They do not imply that MRT Supplier is an authorized distributor of those brands."}
        </p>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
