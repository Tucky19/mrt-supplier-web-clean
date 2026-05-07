import Image from "next/image";
import { getHomeBrandShowcaseText } from "@/lib/i18n/homeUi";

type Brand = {
  key: string;
  name: string;
  logo: string;
};

export default function BrandShowcase({
  brands,
  supportingBrands,
  locale,
}: {
  brands: Brand[];
  supportingBrands: string[];
  locale: string;
}) {
  const copy = getHomeBrandShowcaseText(locale);

  return (
    <section id="brands" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {copy.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {copy.description}
          </p>
        </div>

        <div className="mt-10">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
              {copy.coreHeading}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {copy.coreHelper}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {brands.map((brand) => (
              <article
                key={brand.key}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-28 items-center justify-center rounded-2xl border border-slate-100 bg-white px-6">
                  <div className="relative h-20 w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <p className="text-sm font-semibold text-slate-900">{brand.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {copy.items[brand.key as keyof typeof copy.items]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
              {copy.supportingHeading}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {copy.supportingHelper}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {supportingBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
