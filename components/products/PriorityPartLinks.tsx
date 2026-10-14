import Link from "next/link";

export default function PriorityPartLinks({ locale }: { locale: string }) {
  const isThai = locale === "th";
  return (
    <nav aria-label={isThai ? "ตรวจสอบสเปกตามเบอร์สินค้า" : "Check specifications by part number"} className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="text-base font-semibold text-[var(--color-text)]">
        {isThai ? "ตรวจสอบสเปกตามเบอร์สินค้า" : "Check specifications by part number"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
        {isThai ? "เปิดข้อมูลของแต่ละเบอร์เพื่อตรวจสอบสเปกก่อนขอราคา" : "Review each part's specifications before requesting a quotation."}
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {["R000958", "P550520", "P553000"].map((partNo) => (
          <li key={partNo}>
            <Link href={`/${locale}/products/${partNo}`} className="font-medium text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]">
              {partNo} {isThai ? "ดูสเปกและขอราคา" : "specifications and RFQ"}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
