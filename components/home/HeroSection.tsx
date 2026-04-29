"use client";

import SingleSearch from "@/components/search/SingleSearch";

export default function HeroSection({
  locale = "th",
}: {
  locale?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
       <h1 className="text-3xl font-semibold text-slate-900">
          ค้นหาอะไหล่อุตสาหกรรมด้วย Part Number
       </h1>

       <p className="mt-2 text-sm text-slate-600">
          รองรับงานจัดซื้อ งานซ่อมบำรุง และ OEM sourcing
       <br />
        <span className="text-slate-400">
          Fast sourcing for industrial parts and RFQ support
      </span>
      </p>

        <div className="mt-8 flex justify-center">
          <SingleSearch locale={locale} autoFocus={false} />
        </div>
          <p className="mt-3 text-sm text-slate-500">
             มี Part Number? ส่งมาได้เลย
          <br />
         <span className="text-slate-400">
             Paste your part number to start sourcing
         </span>
       </p>
        <p className="mt-2 text-xs text-slate-400">
          ตัวอย่าง: P550084, 6205-2RS
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
          <span className="rounded-full border px-3 py-1">
            ✔ ไม่มีขั้นต่ำ
          </span>
          <span className="rounded-full border px-3 py-1">
            ✔ ตอบกลับรวดเร็ว
          </span>
          <span className="rounded-full border px-3 py-1">
            ✔ Trusted brands
          </span>
        </div>
      </div>
    </section>
  );
}