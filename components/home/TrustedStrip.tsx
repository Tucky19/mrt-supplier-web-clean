export default function TrustedStrip() {
  const items = [
    "อะไหล่แท้ / Genuine Parts",
    "รองรับเบอร์เทียบ Cross Reference",
    "รองรับงานจัดซื้อ B2B / RFQ",
    "พร้อมค้นหาด้วย Part Number และรุ่นเครื่อง",
  ];

  return (
    <section className="border-b border-neutral-200 bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-3 text-sm font-semibold text-neutral-800">
          Trusted by industrial teams
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}