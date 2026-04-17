import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Why Us | MRT Supplier",
  description:
    "Stock-ready parts, cross-brand matching, and RFQ-based procurement for factories. Reduce downtime with reliable supply.",
};

export default function WhyUsPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-xs font-semibold text-gray-600">B2B supplier</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Why MRT Supplier
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            เราโฟกัสการจัดซื้อแบบโรงงาน: สต็อกพร้อมส่ง (บางรุ่น), เทียบสเปกข้ามแบรนด์, และระบบ RFQ
            เพื่อให้ได้ราคาที่ถูกต้องและตรวจสอบได้
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Search parts
            </Link>
            <Link
              href={`/quote`}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Request RFQ
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Card
              title="Stock-ready supply"
              desc="รุ่นยอดนิยมบางส่วนพร้อมส่ง เพื่อช่วยลด downtime และทำให้แผนซ่อมบำรุงเดินต่อได้"
            />
            <Card
              title="Cross-brand matching"
              desc="หาของเดิมไม่ได้? ส่ง Part No/รูปฉลาก/สเปกมา เราช่วยเทียบสเปกข้ามแบรนด์ให้เหมาะกับงาน"
            />
            <Card
              title="RFQ-based procurement"
              desc="ระบบ RFQ เหมาะกับโรงงาน: ยืนยันสเปกก่อนเสนอราคา พร้อมเอกสารถูกต้องและตรวจสอบได้"
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Block
              title="What purchasing teams get"
              items={[
                "ใบเสนอราคาเป็นทางการ (Quotation / RFQ)",
                "ยืนยันสเปก ลดความเสี่ยงใส่ผิดรุ่น",
                "ข้อมูลสถานะสต็อก/lead time ตามจริง",
                "รองรับเอกสารภาษี (ตามเงื่อนไข)",
              ]}
            />
            <Block
              title="What maintenance teams get"
              items={[
                "ลดรอบการหาอะไหล่ในช่วงเครื่องหยุด",
                "ทางเลือกเทียบสเปกเมื่อรุ่นเดิมไม่มี",
                "คำแนะนำการเลือกสเปกที่เหมาะกับงาน",
                "RFQ ส่งหลายรายการพร้อมจำนวนในครั้งเดียว",
              ]}
            />
          </div>

          <div className="mt-10 rounded-2xl border bg-gray-50 p-6">
            <div className="text-sm font-semibold">Next step</div>
            <p className="mt-2 text-sm text-gray-600">
              เริ่มจากค้นหา Part Number แล้วเพิ่มรายการเพื่อส่ง RFQ — ทีมงานจะตอบกลับพร้อมราคาและรายละเอียด
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/search"
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Open Search
              </Link>
              <Link
                href={`/quote`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
              >
                Submit RFQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {items.map((it) => (
          <li key={it}>• {it}</li>
        ))}
      </ul>
    </div>
  );
}
