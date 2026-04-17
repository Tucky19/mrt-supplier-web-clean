import type { Metadata } from "next";
import { products } from "@/data/products";
import ResultCard from "@/components/search/ResultCard";
import { searchProducts } from "@/features/search/server/search-products";

type SearchMode = "part" | "spec" | "all";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    mode?: string;
  }>;
};

function safeMode(mode?: string): SearchMode {
  if (mode === "part" || mode === "spec" || mode === "all") {
    return mode;
  }

  return "all";
}

export const metadata: Metadata = {
  title: "Search Industrial Parts | MRT Supplier",
  description:
    "Search industrial parts by part number, cross reference, title, brand, and specification.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const q = String(sp.q ?? "").trim();
  const mode = safeMode(sp.mode);

  const hits = q ? searchProducts(products, q, mode, 30) : [];

  const result = {
    q,
    total: hits.length,
    hits,
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Search
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Search Industrial Parts
                </h1>
                <p className="mt-3 text-sm leading-7 text-neutral-400 sm:text-base">
                  Search by part number, brand, title, specification, and cross
                  reference.
                </p>
              </div>

              <form className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_auto]">
                <div>
                  <label
                    htmlFor="search-q"
                    className="mb-2 block text-sm font-medium text-neutral-200"
                  >
                    Keyword / Part No.
                  </label>
                  <input
                    id="search-q"
                    name="q"
                    defaultValue={q}
                    placeholder="e.g. P550008, 6205ZZ, oil filter"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-white/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="search-mode"
                    className="mb-2 block text-sm font-medium text-neutral-200"
                  >
                    Mode
                  </label>
                  <select
                    id="search-mode"
                    name="mode"
                    defaultValue={mode}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                  >
                    <option value="all">All</option>
                    <option value="part">Part</option>
                    <option value="spec">Spec</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="inline-flex h-[46px] items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:opacity-90"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                <span>
                  Query:{" "}
                  <span className="font-semibold text-white">
                    {result.q || "-"}
                  </span>
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-600" />
                <span>
                  Results:{" "}
                  <span className="font-semibold text-white">{result.total}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-600" />
                <span>
                  Mode:{" "}
                  <span className="font-semibold text-white">{mode}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {!q ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                Start your search
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                Enter a part number, cross reference, brand, or specification to
                find matching products.
              </p>
            </div>
          ) : result.hits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                No matching products found
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                Try another keyword, a shorter part number, or switch the search
                mode.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {result.hits.map((hit) => (
                <ResultCard key={hit.product.id} hit={hit} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}