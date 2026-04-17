import { products } from "@/data/products/index";

type ProductLike = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  crossRefs?: string[];
};

export type AutocompleteItem = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  score: number;
};

function safeStr(v: unknown): string {
  return String(v ?? "").trim();
}

function normalizeLoose(v: unknown): string {
  return safeStr(v)
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/[-.]+/g, "")
    .replace(/\s+/g, " ");
}

function normalizeTight(v: unknown): string {
  return safeStr(v)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function uniqueStrings(values: Array<unknown>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const s = safeStr(value);
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }

  return out;
}

function scoreAutocomplete(product: ProductLike, rawQuery: string): number {
  const query = safeStr(rawQuery);
  if (!query) return 0;

  const looseQuery = normalizeLoose(query);
  const tightQuery = normalizeTight(query);

  const partNo = safeStr(product.partNo);
  const brand = safeStr(product.brand);
  const title = safeStr(product.title);
  const category = safeStr(product.category);
  const crossRefs = uniqueStrings(product.crossRefs ?? []);

  const partLoose = normalizeLoose(partNo);
  const partTight = normalizeTight(partNo);
  const brandLoose = normalizeLoose(brand);
  const titleLoose = normalizeLoose(title);
  const categoryLoose = normalizeLoose(category);

  let score = 0;

  if (partNo.toLowerCase() === query.toLowerCase()) score += 1500;
  if (partTight && partTight === tightQuery) score += 1300;

  if (tightQuery && partTight.startsWith(tightQuery) && partTight !== tightQuery) {
    score += 1000 - Math.min(200, Math.max(0, partTight.length - tightQuery.length) * 10);
  }

  if (
    tightQuery &&
    partTight.includes(tightQuery) &&
    !partTight.startsWith(tightQuery) &&
    partTight !== tightQuery
  ) {
    score += 700;
  }

  for (const ref of crossRefs) {
    const refLoose = normalizeLoose(ref);
    const refTight = normalizeTight(ref);

    if (ref.toLowerCase() === query.toLowerCase()) {
      score += 800;
      break;
    }
    if (refTight && refTight === tightQuery) {
      score += 760;
      break;
    }
    if (tightQuery && refTight.startsWith(tightQuery)) {
      score += 620;
      break;
    }
    if (looseQuery && refLoose.includes(looseQuery)) {
      score += 450;
      break;
    }
  }

  if (brandLoose && looseQuery && brandLoose.includes(looseQuery)) score += 220;
  if (titleLoose && looseQuery && titleLoose.includes(looseQuery)) score += 180;
  if (categoryLoose && looseQuery && categoryLoose.includes(looseQuery)) score += 80;
  if (partLoose && looseQuery && partLoose.includes(looseQuery)) score += 40;

  return score;
}

export function autocompleteProducts(
  query: string,
  limit = 8
): AutocompleteItem[] {
  const q = safeStr(query);
  if (!q) return [];

  const scored = (products as ProductLike[])
    .map((product) => ({
      id: product.id,
      partNo: safeStr(product.partNo),
      brand: safeStr(product.brand) || undefined,
      title: safeStr(product.title) || undefined,
      category: safeStr(product.category) || undefined,
      score: scoreAutocomplete(product, q),
    }))
    .filter((item) => item.score > 0);

  const deduped = new Map<string, AutocompleteItem>();
  for (const item of scored) {
    const key = item.id || item.partNo;
    const existing = deduped.get(key);
    if (!existing || item.score > existing.score) {
      deduped.set(key, item);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return a.partNo.localeCompare(b.partNo, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    })
    .slice(0, Math.max(1, limit));
}