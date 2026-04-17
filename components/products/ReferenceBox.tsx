import Link from "next/link";
import { products } from "@/data/products";

type CrossRef = { brand: string; partNo: string };
type ReferenceInput =
  | CrossRef[]
  | Record<string, Array<{ partNo: string } | string>>
  | undefined;

function safeStr(v: any) {
  return String(v ?? "").trim();
}

function norm(s: any) {
  return safeStr(s)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function normalizeRefs(refs: ReferenceInput): Array<{ label: string; items: CrossRef[] }> {
  if (!refs) return [];

  // A) flat array: [{brand, partNo}]
  if (Array.isArray(refs)) {
    const items = refs
      .filter((x: any) => x && x.partNo)
      .map((x: any) => ({
        brand: safeStr(x.brand || "Cross Ref"),
        partNo: safeStr(x.partNo),
      }))
      .filter((x) => x.partNo);

    return items.length ? [{ label: "Cross Reference", items }] : [];
  }

  // B) grouped object: { Fleetguard: ["LF667"] } or { Fleetguard: [{partNo:"LF667"}] }
  const groups: Array<{ label: string; items: CrossRef[] }> = [];

  for (const [brand, raw] of Object.entries(refs)) {
    const arr = Array.isArray(raw) ? raw : [];
    const items: CrossRef[] = arr
      .map((v: any) => {
        if (typeof v === "string") return { brand, partNo: safeStr(v) };
        if (v && typeof v === "object" && v.partNo) return { brand, partNo: safeStr(v.partNo) };
        return null;
      })
      .filter(Boolean) as CrossRef[];

    if (items.length) groups.push({ label: brand, items });
  }

  return groups;
}

export default function ReferenceBox({
  productId,
  partNo,
  refs,
  title = "Cross Reference",
}: {
  productId?: string;
  partNo?: string;
  refs?: ReferenceInput; // optional override
  title?: string;
}) {
  // หา product ถ้าไม่ได้ส่ง refs มาเอง
  const p =
    (products as any[]).find((x) => productId && norm(x?.id) === norm(productId)) ||
    (products as any[]).find((x) => partNo && norm(x?.partNo) === norm(partNo));

  const inputRefs: ReferenceInput =
    refs ??
    (p as any)?.cross_reference ??
    (p as any)?.crossReference ??
    (p as any)?.references;

  const groups = normalizeRefs(inputRefs);
  if (!groups.length) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>

        {(p as any)?.partNo ? (
          <Link
            href={`/products/${encodeURIComponent((p as any).id ?? (p as any).partNo)}`}
            className="text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
          >
            View product
          </Link>
        ) : null}
      </div>

      <div className="mt-3 space-y-4">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="text-sm font-semibold text-neutral-800">{g.label}</div>

            <div className="mt-2 flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span
                  key={`${it.brand}-${it.partNo}`}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-800"
                >
                  <span className="opacity-70">{it.brand}</span>
                  <span className="font-semibold">{it.partNo}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}