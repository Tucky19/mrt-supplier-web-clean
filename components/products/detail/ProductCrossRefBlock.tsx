type ProductCrossRefBlockProps = {
  locale: string;
  crossReferences?: string[];
  oemReferences?: string[];
};

function compactList(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function ReferenceGroup({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  if (values.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((ref) => (
          <span
            key={ref}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            {ref}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProductCrossRefBlock({
  locale,
  crossReferences,
  oemReferences,
}: ProductCrossRefBlockProps) {
  const crossRefs = compactList(crossReferences);
  const oemRefs = compactList(oemReferences);

  if (crossRefs.length === 0 && oemRefs.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {locale === "th" ? "Reference" : "Reference"}
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          {locale === "th"
            ? "เบอร์เทียบ / OEM Reference"
            : "Cross References / OEM References"}
        </h2>
      </div>

      <div className="mt-5 space-y-6">
        <ReferenceGroup
          title={locale === "th" ? "Cross Reference" : "Cross References"}
          values={crossRefs}
        />
        <ReferenceGroup
          title={locale === "th" ? "OEM Reference" : "OEM References"}
          values={oemRefs}
        />
      </div>
    </section>
  );
}
