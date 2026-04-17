import Link from "next/link";

const POPULAR = [
  "P550388",
  "P537876",
  "WK1144",
  "6205ZZ",
  "6308",
  "OD93",
  "93mm",
  "1-12",
];

export default function PopularSearches() {
  return (
    <section className="mt-4">
      <div className="text-xs text-white/50 mb-2">
        Popular searches
      </div>

      <div className="flex flex-wrap gap-2">
        {POPULAR.map((q) => (
          <Link
            key={q}
            href={`/products?q=${encodeURIComponent(q)}`}
            className="
              rounded-xl
              border border-white/10
              bg-white/5
              px-3 py-1.5
              text-sm text-white/80
              hover:bg-white/10
              hover:border-white/20
              transition
            "
          >
            {q}
          </Link>
        ))}
      </div>
    </section>
  );
}
