type ProductApplicationBlockProps = {
  locale: string;
  equipment?: string[];
  applications?: string[];
};

function ListBlock({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if ((items?.length ?? 0) === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items!.map((item) => (
          <li key={item} className="leading-6">
            - {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductApplicationBlock({
  locale,
  equipment,
  applications,
}: ProductApplicationBlockProps) {
  if ((equipment?.length ?? 0) === 0 && (applications?.length ?? 0) === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {locale === "th" ? "Application" : "Application"}
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          {locale === "th"
            ? "อุปกรณ์ / การใช้งาน"
            : "Equipment / Applications"}
        </h2>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <ListBlock
          title={locale === "th" ? "Equipment" : "Equipment"}
          items={equipment}
        />
        <ListBlock
          title={locale === "th" ? "Applications" : "Applications"}
          items={applications}
        />
      </div>
    </section>
  );
}
