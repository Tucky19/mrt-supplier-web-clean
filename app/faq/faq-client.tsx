"use client";

import Link from "next/link";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "ขอใบเสนอราคา (RFQ) ยังไง?",
    a: "ค้นหา Part No. → กด Add to Quote → ไปหน้า Quote → กรอกข้อมูล → Submit",
  },
  {
    q: "เว็บไม่โชว์ลิสต์สินค้า ทำไม?",
    a: "เราใช้แนวทาง Search-first เพื่อให้ลูกค้าค้นหา Part No. ได้เร็ว และลดการ scraping แคตตาล็อกทั้งหมด",
  },
  {
    q: "มีสินค้าพร้อมส่งไหม?",
    a: "บางรายการมีสต็อก/สต็อกน้อย/ต้องขอราคา กรุณาส่ง RFQ เพื่อให้ทีมงานยืนยันสถานะและราคา",
  },
  {
    q: "รองรับแบรนด์อะไรบ้าง?",
    a: "โฟกัส Bearings (เช่น NTN) และ Filters (เช่น Donaldson, MANN, Fleetguard) ตามงานลูกค้า",
  },
];

export default function FAQClient() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
        FAQ
      </h1>
      <p className="mt-2 text-neutral-600">
        คำถามที่พบบ่อยเกี่ยวกับการค้นหาและขอใบเสนอราคา
      </p>

      <div className="mt-6 grid gap-3">
        {FAQS.map((f, i) => (
          <details
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900">
              {f.q}
            </summary>
            <div className="mt-3 text-sm text-neutral-700">{f.a}</div>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Search Products
        </Link>
        <Link
          href={`/quote`}
          className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400"
        >
          Open Quote
        </Link>
      </div>
    </main>
  );
}