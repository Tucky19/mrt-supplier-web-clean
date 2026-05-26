import Link from "next/link";
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
    email: isThai ? "อีเมล" : "Email",
    line: isThai ? "LINE Official" : "LINE Official",
    website: isThai ? "เว็บไซต์" : "Website",
    address: isThai ? "ที่อยู่บริษัท" : "Company Address",
    businessHours: isThai ? "เวลาทำการ" : "Business Hours",
    businessHoursBody: isThai
      ? "จันทร์-ศุกร์ 08:30-17:30"
      : "Monday-Friday, 08:30-17:30",
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
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = getCopy(locale);
  const address = locale === "th" ? contactDetails.addressTh : contactDetails.addressEn;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
            {text.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
            {text.title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            {text.intro}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {text.contactMethods}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {text.contactMethodsBody}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {text.phone}
                </div>
                <div className="mt-3 space-y-2">
                  <a
                    href="tel:0970122111"
                    className="block text-base font-semibold text-slate-950 hover:text-sky-700"
                  >
                    {contactDetails.phonePrimary}
                  </a>
                  <a
                    href="tel:0815581323"
                    className="block text-base font-semibold text-slate-950 hover:text-sky-700"
                  >
                    {contactDetails.phoneSecondary}
                  </a>
                </div>
              </div>

              <a
                href={`mailto:${contactDetails.email}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {text.email}
                </div>
                <p className="mt-3 break-all text-base font-semibold text-slate-950">
                  {contactDetails.email}
                </p>
              </a>

              <TrackedLineLink
                href={LINE_URL}
                source="contact_page_card"
                locale={locale}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {text.line}
                </div>
                <p className="mt-3 text-base font-semibold text-emerald-900">
                  {contactDetails.lineId}
                </p>
              </TrackedLineLink>

              <a
                href={contactDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <Globe2 className="h-4 w-4" aria-hidden="true" />
                  {text.website}
                </div>
                <p className="mt-3 break-all text-base font-semibold text-slate-950">
                  mrtsupplier.com
                </p>
              </a>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {text.address}
              </div>
              <p className="mt-3 font-semibold text-slate-950">
                {contactDetails.company}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                {address}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {text.businessHours}
              </div>
              <p className="mt-3 text-base font-semibold text-slate-950">
                {text.businessHoursBody}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {text.businessHoursNote}
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                {text.rfqTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {text.rfqBody}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={`/${locale}/quote`}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {text.requestQuote}
                </Link>

                <TrackedLineLink
                  href={LINE_URL}
                  source="contact_page_cta"
                  locale={locale}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {text.addOnLine}
                </TrackedLineLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-950">
                  {text.mapTitle}
                </h2>
              </div>
              <iframe
                title={text.mapTitle}
                src="https://www.google.com/maps?q=15+Borommaratchachonnani+39,+Taling+Chan,+Bangkok+10170&output=embed"
                className="h-[320px] w-full border-0 lg:h-[430px]"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
