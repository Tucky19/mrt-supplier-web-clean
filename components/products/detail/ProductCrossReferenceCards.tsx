import Link from "next/link";

type Props = {
  locale: string;
  refs: string[];
  brand: string;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </div>
  );
}

export default function ProductCrossReferenceCards({
  locale,
  refs,
  brand,
}: Props) {
  if (refs.length === 0) {
    return null;
  }

  const isThai = locale === "th";
  const title = "CROSS REFERENCE";
  const subtitle = "Equivalent / Replacement Parts";
  const brandLabel = "Brand";
  const referenceLabel = "Reference Part No.";
  const note = isThai
    ? "หมายเหตุ: ข้อมูล Cross Reference ใช้เพื่อเทียบเบื้องต้น กรุณายืนยันสเปค ขนาด เกลียว และค่าการกรองก่อนสั่งซื้อ"
    : "Cross reference data is provided as an initial matching aid. Submit an RFQ so our team can confirm fitment before quoting.";

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 sm:px-6">
        <SectionLabel>{title}</SectionLabel>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[minmax(120px,0.8fr)_minmax(0,1.2fr)] border-b border-slate-200 bg-slate-50/90">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {brandLabel}
            </div>
            <div className="border-l border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {referenceLabel}
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {refs.map((ref) => (
              <div
                key={ref}
                className="grid grid-cols-[minmax(120px,0.8fr)_minmax(0,1.2fr)] items-stretch"
              >
                <div className="px-4 py-3 text-sm font-medium text-slate-700">
                  {brand.toUpperCase()}
                </div>
                <div className="border-l border-slate-200 px-4 py-3">
                  <Link
                    href={`/${locale}/products/${encodeURIComponent(ref)}`}
                    className="text-sm font-semibold text-slate-900 underline-offset-4 transition hover:text-slate-700 hover:underline"
                  >
                    {ref}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm leading-6 text-sky-900">
          {note}
        </div>
      </div>
    </div>
  );
}
