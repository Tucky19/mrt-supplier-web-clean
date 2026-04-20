import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

const brands = [
  {
    name: "NTN",
    image: "/brands/ntn.png",
    query: "NTN",
    subtitle: "Bearings & industrial motion components",
  },
  {
    name: "MANN-FILTER",
    image: "/brands/mann-filter.png",
    query: "MANN",
    subtitle: "Filtration solutions for industrial applications",
  },
  {
    name: "DONALDSON",
    image: "/brands/donaldson.png",
    query: "DONALDSON",
    subtitle: "Industrial filtration and replacement filters",
  },
];

export default function BrandStrip() {
  const locale = useLocale();

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Trusted brands
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
              Source by leading industrial brands
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Browse supported brands and jump directly into part search,
              cross-reference lookup, and RFQ workflows.
            </p>
          </div>

          <div className="text-sm text-neutral-500">
            Click a brand to open search results
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/${locale}/products?q=${encodeURIComponent(brand.query)}`}
              className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
            >
              <div className="flex h-full flex-col">
                <div className="flex min-h-[88px] items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-5">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={240}
                    height={90}
                    className="h-14 w-auto object-contain opacity-90 transition duration-200 group-hover:scale-[1.02] group-hover:opacity-100 md:h-16"
                  />
                </div>

                <div className="mt-5 flex-1">
                  <div className="text-base font-semibold text-neutral-900">
                    {brand.name}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {brand.subtitle}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
                    Search brand
                  </span>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 transition group-hover:translate-x-0.5">
                    <span>Open</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
