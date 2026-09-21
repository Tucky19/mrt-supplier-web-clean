import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldAlert } from "lucide-react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.mrtsupplier.com";
const PUBLISHED_DATE = "2026-09-21";

type PageProps = { params: Promise<{ locale: string }> };

function getCopy(locale: string) {
  const isThai = locale === "th";

  return {
    category: isThai ? "ความรู้ด้านไส้กรองอุตสาหกรรม" : "Industrial filtration knowledge",
    title: isThai
      ? "เลือกไส้กรองอุตสาหกรรมผิด โรงงานอาจเสียมากกว่าค่าไส้กรอง"
      : "The wrong industrial filter can cost far more than the filter itself",
    intro: isThai
      ? "ไส้กรองเป็นชิ้นส่วนขนาดเล็กเมื่อเทียบกับเครื่องจักรทั้งระบบ แต่หากเลือกไม่ตรงรุ่นหรือไม่เหมาะกับสภาวะการทำงาน อาจทำให้ประสิทธิภาพลดลง เพิ่มภาระการบำรุงรักษา และเสี่ยงต่อการหยุดเครื่องโดยไม่คาดคิด"
      : "A filter may be a small part of an industrial system, but an incorrect match can reduce performance, increase maintenance workload, and raise the risk of unplanned downtime.",
    published: isThai ? "เผยแพร่ 21 กันยายน 2569" : "Published 21 September 2026",
    risksTitle: isThai ? "ความเสี่ยงเมื่อเลือกไส้กรองไม่ตรงสเปก" : "Risks of using an incorrectly specified filter",
    risks: isThai
      ? [
          ["ประสิทธิภาพการกรองไม่เหมาะสม", "ไส้กรองที่ไม่ตรงกับความต้องการของระบบอาจปล่อยให้สิ่งปนเปื้อนผ่าน หรือสร้างความต้านทานการไหลมากเกินไป ทำให้เครื่องจักรทำงานหนักขึ้น"],
          ["ขนาดเหมือนกัน แต่รายละเอียดภายในต่างกัน", "รูปร่างภายนอกที่ใกล้เคียงกันไม่ได้ยืนยันว่าใช้แทนกันได้ เพราะวัสดุกรอง เกลียว ซีล วาล์วภายใน และค่าการทำงานอาจแตกต่างกัน"],
          ["ประสิทธิภาพระบบลดลง", "อัตราการไหลที่ลดลง ความดันตกคร่อมที่สูงขึ้น หรืออุณหภูมิผิดปกติ อาจเป็นสัญญาณว่าระบบกรองไม่เหมาะสมหรือเริ่มอุดตัน"],
          ["เพิ่มความเสี่ยงต่อ Downtime", "สิ่งปนเปื้อนหรือการไหลที่ผิดปกติอาจเร่งการสึกหรอของชิ้นส่วนสำคัญ และนำไปสู่ค่าซ่อม ค่าแรง และเวลาผลิตที่สูญเสียไป"],
        ]
      : [
          ["Unsuitable filtration performance", "An incorrect filter may allow contaminants through or create excessive flow restriction, increasing the workload on the system."],
          ["Similar dimensions do not mean identical specifications", "External dimensions alone do not confirm interchangeability. Media, threads, seals, internal valves, and operating ratings can differ."],
          ["Reduced system performance", "Lower flow, increased differential pressure, or abnormal temperature can indicate an unsuitable or restricted filter."],
          ["Higher downtime risk", "Contamination or incorrect flow conditions may accelerate component wear and lead to repair cost and lost production time."],
        ],
    checklistTitle: isThai ? "ก่อนสั่งซื้อ ควรตรวจสอบอะไรบ้าง?" : "What should be checked before ordering?",
    checklist: isThai
      ? ["Part Number ของไส้กรองเดิม", "ยี่ห้อและรุ่นเครื่องจักรหรือเครื่องยนต์", "ประเภทงานกรอง เช่น อากาศ เชื้อเพลิง น้ำมันหล่อลื่น หรือไฮดรอลิก", "ขนาด เกลียว ซีล และรูปแบบการติดตั้ง", "สภาพแวดล้อมและเงื่อนไขการใช้งาน", "รูปฉลาก รูปสินค้าเดิม หรือคู่มือประจำเครื่อง"]
      : ["The original filter part number", "Machine or engine brand and model", "Application, such as air, fuel, lube, or hydraulic filtration", "Dimensions, thread, seal, and installation format", "Operating conditions and environment", "Label photos, the original filter, or the machine manual"],
    crossTitle: isThai ? "เบอร์เทียบเป็นจุดเริ่มต้น ไม่ใช่คำยืนยันสุดท้าย" : "A cross reference is a starting point, not final confirmation",
    crossBody: isThai
      ? "การค้นจาก Cross-reference ช่วยคัดกรองตัวเลือกได้เร็วขึ้น แต่ก่อนใช้งานจริงควรตรวจสอบสเปกและเงื่อนไขของเครื่องแต่ละรุ่น หากหลักฐานยังไม่ครบ ควรระบุว่าอยู่ระหว่างตรวจสอบ แทนการยืนยันว่าใช้ทดแทนกันได้โดยสมบูรณ์"
      : "Cross-reference data can narrow the search, but specifications and application conditions still need to be checked. Where evidence is incomplete, the match should remain under review rather than being presented as fully interchangeable.",
    decisionTitle: isThai ? "ลดความเสี่ยงก่อนออกใบสั่งซื้อ" : "Reduce risk before issuing a purchase order",
    decisionBody: isThai
      ? "การเลือกไส้กรองควรพิจารณาความเข้ากันได้กับระบบ ความน่าเชื่อถือของข้อมูล และผลกระทบต่อต้นทุนตลอดอายุการใช้งาน ไม่ใช่ดูเฉพาะราคาต่อชิ้น"
      : "Filter selection should consider system compatibility, evidence quality, and lifecycle cost—not only unit price.",
    ctaTitle: isThai ? "มี Part Number หรือรูปไส้กรองเดิมอยู่แล้ว?" : "Already have a part number or a photo of the existing filter?",
    ctaBody: isThai ? "ส่งข้อมูลให้ MRT Supplier ช่วยตรวจสอบรุ่น ตัวเลือกเบอร์เทียบ และจัดทำใบเสนอราคา" : "Send the details to MRT Supplier for part review, cross-reference checking, and quotation.",
    ctaButton: isThai ? "ส่ง RFQ ให้ทีมงานตรวจสอบ" : "Send an RFQ for review",
    searchButton: isThai ? "ค้นหาสินค้า" : "Search products",
    disclaimer: isThai ? "หมายเหตุ: ความเหมาะสมของไส้กรองและการใช้ทดแทนต้องยืนยันจากสเปกของผู้ผลิต รุ่นเครื่อง และสภาพการใช้งานจริง" : "Note: Filter suitability and interchangeability must be confirmed against manufacturer specifications, the machine model, and actual operating conditions.",
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";
  const path = `/${locale}/articles/industrial-filter-selection-guide`;

  return {
    title: isThai ? "เลือกไส้กรองอุตสาหกรรมผิด เสี่ยงเครื่องจักรเสีย | MRT Supplier" : "Industrial Filter Selection Guide | MRT Supplier",
    description: isThai ? "การเลือกไส้กรองอุตสาหกรรมผิดรุ่นอาจทำให้ระบบทำงานผิดปกติ เครื่องจักรสึกหรอ และเกิด Downtime ตรวจสอบสิ่งสำคัญก่อนสั่งซื้อ" : "Learn what to verify before ordering an industrial filter to reduce wear, performance loss, and unplanned downtime.",
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: { th: `${SITE_URL}/th/articles/industrial-filter-selection-guide`, en: `${SITE_URL}/en/articles/industrial-filter-selection-guide`, "x-default": `${SITE_URL}/th/articles/industrial-filter-selection-guide` },
    },
    openGraph: {
      type: "article",
      title: isThai ? "เลือกไส้กรองอุตสาหกรรมผิด โรงงานอาจเสียมากกว่าค่าไส้กรอง" : "The wrong industrial filter can cost far more than the filter itself",
      description: isThai ? "ตรวจสอบ Part Number รุ่นเครื่อง และสเปกสำคัญก่อนสั่งซื้อ เพื่อลดความเสี่ยงต่อเครื่องจักรและ Downtime" : "Check the part number, machine model, and key specifications before ordering.",
      url: `${SITE_URL}${path}`,
      publishedTime: PUBLISHED_DATE,
      siteName: "MRT Supplier",
    },
  };
}

