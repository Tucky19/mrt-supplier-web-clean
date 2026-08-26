import Link from "next/link";
import {
  type ProductRelation,
  isPreliminaryRelation,
} from "@/lib/products/relations";

type ReferenceRow = {
  brand: string;
  items: ReferenceItem[];
};

type ReferenceItem = {
  brand: string;
  partNo: string;
  relationType: ProductRelation["relationType"];
  verificationStatus: ProductRelation["verificationStatus"];
  note?: string;
};

type SameBrandAlternativeRow = {
  brand: string;
  partNo: string;
  note?: string;
};

type Props = {
  locale: string;
  relations: ProductRelation[];
  brand: string;
  currentPartNo?: string;
  sameBrandAlternatives?: SameBrandAlternativeRow[];
};

type ParsedReference = {
  brand: string;
  partNo: string;
};

const KNOWN_REFERENCE_BRANDS = [
  "Fleetguard",
  "Donaldson",
  "MANN-FILTER",
  "Baldwin",
  "Mahle",
  "Hengst",
  "Caterpillar",
  "KOMATSU",
  "COMPAIR",
];

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

function parseReference(
  value: string,
  fallbackBrand: string,
): ParsedReference | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const separatorIndex = raw.indexOf(":");
  if (separatorIndex !== -1) {
    const parsedBrand = raw.slice(0, separatorIndex).trim();
    const parsedPartNo = raw.slice(separatorIndex + 1).trim();

    if (!parsedPartNo) return null;

    return {
      brand: normalizeBrand(parsedBrand || fallbackBrand),
      partNo: normalizePartNo(parsedPartNo),
    };
  }

  const knownBrand = KNOWN_REFERENCE_BRANDS.find((candidate) =>
    raw.toLowerCase().startsWith(`${candidate.toLowerCase()} `),
  );

  if (knownBrand) {
    return {
      brand: normalizeBrand(knownBrand),
      partNo: normalizePartNo(raw.slice(knownBrand.length).trim()),
    };
  }

  return {
    brand: normalizeBrand(fallbackBrand),
    partNo: normalizePartNo(raw),
  };
}

function relationToReferenceItem(
  relation: ProductRelation,
  fallbackBrand: string,
): ReferenceItem | null {
  const parsed = parseReference(relation.partNumber, relation.brand ?? fallbackBrand);
  if (!parsed) return null;

  return {
    brand: relation.brand ? normalizeBrand(relation.brand) : parsed.brand,
    partNo: relation.brand ? normalizePartNo(relation.partNumber) : parsed.partNo,
    relationType: relation.relationType,
    verificationStatus: relation.verificationStatus,
    note: relation.note,
  };
}

function relationFromSameBrandAlternative(
  item: SameBrandAlternativeRow,
): ReferenceItem {
  return {
    brand: normalizeBrand(item.brand),
    partNo: normalizePartNo(item.partNo),
    relationType: "alternative",
    verificationStatus: "pending",
    note: item.note,
  };
}

function addReferenceItem(map: Map<string, ReferenceItem[]>, item: ReferenceItem) {
  const current = map.get(item.brand) ?? [];
  if (!current.some((currentItem) => currentItem.partNo === item.partNo)) {
    current.push(item);
  }
  map.set(item.brand, current);
}

function isPreliminaryItem(item: ReferenceItem) {
  return isPreliminaryRelation({
    partNumber: item.partNo,
    brand: item.brand,
    relationType: item.relationType,
    verificationStatus: item.verificationStatus,
    note: item.note,
  });
}

function statusLabel(item: ReferenceItem, isThai: boolean) {
  if (isPreliminaryItem(item)) {
    return isThai ? "เบื้องต้น" : "Preliminary";
  }

  return isThai ? "ยืนยันแล้ว" : "Verified";
}

