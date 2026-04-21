import Link from "next/link";

import AddToQuoteButton from "@/components/quote/AddToQuoteButton";

type ProductRfqCTAProps = {
  locale: string;
  quoteHref: string;
  product: {
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
  };
};

export default function ProductRfqCTA({
  locale,
  quoteHref,
  product,
}: ProductRfqCTAProps) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {locale === "th" ? "RFQ" : "RFQ"}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {locale === "th"
              ? "ต้องการราคา หรือให้ทีมช่วยตรวจสอบรุ่น?"
              : "Need pricing or compatibility confirmation?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {locale === "th"
              ? "เพิ่มรายการนี้ลงในใบขอราคา แล้วส่ง RFQ เพื่อให้ทีมงานช่วยตรวจสอบและติดต่อกลับ"
              : "Add this item to your quote list and send an RFQ for team follow-up."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <AddToQuoteButton product={product} />
          <Link
            href={quoteHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {locale === "th" ? "ไปที่ใบขอราคา" : "Go to Quote"}
          </Link>
        </div>
      </div>
    </section>
  );
}
