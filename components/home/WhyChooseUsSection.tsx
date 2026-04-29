import { ShieldCheck, FileText, Boxes, Handshake } from "lucide-react";
import { useLocale } from "next-intl";

const iconMap = {
  trusted: ShieldCheck,
  response: FileText,
  clean: Boxes,
  b2b: Handshake,
} as const;

const items = ["trusted", "response", "clean", "b2b"] as const;

const copy = {
  en: {
    eyebrow: "MRT Supplier",
    title: "Why Choose MRT Supplier",
    description:
      "We focus on clear communication, trusted products, and responsive service for industrial customers.",
    items: {
      trusted: {
        title: "Trusted Industrial Brands",
        description:
          "We prioritize recognized brands that are widely used in industrial environments.",
      },
      response: {
        title: "Responsive Quotation Support",
        description:
          "We help customers move faster with clear RFQ handling and follow-up.",
      },
      clean: {
        title: "Clear Product Presentation",
        description:
          "Products are presented in a clean format so buyers can scan information quickly.",
      },
      b2b: {
        title: "Built for B2B Workflows",
        description:
          "Suitable for factory buyers, maintenance teams, and procurement departments.",
      },
    },
  },
  th: {
    eyebrow: "MRT Supplier",
    title: "ทำไมลูกค้าอุตสาหกรรมจึงเลือก MRT Supplier",
    description:
      "เราเน้นการสื่อสารที่ชัดเจน การนำเสนอสินค้าที่อ่านง่าย และการตอบกลับที่เหมาะกับงานจัดซื้อและซ่อมบำรุง",
    items: {
      trusted: {
        title: "แบรนด์อุตสาหกรรมที่เชื่อถือได้",
        description:
          "เราคัดเลือกแบรนด์ที่ได้รับการยอมรับและใช้งานอย่างแพร่หลายในภาคอุตสาหกรรม",
      },
      response: {
        title: "ตอบกลับใบเสนอราคาได้รวดเร็ว",
        description:
          "ช่วยให้ทีมจัดซื้อและลูกค้าเดินงานต่อได้เร็วขึ้นด้วยการประสานงานและติดตามที่ชัดเจน",
      },
      clean: {
        title: "ข้อมูลสินค้าอ่านง่าย",
        description:
          "จัดวางข้อมูลให้ตรวจสอบแบรนด์ รุ่น และสเปกสำคัญได้รวดเร็ว",
      },
      b2b: {
        title: "ออกแบบเพื่อการทำงานแบบ B2B",
        description:
          "เหมาะสำหรับโรงงาน ฝ่ายจัดซื้อ และทีมซ่อมบำรุงที่ต้องการ workflow ที่ตรงไปตรงมา",
      },
    },
  },
} as const;

export default function WhyChooseUsSection() {
  const locale = useLocale() as "th" | "en";
  const section = copy[locale];

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {section.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {section.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">
            {section.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((key) => {
            const Icon = iconMap[key];
            const item = section.items[key];

            return (
              <article
                key={key}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
