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
    <section id="brands" className="mrt-blueprint-section-strong border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {copy.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            {copy.description}
          </p>
        </div>

        <div className="mt-10">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
              {copy.coreHeading}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {copy.coreHelper}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {brands.map((brand) => (
              <article
                key={brand.key}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)] sm:p-6"
              >
                <div className="flex h-24 items-center justify-center rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 sm:h-28 sm:px-6">
                  <div className="relative h-16 w-full sm:h-20">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                <div className="mt-4 text-center sm:mt-5">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{brand.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {copy.items[brand.key as keyof typeof copy.items]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-8">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
              {copy.supportingHeading}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {copy.supportingHelper}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {supportingBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)]"
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
