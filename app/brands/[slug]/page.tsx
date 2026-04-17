import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const brandContent: Record<
  string,
  {
    title: string;
    subtitle: string;
    bullets: string[];
    useCases: string[];
    ctaHint: string;
  }
> = {
  ntn: {
    title: "NTN Bearings",
    subtitle:
      "ลูกปืนความแม่นยำสูงสำหรับงานอุตสาหกรรม ลดการสึกหรอ รองรับโหลดหนัก และคุมความเสถียรของระบบหมุน",
    bullets: [
      "เหมาะกับงานที่ต้องเดินเครื่องต่อเนื่องและต้องการความแม่นยำ",
      "ช่วยลดแรงเสียดทาน ลดความร้อนสะสม และยืดอายุชิ้นส่วน",
      "รองรับการใช้งานในมอเตอร์ ปั๊ม เกียร์ และระบบสายพาน",
    ],
    useCases: ["Motor / Gearbox", "Pump & Fan", "Conveyor System", "General Industrial"],
    ctaHint: "มี Part Number หรือวัดขนาด d/D/B ได้? ค้นหาแล้วขอราคาได้ทันที",
  },
  donaldson: {
    title: "Donaldson Filtration",
    subtitle:
      "ระบบกรองสำหรับเครื่องจักรหนักและงานอุตสาหกรรม ปกป้องเครื่องยนต์ ลดการสึกหรอ และยืดรอบ PM",
    bullets: [
      "ลดความเสี่ยง Downtime จากฝุ่น/สิ่งปนเปื้อนในระบบ",
      "เหมาะกับเครื่องจักรหนัก เครื่องยนต์ และระบบไฮดรอลิก",
      "ช่วยให้ประสิทธิภาพการทำงานสม่ำเสมอในสภาพแวดล้อมหนัก",
    ],
    useCases: ["Heavy Equipment", "Engine Protection", "Hydraulic System", "Dust & Air Filtration"],
    ctaHint: "มี Part Number เดิม? ค้นหาแล้วกด Official (Donaldson) ได้จากหน้า Product",
  },
  mann: {
    title: "Mann-Filter",
    subtitle:
      "มาตรฐานเยอรมัน คุณภาพการกรองสม่ำเสมอ เหมาะกับระบบลมอัด น้ำมัน และงานที่ต้องการความสะอาดสูง",
    bullets: [
      "ลดความเสียหายของวาล์ว/กระบอกสูบจากสิ่งปนเปื้อน",
      "เหมาะกับโรงงานที่เน้นคุณภาพและความเสถียรของระบบ",
      "รองรับงานระบบลมอัดและระบบของไหลที่สำคัญ",
    ],
    useCases: ["Compressed Air", "Oil & Fluid", "High Cleanliness", "Plant Reliability"],
    ctaHint: "มี Cross reference? แจ้งรหัสเดิมเพื่อให้เราช่วยเทียบได้เร็ว",
  },
};

export default function BrandDetailPage({ params }: { params: { slug: string } }) {
  const slug = (params.slug || "").toLowerCase();
  const data = brandContent[slug];
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-10">
        <div className="mb-3 text-xs font-semibold text-slate-500">Brand Focus</div>
        <h1 className="text-3xl font-bold text-slate-900">{data.title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Key Notes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {data.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Typical Use Cases</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.useCases.map((u) => (
              <span key={u} className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700">
                {u}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
            💡 {data.ctaHint}
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Search Parts
        </Link>
       <Link
          href="/quote"
          className="rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Request Quote
      </Link>
        <Link
          href="/brands"
          className="rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to Brands
        </Link>
      </div>
    </main>
  );
}
