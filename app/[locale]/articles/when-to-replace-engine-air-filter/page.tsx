import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  EyeOff,
  FileText,
  Gauge,
  Wrench,
} from "lucide-react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.mrtsupplier.com";
const PUBLISHED_DATE = "2026-09-23";
const SLUG = "when-to-replace-engine-air-filter";

const SOURCE_URLS = {
  donaldsonService:
    "https://www.donaldson.com/en/resources/technical-articles/servicing-by-restriction/",
  donaldsonEfficiency:
    "https://www.donaldson.com/en/resources/technical-articles/air-filter-efficiency-explained/",
  mannService:
    "https://www.mann-filter.com/en/news-stories/press-releases/2025/easy-servicing-thanks-to-innovative-air-filter.html",
} as const;

type PageProps = { params: Promise<{ locale: string }> };

function getCopy(locale: string) {
  const isThai = locale === "th";

  return {
    category: isThai
      ? "ความรู้ด้านการบำรุงรักษาไส้กรอง"
      : "Filter maintenance knowledge",
    title: isThai
      ? "ควรเปลี่ยนไส้กรองอากาศเมื่อไร? อย่าดูจากความสกปรกเพียงอย่างเดียว"
      : "When should an engine air filter be replaced? Do not judge by appearance alone",
    intro: isThai
      ? "ไส้กรองอากาศที่ดูสกปรกอาจยังทำงานได้ตามปกติ ขณะที่ไส้กรองซึ่งดูไม่สกปรกมากอาจสร้างความต้านทานสูงแล้ว การตัดสินใจเปลี่ยนจึงควรอ้างอิงค่าความต้านทาน ข้อกำหนดของผู้ผลิตเครื่อง และสภาพการใช้งานร่วมกัน"
      : "A filter that looks dirty may still be operating normally, while one that appears acceptable may already be creating excessive restriction. Replacement decisions should combine restriction readings, equipment-maker limits, and actual operating conditions.",
    published: isThai ? "เผยแพร่ 23 กันยายน 2569" : "Published 23 September 2026",
    answerTitle: isThai ? "คำตอบสั้น ๆ" : "The short answer",
    answerBody: isThai
      ? "สำหรับไส้กรองอากาศเครื่องยนต์ที่มีระบบวัดค่าความต้านทาน ควรใช้เกจหรือ Service Indicator เป็นข้อมูลหลัก และต้องไม่ปล่อยให้เกินค่าสูงสุดที่ผู้ผลิตเครื่องยนต์กำหนด หากไม่มีระบบวัด ให้ยึดคู่มือและรอบบำรุงรักษาของผู้ผลิตเป็นหลัก"
      : "For engine air filters equipped with restriction monitoring, use the gauge or service indicator as the primary input and never exceed the engine maker's maximum limit. Where no monitoring is fitted, follow the manufacturer's manual and service interval.",
    whyTitle: isThai
      ? "ทำไมการดูด้วยตาอย่างเดียวจึงไม่เพียงพอ"
      : "Why visual inspection alone is not enough",
    whyItems: isThai
      ? [
          [
            "ฝุ่นบนผิวกรองไม่ได้แปลว่าหมดอายุทันที",
            "เมื่อฝุ่นสะสมบนสื่อกรอง ประสิทธิภาพการดักจับของไส้กรองอากาศบางชนิดอาจดีขึ้นในช่วงหนึ่ง จนกระทั่งความต้านทานสูงถึงขีดจำกัด",
          ],
          [
            "การเปิด Housing บ่อยมีความเสี่ยง",
            "ทุกครั้งที่ถอดไส้กรองออกตรวจ มีโอกาสให้ฝุ่นเข้าสู่ด้านอากาศสะอาด ซีลวางผิดตำแหน่ง หรือประกอบกลับไม่สนิท",
          ],
          [
            "ชั่วโมงทำงานอย่างเดียวอาจไม่สะท้อนสภาพจริง",
            "เครื่องที่ทำงานในพื้นที่ฝุ่นมากกับเครื่องที่ทำงานในสภาพสะอาดอาจมีอายุไส้กรองต่างกัน แม้ชั่วโมงทำงานเท่ากัน",
          ],
        ]
      : [
          [
            "Visible dust does not automatically mean end of life",
            "As dust builds on some air-filter media, capture efficiency can improve for a period, until restriction reaches the allowable limit.",
          ],
          [
            "Opening the housing introduces risk",
            "Removing an element for inspection can allow contamination into the clean-air side, disturb the seal, or lead to incorrect reinstallation.",
          ],
          [
            "Operating hours alone may not reflect actual loading",
            "Equipment in severe dust can load a filter differently from equipment in a clean environment, even at the same operating hours.",
          ],
        ],
    restrictionTitle: isThai
      ? "ค่าความต้านทานอากาศบอกอะไร?"
      : "What does airflow restriction tell you?",
    restrictionBody: isThai
      ? "เมื่อไส้กรองรับฝุ่นมากขึ้น เครื่องยนต์ต้องออกแรงดูดอากาศผ่านสื่อกรองมากขึ้น ค่าความต้านทานจึงสูงขึ้น สามารถติดตามได้ด้วย Manometer, เกจวัด หรือ Restriction Indicator ทั้งนี้ต้องวัดตามวิธีที่คู่มือกำหนด เพราะค่าขณะเดินเบาอาจไม่เท่ากับค่าขณะรับโหลด"
      : "As the filter loads with dust, the engine must draw air through increasing resistance. This can be monitored with a manometer, gauge, or restriction indicator. Measurements must follow the manual because an idle reading may differ from a full-load reading.",
    decisionTitle: isThai
      ? "ควรใช้ข้อมูลอะไรตัดสินใจเปลี่ยน?"
      : "What should drive the replacement decision?",
    decisionItems: isThai
      ? [
          ["1", "ค่าจาก Service Indicator หรือเกจ", "ตรวจว่าถึงหรือใกล้ขีดจำกัดที่ผู้ผลิตเครื่องยนต์ระบุหรือยัง"],
          ["2", "รอบบำรุงรักษาในคู่มือ", "หากไม่มีระบบวัด ให้ยึดระยะเวลา ชั่วโมง หรือระยะทางตามผู้ผลิต ไม่กำหนดเองจากสีของไส้กรอง"],
          ["3", "สภาพการใช้งาน", "พื้นที่ฝุ่นจัด งานก่อสร้าง เหมือง เกษตร หรือการทำงานต่อเนื่องอาจต้องมีแผนตรวจที่เข้มขึ้น"],
          ["4", "สภาพ Housing และซีล", "ตรวจการรั่ว ท่ออากาศ แคลมป์ ซีล และการติดตั้ง เพราะไส้กรองใหม่ไม่ช่วยหากระบบอากาศรั่ว"],
        ]
      : [
          ["1", "Service indicator or gauge reading", "Confirm whether restriction has reached or is approaching the engine maker's specified limit."],
          ["2", "The manual's service interval", "Without monitoring, follow the manufacturer's time, hour, or mileage interval rather than judging the element by colour."],
          ["3", "Operating conditions", "Heavy dust, construction, mining, agriculture, and continuous duty may require a more rigorous inspection plan."],
          ["4", "Housing and seal condition", "Check for leaks, damaged ducts, clamps, seals, and installation errors. A new element cannot protect an intake system that leaks."],
        ],
    checklistTitle: isThai
      ? "เช็กลิสต์สำหรับทีมซ่อมบำรุง"
      : "Maintenance-team checklist",
    checklist: isThai
      ? [
          "ยืนยัน Part Number และรุ่นเครื่องยนต์ก่อนเตรียมอะไหล่",
          "บันทึกค่าความต้านทานและเงื่อนไขขณะวัดให้เปรียบเทียบได้",
          "ตรวจ Housing ฝาครอบ ซีล ท่อ และแคลมป์ก่อนติดตั้งไส้กรองใหม่",
          "อย่าเคาะ เป่า หรือล้างไส้กรอง หากผู้ผลิตไม่ได้อนุญาตวิธีนั้น",
          "หลังเปลี่ยน ให้รีเซ็ต Indicator และบันทึกวันที่ ชั่วโมงทำงาน หรือระยะทาง",
        ]
      : [
          "Confirm the part number and engine model before preparing the replacement.",
          "Record restriction and the measurement condition so readings are comparable.",
          "Inspect the housing, cover, seals, ducts, and clamps before fitting a new element.",
          "Do not tap, blow out, or wash an element unless that method is approved by its manufacturer.",
          "After replacement, reset the indicator and log the date, operating hours, or mileage.",
        ],
    balanceTitle: isThai
      ? "หลักปฏิบัติที่สมดุล: ไม่เปลี่ยนเร็วเกินไป และไม่ปล่อยช้าเกินกำหนด"
      : "A balanced approach: neither too early nor beyond the limit",
    balanceBody: isThai
      ? "Donaldson แนะนำให้ใช้ค่าความต้านทานแทนการดูด้วยตาเพียงอย่างเดียว ขณะที่ MANN-FILTER ย้ำให้ปฏิบัติตามรอบบำรุงรักษาของผู้ผลิตรถหรือเครื่องจักร เมื่อนำสองแนวทางมารวมกัน ทีมซ่อมบำรุงควรใช้ข้อมูลจากระบบวัดเมื่อมี พร้อมยึดข้อจำกัดและคำแนะนำในคู่มือเป็นเกณฑ์สูงสุดเสมอ"
      : "Donaldson recommends restriction-based servicing rather than appearance alone, while MANN-FILTER emphasizes following the vehicle or equipment maker's service interval. In practice, use monitoring data where available and always treat the manual's limits and instructions as the controlling requirements.",
    scopeNote: isThai
      ? "บทความนี้กล่าวถึงไส้กรองอากาศสำหรับเครื่องยนต์เป็นหลัก ไม่ควรนำเกณฑ์เดียวกันไปใช้กับไส้กรองน้ำมัน เชื้อเพลิง ไฮดรอลิก หรือไส้กรองลมอัดโดยอัตโนมัติ"
      : "This article focuses on engine air filters. Do not automatically apply the same criteria to oil, fuel, hydraulic, or compressed-air filters.",
    sourcesTitle: isThai ? "แหล่งข้อมูลจากผู้ผลิต" : "Manufacturer sources",
    sourcesIntro: isThai
      ? "MRT Supplier เรียบเรียงเนื้อหานี้จากข้อมูลทางเทคนิคของผู้ผลิต ไม่ใช่การแปลบทความต้นฉบับแบบคำต่อคำ"
      : "MRT Supplier prepared this guidance from manufacturer technical information; it is not a word-for-word translation of the source articles.",
    sources: isThai
      ? [
          ["Donaldson — When to Change Your Air Filter", SOURCE_URLS.donaldsonService],
          ["Donaldson — Air Filter Efficiency Explained", SOURCE_URLS.donaldsonEfficiency],
          ["MANN-FILTER — Easy servicing thanks to innovative air filter", SOURCE_URLS.mannService],
        ]
      : [
          ["Donaldson — When to Change Your Air Filter", SOURCE_URLS.donaldsonService],
          ["Donaldson — Air Filter Efficiency Explained", SOURCE_URLS.donaldsonEfficiency],
          ["MANN-FILTER — Easy servicing thanks to innovative air filter", SOURCE_URLS.mannService],
        ],
    ctaTitle: isThai
      ? "ต้องเตรียมไส้กรองอากาศสำหรับรอบบำรุงรักษาครั้งถัดไป?"
      : "Preparing engine air filters for the next maintenance cycle?",
    ctaBody: isThai
      ? "ส่ง Part Number รุ่นเครื่อง หรือรูปฉลากเดิมให้ MRT Supplier ช่วยตรวจสอบรายการและจัดทำใบเสนอราคา"
      : "Send the existing part number, engine model, or label photo to MRT Supplier for part review and quotation.",
    ctaButton: isThai ? "ส่ง RFQ ให้ทีมงานตรวจสอบ" : "Send an RFQ for review",
    searchButton: isThai ? "ค้นหาสินค้า" : "Search products",
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";
  const path = `/${locale}/articles/${SLUG}`;

  return {
    title: isThai
      ? "ควรเปลี่ยนไส้กรองอากาศเมื่อไร? ดูค่าความต้านทานให้ถูก"
      : "When to Replace an Engine Air Filter",
    description: isThai
      ? "ไส้กรองอากาศที่ดูสกปรกอาจยังไม่ถึงเวลาเปลี่ยน เรียนรู้การใช้ค่าความต้านทาน รอบบำรุงรักษา และสภาพการใช้งานเพื่อลดความเสี่ยง"
      : "Learn how restriction readings, manufacturer service intervals, and operating conditions help determine when to replace an engine air filter.",
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        th: `${SITE_URL}/th/articles/${SLUG}`,
        en: `${SITE_URL}/en/articles/${SLUG}`,
        "x-default": `${SITE_URL}/th/articles/${SLUG}`,
      },
    },
    openGraph: {
      type: "article",
      title: isThai
        ? "ควรเปลี่ยนไส้กรองอากาศเมื่อไร? อย่าดูจากความสกปรกเพียงอย่างเดียว"
        : "When should an engine air filter be replaced?",
      description: isThai
        ? "ใช้ค่าความต้านทาน ข้อกำหนดผู้ผลิต และสภาพการใช้งานประกอบการตัดสินใจ"
        : "Use restriction, manufacturer requirements, and operating conditions to make the decision.",
      url: `${SITE_URL}${path}`,
      publishedTime: PUBLISHED_DATE,
      siteName: "MRT Supplier",
    },
  };
}

