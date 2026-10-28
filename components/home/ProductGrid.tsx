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
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
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

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative h-32 border-b border-[var(--color-border)] bg-[var(--color-surface)] sm:h-44 xl:h-40">
                <Image
                  src={product.image}
                  alt={isThai ? product.subtitle?.th || product.title.th : product.title.en}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-contain p-3 sm:p-5"
                />
              </div>

              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <h3 className="text-sm font-semibold leading-5 text-[var(--color-text)] sm:text-lg sm:leading-7">
                  {product.title[localeKey]}
                </h3>

                {isThai && product.subtitle?.th ? (
                  <p className="mt-1 text-xs font-medium leading-5 text-[var(--color-text-muted)] sm:min-h-[48px] sm:text-sm sm:leading-6">
                    {product.subtitle.th}
                  </p>
                ) : (
                  <div className="hidden sm:block sm:min-h-[48px]" />
                )}

                <p className="mt-3 hidden text-sm leading-6 text-[var(--color-text-muted)] sm:block sm:min-h-[96px]">
                  {product.description[localeKey]}
                </p>

                <div className="mt-auto pt-4 sm:pt-5">
                  <Link
                    href={product.href}
                    className={`inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-2 py-2 text-center text-xs font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] sm:px-4 sm:text-sm ${lightFocusClass}`}
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
