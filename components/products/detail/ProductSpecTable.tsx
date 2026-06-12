type ProductSpecification = {
  label: string;
  value: string;
};

type ProductSpecTableProps = {
  locale: string;
  specifications?: ProductSpecification[];
  specSummary?: string;
};

function hasContent(value: string | undefined | null) {
  return String(value ?? "").trim().length > 0;
}

export default function ProductSpecTable({
  locale,
  specifications,
  specSummary,
}: ProductSpecTableProps) {
  const rows = (specifications ?? []).filter(
    (item) => hasContent(item?.label) && hasContent(item?.value),
  );
  const summary = hasContent(specSummary) ? String(specSummary).trim() : "";

  if (rows.length === 0 && summary.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-300 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex flex-col gap-2 border-b border-slate-300 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Technical Specifications
        </p>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
          {locale === "th" ? "รายละเอียดสเปกทั้งหมด" : "Detailed Specifications"}
        </h2>
      </div>

      {summary && (
        <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-[15px]">
          {summary}
        </p>
      )}

      {rows.length > 0 && (
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          {rows.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-2xl border border-slate-300 bg-slate-50/80 px-4 py-3.5"
            >
              <p className="text-xs font-semibold text-slate-500">
                {item.label}
              </p>
              <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
