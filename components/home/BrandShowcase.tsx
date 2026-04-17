import Image from "next/image";
import { useTranslations } from "next-intl";

type Brand = {
  key: string;
  name: string;
  logo: string;
};

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  const t = useTranslations("brands");

  return (
    <section id="brands" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {brands.map((brand) => (
            <article
              key={brand.key}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="flex h-28 items-center justify-center rounded-2xl bg-white px-6">
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
                <p className="text-sm font-semibold text-slate-900">
                  {brand.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t(`items.${brand.key}`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}