export default async function IndustrialFilterSelectionGuidePage({ params }: PageProps) {
  const { locale } = await params;
  const text = getCopy(locale);
  const path = `/${locale}/articles/industrial-filter-selection-guide`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title,
    description: text.intro,
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: { "@type": "Organization", name: "MRT Supplier Co., Ltd." },
    publisher: { "@type": "Organization", name: "MRT Supplier Co., Ltd.", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-mrt-a.png` } },
  };

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <JsonLd data={articleJsonLd} />
      <SiteHeader locale={locale} />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="border-b border-[var(--color-border)] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">{text.category}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl lg:text-5xl">{text.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">{text.intro}</p>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">{text.published}</p>
        </header>

        <section className="py-9">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">{text.risksTitle}</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {text.risks.map(([title, body], index) => (
              <section key={title} className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                <p className="text-sm font-semibold text-[var(--color-primary)]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7">
          <h2 className="text-2xl font-semibold">{text.checklistTitle}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {text.checklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-7 py-9">
          <div><h2 className="text-2xl font-semibold">{text.crossTitle}</h2><p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">{text.crossBody}</p></div>
          <div><h2 className="text-2xl font-semibold">{text.decisionTitle}</h2><p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">{text.decisionBody}</p></div>
        </section>

        <section className="rounded-[var(--mrt-radius-lg)] bg-[var(--color-primary)] p-6 text-[var(--color-text-inverse)] sm:p-8">
          <h2 className="text-2xl font-semibold">{text.ctaTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 opacity-90">{text.ctaBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/quote`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"><FileText className="h-4 w-4" aria-hidden="true" />{text.ctaButton}</Link>
            <Link href={`/${locale}/products`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]">{text.searchButton}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <p className="mt-6 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">{text.disclaimer}</p>
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