export default async function WhenToReplaceEngineAirFilterPage({ params }: PageProps) {
  const { locale } = await params;
  const text = getCopy(locale);
  const path = `/${locale}/articles/${SLUG}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title,
    description: text.intro,
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: { "@type": "Organization", name: "MRT Supplier Co., Ltd." },
    publisher: {
      "@type": "Organization",
      name: "MRT Supplier Co., Ltd.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-mrt-a.png` },
    },
    citation: text.sources.map(([, url]) => url),
  };

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <JsonLd data={articleJsonLd} />
      <SiteHeader locale={locale} />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="border-b border-[var(--color-border)] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            {text.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl lg:text-5xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">
            {text.intro}
          </p>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">{text.published}</p>
        </header>

        <section className="my-8 rounded-[var(--mrt-radius-lg)] border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <Gauge className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">{text.answerTitle}</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {text.answerBody}
          </p>
        </section>

        <section className="py-7">
          <div className="flex items-center gap-3">
            <EyeOff className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">{text.whyTitle}</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {text.whyItems.map(([title, body]) => (
              <section
                key={title}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="py-7">
          <h2 className="text-2xl font-semibold">{text.restrictionTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {text.restrictionBody}
          </p>
        </section>

        <section className="py-7">
          <h2 className="text-2xl font-semibold">{text.decisionTitle}</h2>
          <div className="mt-5 space-y-3">
            {text.decisionItems.map(([number, title, body]) => (
              <div
                key={number}
                className="grid gap-3 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-[2.5rem_1fr]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
                  {number}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-7 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">{text.checklistTitle}</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {text.checklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 py-7">
          <h2 className="text-2xl font-semibold">{text.balanceTitle}</h2>
          <p className="text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {text.balanceBody}
          </p>
          <p className="flex gap-3 rounded-[var(--mrt-radius-md)] border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{text.scopeNote}</span>
          </p>
        </section>

        <section className="my-7 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 sm:p-7">
          <h2 className="text-xl font-semibold">{text.sourcesTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{text.sourcesIntro}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {text.sources.map(([label, url]) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-4 hover:decoration-[var(--color-primary)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[var(--mrt-radius-lg)] bg-[var(--color-primary)] p-6 text-[var(--color-text-inverse)] sm:p-8">
          <h2 className="text-2xl font-semibold">{text.ctaTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 opacity-90">{text.ctaBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {text.ctaButton}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
            >
              {text.searchButton}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
