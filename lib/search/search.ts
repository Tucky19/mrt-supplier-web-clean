type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  refs?: string[];
};

type SearchMode = "part" | "spec" | "all";

type SearchReason =
  | "exact_part"
  | "prefix_part"
  | "contains_part"
  | "xref_match"
  | "brand_match"
  | "category_match"
  | "title_match"
  | "spec_match"
  | "token_match"
  | "quality_bonus";

export type SearchHit = {
  product: Product;
  score: number;
  reasons: SearchReason[];
};

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePart(value: unknown): string {
  return normalizeText(value).replace(/[\s\-_/]+/g, "");
}

function digitsOnly(value: unknown): string {
  return String(value ?? "").replace(/\D+/g, "");
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

function addReason(reasons: string[], reason: string) {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

function getSearchText(product: Product): string {
  return [
    product.partNo,
    product.brand,
    product.category,
    product.title,
    product.spec,
    ...(product.refs ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function getQualityBonus(product: Product): number {
  let score = 0;

  if (product.title) score += 8;
  if (product.spec) score += 6;
  if (product.officialUrl) score += 8;
  if (product.refs && product.refs.length > 0) score += 5;

  return score;
}

function scoreProduct(
  product: Product,
  q: string,
  mode: SearchMode
): SearchHit | null {
  if (!q) return null;

  const qNorm = normalizeText(q);
  const qPart = normalizePart(q);
  const qDigits = digitsOnly(q);
  const qTokens = uniqueStrings(tokenize(q));

  const partNo = String(product.partNo ?? "");
  const partNorm = normalizePart(partNo);
  const partDigits = digitsOnly(partNo);

  const brandNorm = normalizeText(product.brand);
  const categoryNorm = normalizeText(product.category);
  const titleNorm = normalizeText(product.title);
  const specNorm = normalizeText(product.spec);
  const refsNorm = uniqueStrings((product.refs ?? []).map((ref: string) => normalizePart(ref)));
  const refsTextNorm = normalizeText((product.refs ?? []).join(" "));
  const textNorm = normalizeText(getSearchText(product));

  let score = 0;
  const reasons: string[] = [];

  const partEnabled = mode === "part" || mode === "all";
  const specEnabled = mode === "spec" || mode === "all";

  if (partEnabled) {
    if (qPart && qPart === partNorm) {
      score += 1000;
      addReason(reasons, "exact_part");
    } else if (qPart && qPart.length >= 2 && partNorm.startsWith(qPart)) {
      score += 700;
      addReason(reasons, "prefix_part");
    } else if (qPart && qPart.length >= 2 && partNorm.includes(qPart)) {
      score += 420;
      addReason(reasons, "contains_part");
    }

    if (qPart && refsNorm.some((ref: string) => ref === qPart || ref.includes(qPart))) {
      score += 500;
      addReason(reasons, "xref_match");
    }

    if (qDigits && partDigits && qDigits === partDigits) {
      score += 250;
      addReason(reasons, "exact_part");
    }
  }

  if (specEnabled) {
    if (brandNorm && brandNorm.includes(qNorm)) {
      score += 90;
      addReason(reasons, "brand_match");
    }

    if (categoryNorm && categoryNorm.includes(qNorm)) {
      score += 80;
      addReason(reasons, "category_match");
    }

    if (titleNorm && titleNorm.includes(qNorm)) {
      score += 140;
      addReason(reasons, "title_match");
    }

    if (specNorm && specNorm.includes(qNorm)) {
      score += 160;
      addReason(reasons, "spec_match");
    }

    if (refsTextNorm && refsTextNorm.includes(qNorm)) {
      score += 120;
      addReason(reasons, "xref_match");
    }

    const tokenHits = qTokens.filter((token) => textNorm.includes(token)).length;
    if (tokenHits > 0) {
      score += tokenHits * 100;
      addReason(reasons, "token_match");
    }
  }

  const qualityBonus = getQualityBonus(product);
  if (qualityBonus > 0) {
    score += qualityBonus;
    addReason(reasons, "quality_bonus");
  }

  if (score <= 0) return null;

  return {
    product,
    score,
    reasons: reasons as SearchReason[],
  };
}

export function searchProducts(
  products: Product[],
  q: string,
  mode: SearchMode = "all",
  limit = 20
): SearchHit[] {
  return products
    .map((product) => scoreProduct(product, q.trim(), mode))
    .filter((hit): hit is SearchHit => Boolean(hit))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}