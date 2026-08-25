import Image from "next/image";
import Link from "next/link";
import { getHomeProductGridText } from "@/lib/i18n/homeUi";

const lightFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";

type CategoryCard = {
  id: string;
  image: string;
  href: string;
  title: {
    th: string;
    en: string;
  };
  subtitle?: {
    th: string;
    en: string;
  };
  description: {
    th: string;
    en: string;
  };
};

export default function ProductGrid({
  products,
  locale,
}: {
  products: CategoryCard[];
  locale: string;
}) {
  const text = getHomeProductGridText(locale);
  const localeKey = locale === "th" ? "th" : "en";
  const isThai = locale === "th";

  if (!products.length) {
    return (
      <section id="products" className="mrt-blueprint-section-strong border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{text.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="mrt-blueprint-section-strong border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {text.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            {text.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative h-56 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <Image
                  src={product.image}
                  alt={isThai ? product.subtitle?.th || product.title.th : product.title.en}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-contain p-6"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold leading-7 text-[var(--color-text)]">
                  {product.title[localeKey]}
                </h3>

                {isThai && product.subtitle?.th ? (
                  <p className="mt-1 min-h-[48px] text-sm font-medium leading-6 text-[var(--color-text-muted)]">
                    {product.subtitle.th}
                  </p>
                ) : (
                  <div className="min-h-[48px]" />
                )}

                <p className="mt-4 min-h-[96px] text-sm leading-6 text-[var(--color-text-muted)]">
                  {product.description[localeKey]}
                </p>

                <div className="mt-5">
                  <Link
                    href={product.href}
                    className={`inline-flex min-h-11 items-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] ${lightFocusClass}`}
                  >
                    {text.viewCategory}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
