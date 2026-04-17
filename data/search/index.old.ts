// data/search/index.old.ts

import { products } from "@/data/products";


/**
 * Mini record returned to UI (fast)
 * - Make sure this matches what Products page expects
 */
export type MiniProduct = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  spec?: string;

  
  stockQty?: number;         // ✅ optional

  // optional helpers if your product data has these
  searchTokens?: string[];
};

export type MatchType = "exact" | "prefix" | "contains" | "token" | "batch" | "none";

function safeStr(v: any) {
  return String(v ?? "");
}

function norm(s: any) {
  return safeStr(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function tokenizeLoose(s: any): string[] {
  // for "OD 93mm × L 173mm × 1-12 UN" -> ["od","93mm","l","173mm","1-12","un"]
  return safeStr(s)
    .toLowerCase()
    .replace(/[×x]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toMini(p: any): MiniProduct {
  return {
    id: safeStr(p.id),
    partNo: safeStr(p.partNo ?? p.part_no),
    brand: safeStr(p.brand),
    title: safeStr(p.title ?? p.product_name ?? p.name),
    category: safeStr(p.category),
    spec: safeStr(p.spec),

   
    stockQty: typeof p.stockQty === "number" ? p.stockQty : (typeof p.stock_qty === "number" ? p.stock_qty : undefined),

    searchTokens: Array.isArray(p.searchTokens) ? p.searchTokens : undefined,
  };
}

function searchableText(p: any) {
  // include tokens if present
  const base =
    `${p.partNo ?? p.part_no ?? ""} ` +
    `${p.brand ?? ""} ` +
    `${p.title ?? p.product_name ?? p.name ?? ""} ` +
    `${p.category ?? ""} ` +
    `${p.spec ?? ""}`;
  const extra = Array.isArray(p.searchTokens) ? ` ${p.searchTokens.join(" ")}` : "";
  return (base + extra).toLowerCase();
}

function dedupeById(xs: MiniProduct[]) {
  const m = new Map<string, MiniProduct>();
  for (const it of xs) m.set(it.id, it);
  return Array.from(m.values());
}

/**
 * Search a single query string
 * Priority:
 * 1) exact partNo
 * 2) prefix partNo
 * 3) token match (any token hits in searchableText)
 * 4) contains match (substring in searchableText)
 */
function searchOne(query: string, limit: number): { items: MiniProduct[]; matchType: MatchType } {
  const raw = safeStr(query).trim();
  const qn = norm(raw);
  if (qn.length < 2) return { items: [], matchType: "none" };

  // 1) exact partNo
  {
    const hit = (products as any[]).filter((p) => norm(p.partNo ?? p.part_no) === qn);
    if (hit.length) return { items: hit.slice(0, limit).map(toMini), matchType: "exact" };
  }

  // 2) prefix partNo
  {
    const hit = (products as any[]).filter((p) => norm(p.partNo ?? p.part_no).startsWith(qn));
    if (hit.length) return { items: hit.slice(0, limit).map(toMini), matchType: "prefix" };
  }

  // 3) token match (good for OD93 / 93mm / 1-12)
  {
    const toks = tokenizeLoose(raw);
    if (toks.length) {
      const scored: Array<{ s: number; p: any }> = [];

      for (const p of products as any[]) {
        const text = searchableText(p);

        let s = 0;
        for (const t of toks) {
          // strong bonus for partNo token hits
          if (norm(p.partNo ?? p.part_no).includes(norm(t))) s += 50;
          if (text.includes(t)) s += 10;
        }

        if (s > 0) scored.push({ s, p });
      }

      scored.sort((a, b) => b.s - a.s);

      if (scored.length) {
        return {
          items: scored.slice(0, limit).map((x) => toMini(x.p)),
          matchType: "token",
        };
      }
    }
  }

  // 4) contains (fallback)
  {
    const qLower = raw.toLowerCase();
    const hit = (products as any[]).filter((p) => searchableText(p).includes(qLower));
    if (hit.length) return { items: hit.slice(0, limit).map(toMini), matchType: "contains" };
  }

  return { items: [], matchType: "none" };
}

/**
 * MAIN: supports batch (comma-separated) for Paste List
 * Example q: "P550388,P551381,93mm"
 */
export function searchProductsPRO(
  q: string,
  opts?: { limit?: number }
): { items: MiniProduct[]; matchType: MatchType } {
  const limit = Math.max(1, Math.min(200, Number(opts?.limit ?? 50)));
  const raw = safeStr(q).trim();
  if (!raw) return { items: [], matchType: "none" };

  const queries = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // single query
  if (queries.length === 1) {
    return searchOne(queries[0], limit);
  }

  // batch query: search each, then merge + dedupe
  let all: MiniProduct[] = [];
  let firstType: MatchType = "batch";

  for (const one of queries) {
    const r = searchOne(one, limit);
    if (firstType === "batch" && r.matchType !== "none") firstType = r.matchType;
    all.push(...r.items);
  }

  all = dedupeById(all);

  return {
    items: all.slice(0, limit),
    matchType: "batch",
  };
}

// Optional alias (ถ้าบางไฟล์ import ชื่อ searchProducts)
export { searchProductsPRO as searchProducts };
