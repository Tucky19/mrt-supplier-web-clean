type Props = {
  officialUrl?: string;
  brand?: string;
};

export default function ProductReferenceSection({
  officialUrl,
  brand,
}: Props) {
  if (!officialUrl) return null;

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Manufacturer Reference
          </div>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Need full technical confirmation?
          </h2>

          <p className="mt-2 text-sm leading-7 text-neutral-300">
            View the official manufacturer product page for reference, specification
            confirmation, and additional product details
            {brand ? ` from ${brand}` : ""}.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
          >
            Open Official Page
          </a>
        </div>
      </div>
    </section>
  );
}