export default function ProductCrossReferenceCards({
  locale,
  relations,
  brand,
  currentPartNo,
  sameBrandAlternatives = [],
}: Props) {
  const isThai = locale === "th";
  const normalizedCurrentBrand = normalizeBrand(brand);
  const normalizedCurrentPartNo = normalizePartNo(currentPartNo ?? "");

  const grouped = new Map<string, ReferenceItem[]>();

  sameBrandAlternatives
    .filter(
      (item) =>
        item &&
        item.brand.trim().length > 0 &&
        item.partNo.trim().length > 0 &&
        normalizePartNo(item.partNo) !== normalizedCurrentPartNo,
    )
    .map(relationFromSameBrandAlternative)
    .forEach((item) => {
      addReferenceItem(grouped, item);
    });

  relations
    .map((relation) => relationToReferenceItem(relation, brand))
    .filter((item): item is ReferenceItem => Boolean(item))
    .filter((item) => item.partNo !== normalizedCurrentPartNo)
    .forEach((item) => {
      const alreadyIncludedAsSameBrand =
        item.brand === normalizedCurrentBrand &&
        (grouped.get(normalizedCurrentBrand) ?? []).some(
          (currentItem) => currentItem.partNo === item.partNo,
        );

      if (!alreadyIncludedAsSameBrand) {
        addReferenceItem(grouped, item);
      }
    });

  const rows: ReferenceRow[] = Array.from(grouped.entries()).map(
    ([rowBrand, items]) => ({
      brand: rowBrand,
      items,
    }),
  );
  const hasPreliminaryReference = rows.some((row) =>
    row.items.some(isPreliminaryItem),
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
          {!isThai ? (
            <SectionLabel>
              {hasPreliminaryReference ? "References" : "Interchange"}
            </SectionLabel>
          ) : null}
          <h2 className={`${!isThai ? "mt-1.5" : ""} text-lg font-semibold tracking-[-0.02em] text-slate-950`}>
            {hasPreliminaryReference
              ? isThai
                ? "เบอร์อ้างอิง"
                : "Reference Part Numbers"
              : "Interchange"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {hasPreliminaryReference
              ? isThai
                ? "บางรายการเป็นเบอร์อ้างอิงเบื้องต้นและต้องตรวจสอบการใช้งานก่อนสั่งซื้อ"
                : "Some references are preliminary and must be checked for application before ordering."
              : "Alternative Part Numbers"}
          </p>
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
                    key={`${row.brand}-${row.items.map((item) => item.partNo).join(",")}`}
                    className="grid items-start"
                    style={{
                      gridTemplateColumns: "minmax(200px,0.95fr) minmax(220px,1.05fr)",
                    }}
                  >
                    <div className="break-words px-4 py-3.5 text-sm font-semibold leading-6 text-slate-800">
                      {row.brand}
                    </div>
                    <div className="space-y-2 border-l border-slate-200 px-4 py-3.5 text-sm leading-6 text-slate-700">
                      {row.items.map((item) => (
                        <div
                          key={`${row.brand}-${item.partNo}`}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="font-mono text-[13px] sm:text-sm">
                            {item.partNo}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                              isPreliminaryItem(item)
                                ? "border-amber-200 bg-amber-50 text-amber-900"
                                : "border-emerald-200 bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            {statusLabel(item, isThai)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasPreliminaryReference ? (
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {isThai
            ? "เบอร์อ้างอิงเบื้องต้น: กรุณาตรวจสอบขนาด เกลียว และการใช้งานก่อนสั่งซื้อ"
            : "Preliminary reference: verify dimensions, thread, and application before ordering."}
        </div>
      ) : (
        <div className="rounded-[20px] border border-slate-200 bg-slate-50/85 px-4 py-3 text-sm leading-6 text-slate-600">
          {isThai
            ? "ข้อมูล Interchange ใช้สำหรับอ้างอิงเบื้องต้น ทีมงานจะตรวจสอบความเข้ากันได้ของสเปก ขนาด เกลียว และการใช้งานก่อนเสนอราคา"
            : "Interchange data is for preliminary reference. Our team reviews specification, size, thread, and application compatibility before quoting."}
        </div>
      )}
    </div>
  );
}
