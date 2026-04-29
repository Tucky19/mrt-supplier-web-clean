import Image from "next/image";
import { useLocale } from "next-intl";

type Brand = {
  key: string;
  name: string;
  logo: string;
};

const brandDescriptions = {
  en: {
    title: "Trusted Brands",
    description:
      "We work with recognized industrial brands and present them in a clean, professional layout that is easy to scan and trust.",
    eyebrow: "Trusted Brands",
    items: {
      donaldson:
        "Filtration solutions for engines, industrial systems, and heavy-duty equipment.",
      mann:
        "High-quality filters for automotive, industrial, and maintenance applications.",
      ntn: "Precision bearings for industrial and rotating equipment applications.",
    },
  },
  th: {
    title: "แบรนด์ที่ลูกค้าโรงงานไว้วางใจ",
    description:
      "เราคัดเลือกแบรนด์อุตสาหกรรมที่ได้รับการยอมรับ และจัดวางข้อมูลให้อ่านง่าย ดูเป็นมืออาชีพ และช่วยให้ตัดสินใจได้เร็วขึ้น",
    eyebrow: "Trusted Brands",
    items: {
      donaldson:
        "โซลูชันระบบกรองสำหรับเครื่องยนต์ ระบบอุตสาหกรรม และเครื่องจักรงานหนัก",
      mann:
        "ไส้กรองคุณภาพสูงสำหรับงานยานยนต์ งานอุตสาหกรรม และงานบำรุงรักษา",
      ntn: "ตลับลูกปืนความแม่นยำสูงสำหรับงานอุตสาหกรรมและอุปกรณ์หมุน",
    },
  },
} as const;

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  const locale = useLocale() as "th" | "en";
  const copy = brandDescriptions[locale];

  return (
    <section id="brands" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
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

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
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
                <p className="text-sm font-semibold text-slate-900">
                  {brand.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {copy.items[brand.key as keyof typeof copy.items]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
