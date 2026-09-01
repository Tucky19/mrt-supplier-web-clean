import Link from "next/link";
import type { Metadata } from "next";
import {
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

const LINE_URL = "https://lin.ee/S676yYH";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai ? "ติดต่อและส่ง RFQ" : "Contact and Send an RFQ",
    description: isThai
      ? "ติดต่อ MRT Supplier หรือส่ง RFQ สำหรับไส้กรอง ตลับลูกปืน และอะไหล่อุตสาหกรรม พร้อมข้อมูล Part Number หรือรุ่นเครื่องจักร"
      : "Contact MRT Supplier or send an RFQ for industrial filters, bearings, and spare parts using a part number or machine model.",
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        th: "/th/contact",
        en: "/en/contact",
        "x-default": "/th/contact",
      },
    },
  };
}

const contactDetails = {
  company: "MRT Supplier Co., Ltd.",
  email: "sales@mrtsupplier.com",
  phonePrimary: "097 012 2111",
  phoneSecondary: "081 558 1323",
  lineId: "@mrtsupplier",
  website: "https://mrtsupplier.com",
  addressEn:
    "15, 2nd Floor, Soi Borommaratchachonnani 39,\nBorommaratchachonnani Road,\nTaling Chan, Taling Chan District,\nBangkok 10170",
  addressTh:
    "15 ชั้น 2 ซอยบรมราชชนนี 39\nถนนบรมราชชนนี\nแขวงตลิ่งชัน เขตตลิ่งชัน\nกรุงเทพฯ 10170",
};

function getCopy(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: isThai ? "ติดต่อ MRT Supplier" : "Contact MRT Supplier",
    title: isThai
      ? "ส่ง RFQ หรือสอบถามข้อมูลสินค้าอุตสาหกรรม"
      : "Send an RFQ or contact our sourcing team",
    intro: isThai
      ? "ส่ง Part Number, Cross Reference, รูปสินค้า หรือรายการอะไหล่ที่ต้องการ ทีมงานจะช่วยตรวจสอบและติดต่อกลับด้วยข้อมูลที่ชัดเจน"
      : "Share part numbers, cross references, product photos, or a sourcing list. Our team will review the details and follow up clearly.",
    contactMethods: isThai ? "ช่องทางติดต่อ" : "Contact Details",
    contactMethodsBody: isThai
      ? "เลือกช่องทางที่สะดวก หรือส่ง RFQ เพื่อให้ทีมงานตรวจสอบรายการสินค้าและติดต่อกลับ"
      : "Choose the channel that works best, or send an RFQ for product review and follow-up.",
    phone: isThai ? "โทรศัพท์" : "Phone",
    salesPhone: isThai ? "ฝ่ายขาย" : "Sales",
    email: isThai ? "อีเมล" : "Email",
    line: isThai ? "LINE Official" : "LINE Official",
    website: isThai ? "เว็บไซต์" : "Website",
    address: isThai ? "ที่อยู่บริษัท" : "Company Address",
    businessHours: isThai ? "เวลาทำการ" : "Business Hours",
    businessHoursBody: isThai
      ? "จันทร์-ศุกร์ 09:30-17:30 • เสาร์ 10:30-15:30 • อาทิตย์ปิด"
      : "Monday-Friday, 09:30-17:30 • Saturday, 10:30-15:30 • Sunday closed",
    businessHoursNote: isThai
      ? "RFQ และข้อความ LINE จะได้รับการตรวจสอบในช่วงเวลาทำการ"
      : "RFQs and LINE inquiries are reviewed during business hours.",
    rfqTitle: isThai ? "ต้องการใบเสนอราคา?" : "Need a quotation?",
    rfqBody: isThai
      ? "แนบ Part Number, จำนวน, รุ่นเครื่องจักร หรือรูปสินค้า เพื่อให้ทีมงานตรวจสอบได้เร็วขึ้น"
      : "Include part numbers, quantities, machine model, or product photos so our team can check faster.",
    requestQuote: isThai ? "ส่ง RFQ" : "Send RFQ",
    addOnLine: isThai ? "เพิ่มเพื่อน LINE" : "Add LINE Friend",
    mapTitle: isThai ? "แผนที่ MRT Supplier" : "MRT Supplier Location",
    openMaps: isThai ? "เปิดใน Google Maps" : "Open in Google Maps",
  };
}

export default async function ContactPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const text = getCopy(locale);
  const address = locale === "th" ? contactDetails.addressTh : contactDetails.addressEn;

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
            {text.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
            {text.title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {text.intro}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {text.contactMethods}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  {text.contactMethodsBody}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {text.phone}
                </div>
                <div className="mt-3 space-y-2">
                  <a
                    href="tel:0970122111"
                    className="flex min-h-11 items-center text-base font-semibold text-[var(--color-text)] transition hover:text-[var(--color-primary)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                  >
                    {contactDetails.phonePrimary}
                  </a>
                  <a
                    href="tel:0815581323"
                    className="flex min-h-11 items-center text-base font-semibold text-[var(--color-text)] transition hover:text-[var(--color-primary)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                  >
                    {text.salesPhone}: {contactDetails.phoneSecondary}
                  </a>
                </div>
              </div>

              <a
                href={`mailto:${contactDetails.email}`}
                className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {text.email}
                </div>
                <p className="mt-3 break-all text-base font-semibold text-[var(--color-text)]">
                  {contactDetails.email}
                </p>
              </a>

              <TrackedLineLink
                href={LINE_URL}
                source="contact_page_card"
                locale={locale}
                className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-success-soft)] p-4 transition hover:border-[var(--color-success-text)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-success-text)]">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {text.line}
                </div>
                <p className="mt-3 text-base font-semibold text-[var(--color-success-text)]">
                  {contactDetails.lineId}
                </p>
              </TrackedLineLink>

              <a
                href={contactDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  <Globe2 className="h-4 w-4" aria-hidden="true" />
                  {text.website}
                </div>
                <p className="mt-3 break-all text-base font-semibold text-[var(--color-text)]">
                  {contactDetails.website}
                </p>
              </a>
            </div>

            <div className="mt-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {text.address}
              </div>
              <p className="mt-3 font-semibold text-[var(--color-text)]">
                {contactDetails.company}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--color-text-muted)]">
                {address}
              </p>
            </div>

            <div className="mt-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {text.businessHours}
              </div>
              <p className="mt-3 text-base font-semibold text-[var(--color-text)]">
                {text.businessHoursBody}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {text.businessHoursNote}
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {text.rfqTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                {text.rfqBody}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={`/${locale}/quote`}
                  className="inline-flex min-h-12 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  {text.requestQuote}
                </Link>

                <TrackedLineLink
                  href={LINE_URL}
                  source="contact_page_cta"
                  locale={locale}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-success-text)] bg-[var(--color-success-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-success-text)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-surface)] focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {text.addOnLine}
                </TrackedLineLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              <div className="border-b border-[var(--color-border)] px-5 py-4">
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {text.mapTitle}
                </h2>
              </div>
              <iframe
                title={text.mapTitle}
                src="https://www.google.com/maps?q=15+Borommaratchachonnani+39,+Taling+Chan,+Bangkok+10170&output=embed"
                className="h-[320px] w-full border-0 lg:h-[430px]"
                loading="lazy"
              />
              <div className="border-t border-[var(--color-border)] px-5 py-4">
                <a
                  href="https://www.google.com/maps?q=15+Borommaratchachonnani+39,+Taling+Chan,+Bangkok+10170"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] sm:w-auto focus-visible:[outline:2px_solid_var(--color-focus-ring)] focus-visible:[outline-offset:2px] focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  {text.openMaps}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
