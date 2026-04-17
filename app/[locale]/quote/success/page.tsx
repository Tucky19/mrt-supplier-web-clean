import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ rid?: string }>;
};

export default async function QuoteSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { rid = "" } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {locale === "th" ? "ส่งคำขอสำเร็จ" : "Request Submitted"}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {locale === "th"
              ? "เราได้รับคำขอของคุณเรียบร้อยแล้ว"
              : "Your quote request has been received"}
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-600">
            {locale === "th"
              ? "ทีมงานจะตรวจสอบรายการและติดต่อกลับโดยเร็ว หากต้องการส่งรายละเอียดเพิ่มเติม สามารถติดต่อผ่าน LINE หรืออีเมลได้"
              : "Our team will review your request and get back to you soon. If you want to send more details, you can contact us via LINE or email."}
          </p>

          {rid ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-medium text-slate-900">
                {locale === "th" ? "เลขอ้างอิง:" : "Reference:"}
              </span>{" "}
              {rid}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/products`}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {locale === "th" ? "ค้นหาสินค้าต่อ" : "Search More Products"}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {locale === "th" ? "ติดต่อทีมงาน" : "Contact Our Team"}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}