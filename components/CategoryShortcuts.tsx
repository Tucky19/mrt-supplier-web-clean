import Link from "next/link";

const categories = [
  {
    title: "ไส้กรอง (Filters)",
    desc: "Air, Oil, Fuel, Hydraulic",
    href: "/search?q=filter",
  },
  {
    title: "ตลับลูกปืน (Bearings)",
    desc: "Ball, Roller, Industrial Bearing",
    href: "/search?q=bearing",
  },
  {
    title: "เบอร์เทียบ (Cross Reference)",
    desc: "ค้นหาด้วยเบอร์เทียบของแบรนด์อื่น",
    href: "/search",
  },
  {
    title: "รุ่นเครื่อง / Fitment",
    desc: "ค้นหาตามรุ่นเครื่องหรือการใช้งาน",
    href: "/search",
  },
];

export default function CategoryShortcuts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">
          หมวดการค้นหายอดนิยม
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          เริ่มต้นค้นหาได้เร็วขึ้นด้วยหมวดหลักที่ลูกค้าใช้งานบ่อย
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-base font-semibold text-neutral-900">
              {item.title}
            </div>

            <div className="mt-2 text-sm leading-6 text-neutral-600">
              {item.desc}
            </div>

            <div className="mt-4 text-sm font-medium text-blue-700">
              เปิดการค้นหา →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}