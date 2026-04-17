"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AboutClient() {
  const sp = useSearchParams();
  const tab = (sp.get("tab") || "about").toLowerCase();

  const tabBtn = (key: string, label: string) => {
    const on = tab === key;
    return (
      <Link
        href={`/about?tab=${encodeURIComponent(key)}`}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          on
            ? "bg-neutral-900 text-white"
            : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          MRT Supplier
        </h1>
        <p className="max-w-2xl text-neutral-600">
          Industrial spare parts สำหรับงานโรงงาน/เครื่องจักร — Bearings & Filters
          พร้อมระบบขอใบเสนอราคา (RFQ) แบบ Search-first
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {tabBtn("about", "About")}
          {tabBtn("why", "Why Us")}
          {tabBtn("contact", "Contact")}
        </div>
      </header>

      <section className="mt-8">
        {tab === "why" ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">Why MRT Supplier</h2>

            <ul className="mt-4 grid gap-3 text-neutral-700 md:grid-cols-2">
              <li className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Search-first</div>
                <div className="mt-1 text-sm">
                  ค้นหา Part No. ได้ไว ไม่โชว์ลิสต์ทั้งแคตตาล็อก ลดการ scraping
                </div>
              </li>

              <li className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">RFQ Flow ชัด</div>
                <div className="mt-1 text-sm">
                  Search → Add to Quote → Submit → ทีมงานตอบกลับเป็นทางการ
                </div>
              </li>

              <li className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Industrial Grade</div>
                <div className="mt-1 text-sm">
                  โฟกัสงานโรงงาน/เครื่องจักรจริง: Bearings, Filters, Spare parts
                </div>
              </li>

              <li className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">ตอบไว + ตามสเปก</div>
                <div className="mt-1 text-sm">
                  ระบุสเปก/เบอร์เทียบ/การใช้งาน ช่วยลดรอบการคุย
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Search Products
              </Link>
              <Link
                href="/quote"
                className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Open Quote
              </Link>
            </div>
          </div>
        ) : tab === "contact" ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">Contact</h2>

            <div className="mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Company</div>
                <div className="mt-1">บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด</div>
                <div className="mt-1">Tax ID: 0103557011754</div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Phone</div>
                <div className="mt-1">081-558-1323</div>
                <div className="mt-1">097-012-2111</div>
                <div className="mt-3 font-semibold text-neutral-900">LINE</div>
                <div className="mt-1">@mrt-supplier</div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 md:col-span-2">
                <div className="font-semibold text-neutral-900">Address</div>
                <div className="mt-1">
                  15 ชั้น 2 ซอยบรมราชชนนี 39 ถนนบรมราชชนนี แขวงตลิ่งชัน เขตตลิ่งชัน
                  กรุงเทพฯ 10170
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/products"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Start Searching
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">About</h2>
            <p className="mt-3 text-neutral-700">
              MRT Supplier ให้บริการจัดหาอะไหล่อุตสาหกรรม โดยเน้น Bearings และ Filters
              สำหรับงานโรงงานและเครื่องจักร พร้อมระบบ RFQ เพื่อให้ลูกค้าระบุรายการและ
              ขอราคาได้รวดเร็ว
            </p>

            <div className="mt-5 grid gap-3 text-sm text-neutral-700 md:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Bearings</div>
                <div className="mt-1">NTN และกลุ่มอะไหล่หมุนความแม่นยำสูง</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">Filters</div>
                <div className="mt-1">Donaldson / MANN / Fleetguard (ตามงาน)</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="font-semibold text-neutral-900">RFQ</div>
                <div className="mt-1">รวมรายการ → ส่งขอราคา → ตอบกลับเป็นทางการ</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Search Products
              </Link>
              <Link
                href="/quote"
                className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400"
              >
                Request Quote
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}