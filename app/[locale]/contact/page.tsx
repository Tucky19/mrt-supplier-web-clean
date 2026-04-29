import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isThai = locale === "th";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {isThai ? "ติดต่อ" : "Contact"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {isThai ? "ติดต่อ MRT Supplier" : "Contact MRT Supplier"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            {isThai
              ? "ส่ง Part Number, cross reference หรือรายการสินค้าที่ต้องการ แล้วทีมงานจะช่วยตรวจสอบและเสนอราคาให้เร็วที่สุด"
              : "Send your part number, cross reference, or product list and our team will review and quote quickly."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isThai ? "ช่องทางติดต่อ" : "Contact Methods"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {isThai
                  ? "เลือกช่องทางที่สะดวกที่สุด หรือส่ง RFQ ให้ทีมงานติดตามกลับ"
                  : "Choose the most convenient channel, or submit an RFQ and our team will follow up."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="tel:+66815581323"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isThai ? "โทร" : "Phone"}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  +66 81-558-1323
                </p>
              </a>

              <a
                href="mailto:sales@mrtsupplier.com"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  sales@mrtsupplier.com
                </p>
              </a>

              <a
                href="https://lin.ee/R3vfZW0"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  LINE
                </p>
                <p className="mt-2 text-base font-semibold text-emerald-800">
                  @mrt-supplier
                </p>
              </a>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isThai ? "ที่อยู่" : "Address"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด
                  <br />
                  15 ชั้น 2 ซอยบรมราชชนนี 39
                  <br />
                  แขวงตลิ่งชัน เขตตลิ่งชัน
                  <br />
                  กรุงเทพมหานคร 10170
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700">
              {isThai
                ? "หากมีรูปสินค้า รุ่นเครื่องจักร หรือหมายเลข cross reference สามารถแนบเพิ่มใน RFQ หรือส่งต่อทาง LINE ได้"
                : "If you have product photos, machine model details, or cross references, include them in the RFQ or send them on LINE."}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`/${locale}/quote`}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
              </a>

              <a
                href="https://lin.ee/R3vfZW0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-500 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {isThai ? "เพิ่มเพื่อน LINE" : "Add on LINE"}
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=15+Borommaratchachonnani+39,+Taling+Chan,+Bangkok+10170&output=embed"
              className="h-[320px] w-full border-0 lg:h-full"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
