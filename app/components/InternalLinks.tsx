import Link from "next/link";

type Props = {
  partNo?: string;
  title?: string;
};
type LinkItem = {
  label: string;
  href: string;
  note?: string;
};

export default function InternalLinks({ partNo, title }: Props) {
  const pn = (partNo || "").trim();

  const items: LinkItem[] = [

    { label: "ดูสินค้า (Products)", href: "/products", note: "ค้นหาด้วย Part No. / Brand" },
    { label: "Parts Hub", href: "/parts", note: "รวมหมวดอะไหล่ที่ลูกค้าถามบ่อย" },
    { label: "Popular Parts", href: "/parts-popular", note: "รุ่นฮิต/ขายดี" },
    { label: "แบรนด์ทั้งหมด (Brands)", href: "/brands" },
    { label: "ตลับลูกปืน (Bearings)", href: "/bearings" },
    { label: "ไส้กรอง (Filters)", href: "/filters" },
    { label: "FAQ", href: "/faq", note: "คำถามที่เจอบ่อย + วิธีสั่งซื้อ" },
    { label: "ติดต่อ/ขอใบเสนอราคา", href: "/contact", note: "ส่ง Part No. แล้วขอราคาได้ทันที" },
  ];

  // เพิ่มลิงก์เฉพาะ part ถ้ามี partNo
  const partSpecific: LinkItem[] = pn
  ? [
      { label: `FAQ ของรุ่น ${pn}`, href: `/faq/${encodeURIComponent(pn)}` },
      { label: `หน้า Part ${pn}`, href: `/part/${encodeURIComponent(pn)}` },
      { label: `ค้นหา ${pn} ใน Products`, href: `/products?q=${encodeURIComponent(pn)}` },
      { label: `ขอใบเสนอราคาพร้อมใส่ ${pn}`, href: `/contact?q=${encodeURIComponent(pn)}` },
    ]
  : [];


  const merged = pn ? [...partSpecific, ...items] : items;

  return (
    <section className="mt-10 rounded-2xl border bg-white p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">
          ลิงก์ที่เกี่ยวข้อง{title ? `: ${title}` : ""}
        </h2>
        <p className="text-sm text-neutral-600">
          {pn
            ? `ต่อยอดจาก Part No. ${pn} เพื่อดูข้อมูล/FAQ/ขอราคาได้เร็วขึ้น`
            : "ช่วยให้ลูกค้าและ Google ไล่หน้าเว็บได้ง่ายขึ้น"}
        </p>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {merged.map((it) => (
          <Link
            key={it.href + it.label}
            href={it.href}
            className="rounded-xl border px-3 py-3 text-sm hover:bg-neutral-50"
          >
            <div className="font-semibold">{it.label}</div>
            {it.note ? <div className="mt-1 text-neutral-600">{it.note}</div> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
