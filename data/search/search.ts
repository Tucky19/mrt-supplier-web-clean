// data/search/search.ts
import indexData from "./index.json";

type StockStatus = "in_stock" | "low_stock" | "request";

export type MiniProduct = {
  id: string;
  partNo: string;
  brand?: string;
  category?: string;
  spec?: string;
  image?: string;
  stockStatus?: StockStatus;

  // Phase 3
  matchType?: MatchType;
  matchLabel?: string;
};

export type MatchType =
  | "exact"
  | "prefix"
  | "cross"
  | "oem"
  | "token"
  | "contains"
  | "none";

type IndexV2 = {
  version: number;
  mini: Record<string, MiniProduct>;
  prefix: {
    p2?: Record<string, string[]>;
    p3?: Record<string, string[]>;
    p4?: Record<string, string[]>;
  };
  xref?: Record<string, string[]>;
  oem?: Record<string, string[]>;
  inv?: Record<string, string[]>;
};

const IDX = indexData as unknown as IndexV2;

function normCompact(s: any) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function uniq(ids: string[]) {
  return Array.from(new Set(ids));
}

function take(ids: string[], limit: number): MiniProduct[] {
  const out: MiniProduct[] = [];
  for (const id of ids) {
    const p = IDX.mini[id];
    if (!p) continue;
    out.push({ ...p });
    if (out.length >= limit) break;
  }
  return out;
}

export function searchProductsPRO(
  query: string,
  opts?: { limit?: number }
): { items: MiniProduct[] } {
  const limit = Math.max(1, Math.min(200, opts?.limit ?? 50));
  const qRaw = String(query ?? "").trim();
  if (!qRaw) return { items: [] };

  const q = normCompact(qRaw);

  // -----------------------------------
  // 1️⃣ Exact partNo
  // -----------------------------------
  for (const id in IDX.mini) {
    const p = IDX.mini[id];
    if (normCompact(p.partNo) === q) {
      return {
        items: [
          {
            ...p,
            matchType: "exact",
          },
        ],
      };
    }
  }

  // -----------------------------------
  // 2️⃣ Cross reference (แบบ A)
  // -----------------------------------
  if (IDX.xref?.[q]) {
    const ids = uniq(IDX.xref[q]);
    const items = take(ids, limit).map((p) => ({
      ...p,
      matchType: "cross" as MatchType,
      matchLabel: `Matched via Cross Reference`,
    }));
    return { items };
  }

  // -----------------------------------
  // 3️⃣ OEM part (แบบ A)
  // -----------------------------------
  if (IDX.oem?.[q]) {
    const ids = uniq(IDX.oem[q]);
    const items = take(ids, limit).map((p) => ({
      ...p,
      matchType: "oem" as MatchType,
      matchLabel: `Matched via OEM`,
    }));
    return { items };
  }

  // -----------------------------------
  // 4️⃣ Prefix 2/3/4
  // -----------------------------------
  const p2 = q.slice(0, 2);
  const p3 = q.slice(0, 3);
  const p4 = q.slice(0, 4);

  let prefixIds: string[] = [];
  if (IDX.prefix?.p4?.[p4]) prefixIds = IDX.prefix.p4[p4];
  else if (IDX.prefix?.p3?.[p3]) prefixIds = IDX.prefix.p3[p3];
  else if (IDX.prefix?.p2?.[p2]) prefixIds = IDX.prefix.p2[p2];

  if (prefixIds.length) {
    return {
      items: take(prefixIds, limit).map((p) => ({
        ...p,
        matchType: "prefix",
      })),
    };
  }

  // -----------------------------------
  // 5️⃣ Token inverted index
  // -----------------------------------
  if (IDX.inv?.[q]) {
    const ids = uniq(IDX.inv[q]);
    return {
      items: take(ids, limit).map((p) => ({
        ...p,
        matchType: "token",
      })),
    };
  }

  // -----------------------------------
  // 6️⃣ Last fallback contains scan (200-500 SKU OK)
  // -----------------------------------
  const lower = qRaw.toLowerCase();
  const containsIds = Object.keys(IDX.mini).filter((id) => {
    const p = IDX.mini[id];
    const blob = `${p.partNo} ${p.brand ?? ""} ${p.category ?? ""} ${p.spec ?? ""}`.toLowerCase();
    return blob.includes(lower);
  });

  if (containsIds.length) {
    return {
      items: take(containsIds, limit).map((p) => ({
        ...p,
        matchType: "contains",
      })),
    };
  }

  return { items: [] };
}
