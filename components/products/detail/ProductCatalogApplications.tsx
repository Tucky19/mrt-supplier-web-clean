import type { CatalogApplication } from "@/types/product";
import { getProductUiText } from "@/lib/i18n/productUi";

export default function ProductCatalogApplications({ entries, locale }: {
  entries?: CatalogApplication[]; locale: string;
}) {
  if (!entries?.length) return null;
  const text = getProductUiText(locale);
  return (
    <section className="mt-6 rounded-2xl border border-slate-300 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-950">{text.catalogApplications}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text.catalogCaution}</p>
      <p className="mt-2 text-xs text-slate-500">{entries[0].source}</p>
      <ul className="mt-4 divide-y divide-slate-200">
        {entries.map((entry, index) => (
          <li key={`${entry.sourceTable}-${index}`} className="space-y-1 py-4 text-sm">
            <p className="font-semibold text-slate-900">{entry.equipment}</p>
            <p className="text-slate-600">{entry.description}</p>
            <p className="break-words">{text.catalogOem}: {entry.oemRaw || text.catalogMissing}</p>
            <p className="text-xs text-slate-500">{text.catalogPage} {entry.page}</p>
            {entry.needsReview && <p className="text-xs text-amber-800">{text.catalogReview}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
