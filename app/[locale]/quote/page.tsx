import { getTranslations } from "next-intl/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import QuoteFormClient from "@/components/quote/QuoteFormClient";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function QuotePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rfq" });

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              MRT Supplier
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <QuoteFormClient locale={locale} />

      <SiteFooter />
    </main>
  );
}