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

type SearchHit = {
  product: Product;
  score: number;
  reasons: SearchReason[];
};

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePartNo(value: unknown): string {
  return normalize(value).replace(/[\s\-_/]+/g, "");
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
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
  rawQuery: string,
  mode: SearchMode
): SearchHit | null {
  const q = rawQuery.trim();
  if (!q) return null;

  const qNorm = normalize(q);
  const qPart = normalizePartNo(q);
  const qTokens = unique(tokenize(q));

  const part = normalizePartNo(product.partNo);
  const brand = normalize(product.brand);
  const category = normalize(product.category);
  const title = normalize(product.title);
  const spec = normalize(product.spec);
  const refs = (product.refs ?? []).map((ref: string) => normalizePartNo(ref));
  const refsText = normalize((product.refs ?? []).join(" "));
  const searchText = normalize(getSearchText(product));

  let score = 0;
  const reasons: SearchReason[] = [];

  const partEnabled = mode === "part" || mode === "all";
  const specEnabled = mode === "spec" || mode === "all";

  if (partEnabled) {
    if (part && qPart === part) {
      score += 1000;
      reasons.push("exact_part");
    } else if (part && qPart.length >= 2 && part.startsWith(qPart)) {
      score += 700;
      reasons.push("prefix_part");
    } else if (part && qPart.length >= 2 && part.includes(qPart)) {
      score += 420;
      reasons.push("contains_part");
    }

    if (qPart && refs.some((ref: string) => ref === qPart || ref.includes(qPart))) {
      score += 500;
      reasons.push("xref_match");
    }
  }

  if (specEnabled) {
    if (brand && brand.includes(qNorm)) {
      score += 90;
      reasons.push("brand_match");
    }

    if (category && category.includes(qNorm)) {
      score += 80;
      reasons.push("category_match");
    }

    if (title && title.includes(qNorm)) {
      score += 140;
      reasons.push("title_match");
    }

    if (spec && spec.includes(qNorm)) {
      score += 160;
      reasons.push("spec_match");
    }

    if (refsText && refsText.includes(qNorm)) {
      score += 120;
      reasons.push("xref_match");
    }

    const tokenHits = qTokens.filter((token) => searchText.includes(token)).length;
    if (tokenHits > 0) {
      score += tokenHits * 100;
      reasons.push("token_match");
    }
  }

  const qualityBonus = getQualityBonus(product);
  if (qualityBonus > 0) {
    score += qualityBonus;
    reasons.push("quality_bonus");
  }

  if (score <= 0) return null;

  return {
    product,
    score,
    reasons: unique(reasons) as SearchReason[],
  };
}

export function searchProducts(
  products: Product[],
  query: string,
  mode: SearchMode = "all",
  limit = 20
): SearchHit[] {
  const hits = products
    .map((product) => scoreProduct(product, query, mode))
    .filter((hit): hit is SearchHit => Boolean(hit))
    .sort((a, b) => b.score - a.score);

  return hits.slice(0, limit);
}