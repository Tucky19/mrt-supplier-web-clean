import ResultCard from "@/components/search/ResultCard";
import type { SearchProductResult } from "@/features/search/types";

type Props = {
  result: SearchProductResult;
};

export default function SearchResultList({ result }: Props) {
  if (result.total === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
          No Results
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          No products found for &quot;{result.q}&quot;
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
          Try another part number, remove spaces or special characters, or search using a related
          specification, application, or cross reference number.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={`/quote`}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400"
          >
            Request Quote
          </a>

          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Contact Sales
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {result.hits.map((hit) => (
        <ResultCard key={hit.product.id} hit={hit} />
      ))}
    </section>
  );
}