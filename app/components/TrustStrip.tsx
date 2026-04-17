export default function TrustStrip() {
  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <div className="text-sm font-semibold text-slate-100">Authentic & Traceable</div>
          <div className="mt-1 text-sm text-slate-300">
            สินค้าแบรนด์ชั้นนำ + ข้อมูลสเปกตรวจสอบได้
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <div className="text-sm font-semibold text-slate-100">Search-First B2B</div>
          <div className="mt-1 text-sm text-slate-300">
            ค้นหา Part No. ก่อนเห็นผลลัพธ์ ลดการโดน scrape
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <div className="text-sm font-semibold text-slate-100">Fast RFQ</div>
          <div className="mt-1 text-sm text-slate-300">
            เพิ่มรายการ → ส่งขอราคา → เก็บลงชีตอัตโนมัติ
          </div>
        </div>
      </div>
    </section>
  );
}
