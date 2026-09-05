import { gaOfficialReferenceClick } from "@/lib/analytics/ga";

type ProductOfficialReferenceProps = {
  locale: string;
  itemId: string;
  itemBrand?: string;
  officialUrl?: string;
};

export default function ProductOfficialReference({
  locale,
  itemId,
  itemBrand,
  officialUrl,
}: ProductOfficialReferenceProps) {
  if (!officialUrl) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {locale === "th" ? "ข้อมูลสินค้าทางการ" : "Official Product Information"}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {locale === "th"
          ? "ตรวจสอบรายละเอียดและสเปกจากหน้าสินค้าทางการก่อนส่ง RFQ"
          : "Verify product details and specifications on the official product page before sending an RFQ."}
      </p>
      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          gaOfficialReferenceClick({
            item_id: itemId,
            item_brand: itemBrand,
            source: "product_detail",
          });
        }}
        className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        {locale === "th" ? "เปิดหน้าผู้ผลิต" : "Open Official Page"}
      </a>
    </div>
  );
}
