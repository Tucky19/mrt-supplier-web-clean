import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import QuoteFormClient from "@/components/quote/QuoteFormClient";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function QuotePage({ params }: PageProps) {
  const { locale } = await params;
  const isThai = locale === "th";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              MRT Supplier
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {isThai ? "ใบขอราคา (RFQ)" : "Request for Quotation (RFQ)"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {isThai
                ? "ตรวจสอบรายการและกรอกข้อมูลเพื่อติดต่อกลับ ส่งได้ทั้ง Part Number, Cross Reference และ product list ในคำขอเดียว"
                : "Review your items and leave contact details so our team can reply with quotation support."}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              {isThai
                ? "กรอกชื่อผู้ติดต่อและช่องทางติดต่ออย่างน้อย 1 อย่าง แล้วทีมงานจะติดต่อกลับเพื่อเช็กรายการและเสนอราคา"
                : "Add your contact name plus one contact method, then our team will follow up to confirm items and prepare a quotation."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                isThai ? "ตอบกลับเร็ว" : "Fast response",
                "Part Number / Cross Reference",
                isThai ? "ส่ง product list ได้" : "Product list supported",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                isThai ? "1. เช็กรายการ" : "1. Review items",
                "2. Add Contact",
                isThai ? "3. ส่ง Quote request" : "3. Send Quote request",
              ].map((step) => (
                <span
                  key={step}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteFormClient locale={locale} />

      <SiteFooter />
    </main>
  );
}
