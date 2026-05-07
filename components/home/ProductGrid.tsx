import Image from "next/image";
import Link from "next/link";
import { getHomeProductGridText } from "@/lib/i18n/homeUi";

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
      <section id="products" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{text.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {text.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {text.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="relative h-56 border-b border-slate-100 bg-white">
                <Image
                  src={product.image}
                  alt={isThai ? product.subtitle?.th || product.title.th : product.title.en}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-contain p-6"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold leading-7 text-slate-900">
                  {product.title[localeKey]}
                </h3>

                {isThai && product.subtitle?.th ? (
                  <p className="mt-1 min-h-[48px] text-sm font-medium leading-6 text-slate-700">
                    {product.subtitle.th}
                  </p>
                ) : (
                  <div className="min-h-[48px]" />
                )}

                <p className="mt-4 min-h-[96px] text-sm leading-6 text-slate-600">
                  {product.description[localeKey]}
                </p>

                <div className="mt-5">
                  <Link
                    href={product.href}
                    className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
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
