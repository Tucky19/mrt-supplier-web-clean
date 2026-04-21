import Link from "next/link";

import AddToQuoteButton from "@/components/quote/AddToQuoteButton";

type ProductHeroProps = {
  locale: string;
  brand: string;
  categoryLabel?: string | null;
  stockLabel?: string | null;
  stockClassName?: string;
  title: string;
  partNo?: string;
  summaryText?: string;
  officialUrl?: string;
  quoteHref: string;
  product: {
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
  };
};

export default function ProductHero({
  locale,
  brand,
  categoryLabel,
  stockLabel,
  stockClassName,
  title,
  partNo,
  summaryText,
  officialUrl,
  quoteHref,
  product,
}: ProductHeroProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
          {brand}
        </span>

        {categoryLabel ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600">
            {categoryLabel}
          </span>
        ) : null}

        {stockLabel ? (
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-medium ${stockClassName ?? ""}`}
          >
            {stockLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {locale === "th" ? "Part Number" : "Part Number"}
        </p>
        <p className="mt-1 break-all text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {partNo || title}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          {locale === "th" ? "Product" : "Product"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
          {title}
        </h1>
      </div>

      {summaryText ? (
        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 lg:text-base">
          {summaryText}
        </p>
      ) : null}

      <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">
          {locale === "th"
            ? "ยืนยันรุ่นสินค้าแล้ว เพิ่มลงในใบขอราคาเพื่อส่ง RFQ ได้ทันที"
            : "Confirmed the part? Add it to your quote list and send an RFQ."}
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <AddToQuoteButton product={product} />

          <Link
            href={quoteHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {locale === "th" ? "ดูใบขอราคา" : "View Quote"}
          </Link>

          {officialUrl ? (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              {locale === "th" ? "Official Reference" : "Official Reference"}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
