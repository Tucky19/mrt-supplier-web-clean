import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ rid?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai
      ? "ส่งคำขอเรียบร้อย | MRT Supplier"
      : "Request Submitted | MRT Supplier",
    description: isThai
      ? "เราได้รับคำขอใบเสนอราคาของคุณแล้ว ทีมงาน MRT Supplier จะตรวจสอบและติดต่อกลับโดยเร็ว"
      : "Your quotation request has been received. MRT Supplier will review and respond shortly.",
  };
}

export default async function QuoteSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { rid = "" } = await searchParams;
  const isThai = locale === "th";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {isThai ? "ส่งคำขอสำเร็จ" : "Request Submitted"}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {isThai
              ? "เราได้รับคำขอของคุณเรียบร้อยแล้ว"
              : "Your quote request has been received"}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {isThai
              ? "ทีมงานจะตรวจสอบรายการสินค้าและติดต่อกลับโดยเร็ว โดยปกติจะตอบกลับภายใน 24 ชั่วโมงทำการ"
              : "Our team will review your items and respond as soon as possible, typically within 24 business hours."}
          </p>

          {rid ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isThai ? "เลขอ้างอิง RFQ" : "RFQ Reference"}
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-950">
                {rid}
              </p>
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-7 text-slate-700">
            {isThai
              ? "หากมีรูปสินค้า รายการเพิ่มเติม หรือ Cross Reference สามารถส่งต่อทาง LINE หรือ Email ได้ทันที พร้อมแจ้งเลขอ้างอิงด้านบน"
              : "If you have product photos, additional items, or cross references, send them via LINE or email and include the RFQ reference above."}
          </div>

          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? "ขั้นตอนถัดไป" : "Next Steps"}
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {isThai ? "1. เก็บเลขอ้างอิงไว้" : "1. Keep Your RFQ Reference"}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isThai
                    ? "ใช้เลขอ้างอิงนี้เมื่อติดตามกลับทาง LINE หรือ Email เพื่อให้ทีมงานตรวจสอบได้เร็วขึ้น"
                    : "Use this reference when following up by LINE or email so our team can review faster."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {isThai ? "2. ส่งข้อมูลเพิ่มเติมได้" : "2. Send More Details"}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isThai
                    ? "หากมีรูปสินค้า ชื่อเครื่องจักร หรือ Cross Reference เพิ่ม สามารถส่งเพิ่มได้ทันที"
                    : "If you have product photos, machine model names, or more cross references, send them anytime."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {isThai ? "3. ค้นหาสินค้าต่อ" : "3. Continue Searching"}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isThai
                    ? "หากยังมี Part Number อื่นที่ต้องการ สามารถกลับไปค้นหาและส่ง RFQ เพิ่มได้"
                    : "If you still have more part numbers to check, go back to products and continue searching."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              {isThai ? "กลับหน้าแรก" : "Back to Home"}
            </Link>

            <Link
              href={`/${locale}/products`}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              {isThai ? "กลับไปค้นหาสินค้า" : "Back to Products"}
            </Link>

            <a
              href="https://lin.ee/R3vfZW0"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              {isThai ? "ส่งรายละเอียดทาง LINE" : "Send Details on LINE"}
            </a>

            <a
              href="mailto:sales@mrtsupplier.com"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              sales@mrtsupplier.com
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
