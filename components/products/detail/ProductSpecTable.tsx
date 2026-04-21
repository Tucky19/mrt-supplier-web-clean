type ProductSpecification = {
  label: string;
  value: string;
};

type ProductSpecTableProps = {
  locale: string;
  specifications?: ProductSpecification[];
};

function hasContent(value: string | undefined | null) {
  return String(value ?? "").trim().length > 0;
}

export default function ProductSpecTable({
  locale,
  specifications,
}: ProductSpecTableProps) {
  const rows = (specifications ?? []).filter(
    (item) => hasContent(item?.label) && hasContent(item?.value)
  );

  if (rows.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {locale === "th" ? "Specification" : "Specification"}
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          {locale === "th" ? "รายละเอียดสเปก" : "Detailed Specifications"}
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
