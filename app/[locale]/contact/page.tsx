import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getContactUiText } from "@/lib/i18n/contactUi";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = getContactUiText(locale);
  const isThai = locale === "th";
  const supportNote = isThai
    ? "ส่งรูปสินค้า รุ่นเครื่องจักร Part Number หรือ Cross Reference เพิ่มเติมได้ผ่าน RFQ หรือ LINE"
    : text.supportNote;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {text.contact}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {text.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-600">{text.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {text.contactMethods}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {text.contactMethodsBody}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {text.phone}
                </p>
                <div className="mt-2 space-y-1.5">
                  <a
                    href="tel:0970122111"
                    className="block text-base font-semibold text-slate-900 transition hover:text-slate-700"
                  >
                    097 012 2111
                  </a>
                  <a
                    href="tel:0815581323"
                    className="block text-base font-semibold text-slate-900 transition hover:text-slate-700"
                  >
                    081 558 1323
                  </a>
                </div>
              </div>

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

              <TrackedLineLink
                href="https://lin.ee/R3vfZW0"
                source="contact_page_card"
                locale={locale}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  LINE
                </p>
                <p className="mt-2 text-base font-semibold text-emerald-800">
                  @mrt-supplier
                </p>
              </TrackedLineLink>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {text.address}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                  {text.addressBody}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {text.businessHours}
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {text.businessHoursBody}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {text.businessHoursNote}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700">
              {supportNote}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`/${locale}/quote`}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {text.requestQuote}
              </a>

              <TrackedLineLink
                href="https://lin.ee/R3vfZW0"
                source="contact_page_cta"
                locale={locale}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-600 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                {text.addOnLine}
              </TrackedLineLink>
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
