import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

type Product = {
  id: string;
  brand: string;
  image: string;
  name: {
    th: string;
    en: string;
  };
  spec: {
    th: string;
    en: string;
  };
};

const copy = {
  en: {
    eyebrow: "Featured Parts",
    title: "Featured Products",
    description:
      "A clean product grid designed to help buyers quickly review brand, product type, and key specifications.",
    empty: "No featured products available at the moment.",
    specLabel: "Key Specification",
    button: "View Details",
    quote: "Request Quote",
  },
  th: {
    eyebrow: "Featured Parts",
    title: "สินค้าตัวอย่าง",
    description:
      "จัดแสดงสินค้าในรูปแบบที่อ่านง่าย เพื่อให้ตรวจสอบแบรนด์ ประเภทสินค้า และสเปกสำคัญได้รวดเร็ว",
    empty: "ขณะนี้ยังไม่มีสินค้าที่แสดง",
    specLabel: "สเปกสำคัญ",
    button: "ดูรายละเอียด",
    quote: "ขอราคา",
  },
} as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const locale = useLocale() as "th" | "en";
  const t = copy[locale];

  if (!products.length) {
    return (
      <section id="products" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t.description}
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
                  alt={product.name[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-contain p-6"
                />
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {product.brand}
                </p>

                <h3 className="mt-2 min-h-[56px] text-lg font-semibold leading-7 text-slate-900">
                  {product.name[locale]}
                </h3>

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    {t.specLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {product.spec[locale]}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/products/${product.id}`}
                    className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
                  >
                    {t.button}
                  </Link>

                  <Link
                    href={`/${locale}/quote`}
                    className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    {t.quote}
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
