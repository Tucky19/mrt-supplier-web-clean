import Link from "next/link";

type ReferenceRow = {
  brand: string;
  partNos: string[];
};

type SameBrandAlternativeRow = {
  brand: string;
  partNo: string;
  note?: string;
};

type Props = {
  locale: string;
  refs: string[];
  brand: string;
  currentPartNo?: string;
  sameBrandAlternatives?: SameBrandAlternativeRow[];
};

type ParsedReference = {
  brand: string;
  partNo: string;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </div>
  );
}

function normalizeBrand(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizePartNo(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function parseReference(value: string, fallbackBrand: string): ParsedReference | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const separatorIndex = raw.indexOf(":");
  if (separatorIndex === -1) {
    return {
      brand: normalizeBrand(fallbackBrand),
      partNo: normalizePartNo(raw),
    };
  }

  const parsedBrand = raw.slice(0, separatorIndex).trim();
  const parsedPartNo = raw.slice(separatorIndex + 1).trim();

  if (!parsedPartNo) return null;

  return {
    brand: normalizeBrand(parsedBrand || fallbackBrand),
    partNo: normalizePartNo(parsedPartNo),
  };
}

function addPartNo(map: Map<string, string[]>, brand: string, partNo: string) {
  const current = map.get(brand) ?? [];
  if (!current.includes(partNo)) {
    current.push(partNo);
  }
  map.set(brand, current);
}

export default function ProductCrossReferenceCards({
  locale,
  refs,
  brand,
  currentPartNo,
  sameBrandAlternatives = [],
}: Props) {
  const isThai = locale === "th";
  const normalizedCurrentBrand = normalizeBrand(brand);
  const normalizedCurrentPartNo = normalizePartNo(currentPartNo ?? "");

  const grouped = new Map<string, string[]>();

  sameBrandAlternatives
    .filter(
      (item) =>
        item &&
        item.brand.trim().length > 0 &&
        item.partNo.trim().length > 0 &&
        normalizePartNo(item.partNo) !== normalizedCurrentPartNo,
    )
    .forEach((item) => {
      addPartNo(grouped, item.brand.trim(), item.partNo.trim());
    });

  refs
    .map((value) => parseReference(value, brand))
    .filter((item): item is ParsedReference => Boolean(item))
    .filter((item) => item.partNo !== normalizedCurrentPartNo)
    .forEach((item) => {
      const alreadyIncludedAsSameBrand =
        item.brand === normalizedCurrentBrand &&
        (grouped.get(brand) ?? []).some(
          (partNo) => normalizePartNo(partNo) === item.partNo,
        );

      if (!alreadyIncludedAsSameBrand) {
        addPartNo(grouped, item.brand, item.partNo);
      }
    });

  const rows: ReferenceRow[] = Array.from(grouped.entries()).map(
    ([rowBrand, partNos]) => ({
      brand: rowBrand,
      partNos,
    }),
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-slate-300 bg-white px-4 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.04)] sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {isThai ? "ต้องการหาเบอร์เทียบ?" : "Need a cross reference?"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {isThai
                ? "ส่งข้อมูลให้ทีมช่วยตรวจสอบเบอร์เทียบที่เหมาะสม"
                : "Send details and our team can help identify a suitable interchange."}
            </p>
          </div>

          <Link
            href={`/${locale}/products?request=1#missing-product-request`}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {isThai ? "ส่งข้อมูลให้ทีมช่วยหาเทียบ" : "Send details"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="h-1 w-full bg-[linear-gradient(90deg,#cbdff7_0%,#dceafc_55%,#eef5ff_100%)]" />
        <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-4 sm:px-6">
          {!isThai ? <SectionLabel>Interchange</SectionLabel> : null}
          <h2 className={`${!isThai ? "mt-1.5" : ""} text-lg font-semibold tracking-[-0.02em] text-slate-950`}>
            Interchange
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Alternative Part Numbers</p>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="overflow-x-auto rounded-[22px] border border-slate-200 bg-slate-50/40">
            <div className="min-w-[560px]">
              <div
                className="grid border-b border-slate-200 bg-slate-100/90"
                style={{
                  gridTemplateColumns: "minmax(200px,0.95fr) minmax(220px,1.05fr)",
                }}
              >
                <div className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600">
                  Brand / Manufacturer
                </div>
                <div className="whitespace-nowrap border-l border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600">
                  Part No.
                </div>
              </div>

              <div className="divide-y divide-slate-200 bg-white">
                {rows.map((row) => (
                  <div
                    key={`${row.brand}-${row.partNos.join(",")}`}
                    className="grid items-start"
                    style={{
                      gridTemplateColumns: "minmax(200px,0.95fr) minmax(220px,1.05fr)",
                    }}
                  >
                    <div className="break-words px-4 py-3.5 text-sm font-semibold leading-6 text-slate-800">
                      {row.brand}
                    </div>
                    <div className="border-l border-slate-200 px-4 py-3.5 text-sm leading-6 text-slate-700">
                      <span className="font-mono text-[13px] sm:text-sm">
                        {row.partNos.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-slate-200 bg-slate-50/85 px-4 py-3 text-sm leading-6 text-slate-600">
        {isThai
          ? "ข้อมูล Interchange ใช้สำหรับอ้างอิงเบื้องต้น ทีมงานจะตรวจสอบความเข้ากันได้ของสเปก ขนาด เกลียว และการใช้งานก่อนเสนอราคา"
          : "Interchange data is for preliminary reference. Our team reviews specification, size, thread, and application compatibility before quoting."}
      </div>
    </div>
  );
}
