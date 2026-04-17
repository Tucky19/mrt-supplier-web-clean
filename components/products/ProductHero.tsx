import type { Product } from "@/types/product";

type Props = {
  product: Product;
  onAddToQuote?: (product: Product) => void;
};

function getStockLabel(status?: Product["stockStatus"]) {
  switch (status) {
    case "in_stock":
      return "In Stock";
    case "low_stock":
      return "Low Stock";
    case "request":
    default:
      return "Request for Availability";
  }
}

function getStockClass(status?: Product["stockStatus"]) {
  switch (status) {
    case "in_stock":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "low_stock":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "request":
    default:
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }
}

export default function ProductHero({ product, onAddToQuote }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                {product.brand}
              </span>

              <span
                className={[
                  "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                  getStockClass(product.stockStatus),
                ].join(" ")}
              >
                {getStockLabel(product.stockStatus)}
              </span>

              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                {product.category}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.partNo}
            </h1>

            {product.title ? (
              <p className="mt-3 max-w-3xl text-lg leading-8 text-neutral-200">
                {product.title}
              </p>
            ) : (
              <p className="mt-3 max-w-3xl text-lg leading-8 text-neutral-300">
                Reliable industrial part for maintenance, replacement, and procurement workflows.
              </p>
            )}

            {product.spec ? (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-400">
                {product.spec}
              </p>
            ) : null}

            {product.refs && product.refs.length > 0 ? (
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Cross Reference / Related Numbers
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.refs.map((ref) => (
                    <span
                      key={ref}
                      className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-neutral-300">
              For pricing, bulk orders, project discounts, and cross reference confirmation,
              please request a quotation from our sales team.
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Product Summary
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                <dt className="text-neutral-500">Part Number</dt>
                <dd className="text-right font-medium text-white">{product.partNo}</dd>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                <dt className="text-neutral-500">Brand</dt>
                <dd className="text-right font-medium text-white">{product.brand}</dd>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                <dt className="text-neutral-500">Category</dt>
                <dd className="text-right font-medium text-white">{product.category}</dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-neutral-500">Availability</dt>
                <dd className="text-right font-medium text-white">
                  {getStockLabel(product.stockStatus)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onAddToQuote?.(product)}
                className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400"
              >
                Add to Quote
              </button>

              <a
                href={`/quote`}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Request Quote
              </a>

              {product.officialUrl ? (
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/15"
                >
                  View Official Product Page
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      {product.officialUrl ? (
        <div className="border-t border-white/10 p-6 sm:p-8 lg:p-10">
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
                  confirmation, and additional product details from {product.brand}.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
                >
                  Open Official Page
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}