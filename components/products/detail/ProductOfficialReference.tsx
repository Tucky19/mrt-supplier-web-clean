type ProductOfficialReferenceProps = {
  locale: string;
  officialUrl?: string;
};

export default function ProductOfficialReference({
  locale,
  officialUrl,
}: ProductOfficialReferenceProps) {
  if (!officialUrl) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {locale === "th" ? "Official Reference" : "Official Reference"}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {locale === "th"
          ? "ใช้ข้อมูลจากผู้ผลิตเพื่อช่วยตรวจสอบรายละเอียดและความเข้ากันได้เพิ่มเติมก่อนส่ง RFQ"
          : "Use the manufacturer page to verify details and compatibility before sending an RFQ."}
      </p>
      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        {locale === "th" ? "เปิด Official Page" : "Open Official Page"}
      </a>
    </div>
  );
}
