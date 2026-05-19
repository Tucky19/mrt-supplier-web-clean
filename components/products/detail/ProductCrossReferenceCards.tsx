import Link from "next/link";
import { getProductUiText } from "@/lib/i18n/productUi";

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

  const text = getProductUiText(locale);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)] px-5 py-5 sm:px-6">
      <SectionLabel>{text.crossReference}</SectionLabel>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {refs.map((ref) => (
          <Link
            key={ref}
            href={`/${locale}/products/${encodeURIComponent(ref)}`}
            className="group rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {brand.toUpperCase()}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-slate-950">
              {ref}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
