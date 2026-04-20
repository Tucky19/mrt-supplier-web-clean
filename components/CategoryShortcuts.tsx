import Link from "next/link";
import { useLocale } from "next-intl";

const categories = [
  {
    title: "เนเธชเนเธเธฃเธญเธ (Filters)",
    desc: "Air, Oil, Fuel, Hydraulic",
    href: "/products?q=filter",
  },
  {
    title: "เธ•เธฅเธฑเธเธฅเธนเธเธเธทเธ (Bearings)",
    desc: "Ball, Roller, Industrial Bearing",
    href: "/products?q=bearing",
  },
  {
    title: "เน€เธเธญเธฃเนเน€เธ—เธตเธขเธ (Cross Reference)",
    desc: "เธเนเธเธซเธฒเธ”เนเธงเธขเน€เธเธญเธฃเนเน€เธ—เธตเธขเธเธเธญเธเนเธเธฃเธเธ”เนเธญเธทเนเธ",
    href: "/products",
  },
  {
    title: "เธฃเธธเนเธเน€เธเธฃเธทเนเธญเธ / Fitment",
    desc: "เธเนเธเธซเธฒเธ•เธฒเธกเธฃเธธเนเธเน€เธเธฃเธทเนเธญเธเธซเธฃเธทเธญเธเธฒเธฃเนเธเนเธเธฒเธ",
    href: "/products",
  },
];

export default function CategoryShortcuts() {
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">
          เธซเธกเธงเธ”เธเธฒเธฃเธเนเธเธซเธฒเธขเธญเธ”เธเธดเธขเธก
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          เน€เธฃเธดเนเธกเธ•เนเธเธเนเธเธซเธฒเนเธ”เนเน€เธฃเนเธงเธเธถเนเธเธ”เนเธงเธขเธซเธกเธงเธ”เธซเธฅเธฑเธเธ—เธตเนเธฅเธนเธเธเนเธฒเนเธเนเธเธฒเธเธเนเธญเธข
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((item) => (
          <Link
            key={item.title}
            href={`/${locale}${item.href}`}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-base font-semibold text-neutral-900">
              {item.title}
            </div>

            <div className="mt-2 text-sm leading-6 text-neutral-600">
              {item.desc}
            </div>

            <div className="mt-4 text-sm font-medium text-blue-700">
              เน€เธเธดเธ”เธเธฒเธฃเธเนเธเธซเธฒ โ’
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
