import { getSynonymExpansions } from "@/lib/search/synonyms";

export type SearchMode = "part" | "spec" | "all";
export type QueryIntent = "part" | "keyword" | "mixed";

export type SearchableProduct = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  stockStatus?: "in_stock" | "low_stock" | "request";
  refs?: string[];
};

export type SearchHit<TProduct extends SearchableProduct = SearchableProduct> = {
  product: TProduct;
  score: number;
  reasons: string[];
};

const SCORE = {
  PART_EXACT: 1400,
  XREF_EXACT: 1180,

  PART_PREFIX: 820,
  XREF_PREFIX: 720,

  PART_CONTAINS: 480,
  XREF_CONTAINS: 430,

  TOKEN_PART: 150,
  TOKEN_XREF: 120,
  TOKEN_BRAND: 90,
  TOKEN_CATEGORY: 80,
  TOKEN_TITLE: 75,
  TOKEN_SPEC: 55,

  MULTI_TOKEN_2: 180,
  MULTI_TOKEN_3: 120,

  FIELD_COVERAGE_2: 100,
  FIELD_COVERAGE_3: 80,

  SPEC_EXACT: 240,
  SPEC_TOKEN: 140,
  SPEC_TITLE: 95,
  SPEC_CATEGORY: 85,
  SPEC_BRAND: 60,
  SPEC_PART: 40,

  TYPO_NEAR: 160,
} as const;

function normalize(value: string | undefined | null): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/-/g, "")
    .replace(/\s+/g, " ");
}

function compactNormalize(value: string | undefined | null): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_/]+/g, "");
}

function tokenize(value: string): string[] {
  return normalize(value).split(" ").filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildSearchTexts(product: SearchableProduct) {
  const partNo = product.partNo ?? "";
  const brand = product.brand ?? "";
  const category = product.category ?? "";
  const title = product.title ?? "";
  const spec = product.spec ?? "";
  const refs = product.refs ?? [];

  return {
    partNo,
    brand,
    category,
    title,
    spec,
    refs,

    partNoNorm: normalize(partNo),
    brandNorm: normalize(brand),
    categoryNorm: normalize(category),
    titleNorm: normalize(title),
    specNorm: normalize(spec),
    refsNorm: refs.map((ref) => normalize(ref)),

    partNoCompact: compactNormalize(partNo),
    refsCompact: refs.map((ref) => compactNormalize(ref)),

    blob: normalize([partNo, brand, category, title, spec, ...refs].join(" ")),
  };
}

export function detectQueryIntent(query: string): QueryIntent {
  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const hasDigit = /[0-9]/.test(q);
  const hasLetter = /[a-z]/i.test(q);
  const hasThai = /[\u0E00-\u0E7F]/.test(q);

  if (tokens.length === 1 && hasDigit && (hasLetter || !hasThai)) {
    return "part";
  }

  if (tokens.length >= 2 && hasDigit && hasLetter) {
    return "mixed";
  }

  return "keyword";
}

function getIntentMultiplier(
  intent: QueryIntent,
  field:
    | "part"
    | "xref"
    | "brand"
    | "category"
    | "title"
    | "spec"
    | "typo"
): number {
  if (intent === "part") {
    if (field === "part" || field === "xref") return 1.2;
    if (
      field === "brand" ||
      field === "category" ||
      field === "title" ||
      field === "spec"
    ) {
      return 0.8;
    }
    if (field === "typo") return 0.9;
  }

  if (intent === "keyword") {
    if (field === "title" || field === "category" || field === "spec") return 1.15;
    if (field === "part" || field === "xref") return 0.9;
    if (field === "brand") return 1;
    if (field === "typo") return 0.75;
  }

  if (intent === "mixed") {
    if (field === "part" || field === "xref") return 1.1;
    if (
      field === "brand" ||
      field === "category" ||
      field === "title" ||
      field === "spec"
    ) {
      return 1;
    }
    if (field === "typo") return 0.85;
  }

  return 1;
}

function getTokenWeight(token: string): number {
  const genericTokens = new Set([
    "filter",
    "oil",
    "air",
    "fuel",
    "part",
    "item",
    "สินค้า",
    "อะไหล่",
  ]);

  if (/^\d+(mm|cm|in|μ|um)?$/.test(token)) return 1.35;
  if (/[0-9]/.test(token) && /[a-z]/i.test(token)) return 1.4;
  if (token.length >= 6) return 1.15;
  if (genericTokens.has(token)) return 0.75;

  return 1;
}

function minScoreForIntent(intent: QueryIntent, mode: SearchMode): number {
  if (mode === "part") {
    if (intent === "part") return 120;
    if (intent === "mixed") return 100;
    return 90;
  }

  if (mode === "spec") {
    if (intent === "keyword") return 90;
    if (intent === "mixed") return 100;
    return 110;
  }

  if (intent === "part") return 120;
  if (intent === "mixed") return 100;
  return 90;
}

function applyScore(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}

function editDistanceWithinOne(a: string, b: string): boolean {
  if (!a || !b) return false;

  const al = a.length;
  const bl = b.length;

  if (Math.abs(al - bl) > 1) return false;
  if (a === b) return true;

  let i = 0;
  let j = 0;
  let edits = 0;

  while (i < al && j < bl) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (al > bl) {
      i += 1;
    } else if (bl > al) {
      j += 1;
    } else {
      i += 1;
      j += 1;
    }
  }

  if (i < al || j < bl) {
    edits += 1;
  }

  return edits <= 1;
}

function scorePartMode(
  product: SearchableProduct,
  rawQuery: string,
  normalizedQuery: string,
  compactQuery: string,
  expandedQueries: string[],
  intent: QueryIntent
): SearchHit<SearchableProduct> | null {
  const texts = buildSearchTexts(product);
  const tokens = uniqueStrings([
    ...tokenize(rawQuery),
    ...expandedQueries.flatMap(tokenize),
  ]);

  let score = 0;
  const reasons: string[] = [];
  let matchedTokens = 0;
  const matchedFields = new Set<string>();

  if (!compactQuery) return null;

  // Exact part number should dominate.
  if (texts.partNoCompact === compactQuery) {
    score += applyScore(SCORE.PART_EXACT, getIntentMultiplier(intent, "part"));
    reasons.push("partNo:exact");
    matchedFields.add("partNo");
  }

  if (texts.refsCompact.includes(compactQuery)) {
    score += applyScore(SCORE.XREF_EXACT, getIntentMultiplier(intent, "xref"));
    reasons.push("xref:exact");
    matchedFields.add("xref");
  }

  if (
    texts.partNoCompact.startsWith(compactQuery) &&
    compactQuery.length >= 2 &&
    texts.partNoCompact !== compactQuery
  ) {
    score += applyScore(SCORE.PART_PREFIX, getIntentMultiplier(intent, "part"));
    reasons.push("partNo:prefix");
    matchedFields.add("partNo");
  }

  if (
    texts.refsCompact.some(
      (ref) => ref.startsWith(compactQuery) && compactQuery.length >= 2 && ref !== compactQuery
    )
  ) {
    score += applyScore(SCORE.XREF_PREFIX, getIntentMultiplier(intent, "xref"));
    reasons.push("xref:prefix");
    matchedFields.add("xref");
  }

  if (
    texts.partNoCompact.includes(compactQuery) &&
    compactQuery.length >= 3 &&
    !texts.partNoCompact.startsWith(compactQuery)
  ) {
    score += applyScore(SCORE.PART_CONTAINS, getIntentMultiplier(intent, "part"));
    reasons.push("partNo:contains");
    matchedFields.add("partNo");
  }

  if (
    texts.refsCompact.some(
      (ref) =>
        ref.includes(compactQuery) &&
        compactQuery.length >= 3 &&
        !ref.startsWith(compactQuery)
    )
  ) {
    score += applyScore(SCORE.XREF_CONTAINS, getIntentMultiplier(intent, "xref"));
    reasons.push("xref:contains");
    matchedFields.add("xref");
  }

  for (const token of tokens) {
    if (!token) continue;

    const tokenWeight = getTokenWeight(token);
    let tokenMatched = false;

    if (texts.partNoNorm.includes(token)) {
      score += applyScore(
        SCORE.TOKEN_PART * tokenWeight,
        getIntentMultiplier(intent, "part")
      );
      tokenMatched = true;
      matchedFields.add("partNo");
    }

    if (texts.refsNorm.some((ref) => ref.includes(token))) {
      score += applyScore(
        SCORE.TOKEN_XREF * tokenWeight,
        getIntentMultiplier(intent, "xref")
      );
      tokenMatched = true;
      matchedFields.add("xref");
    }

    if (texts.brandNorm.includes(token)) {
      score += applyScore(
        SCORE.TOKEN_BRAND * tokenWeight,
        getIntentMultiplier(intent, "brand")
      );
      tokenMatched = true;
      matchedFields.add("brand");
    }

    if (texts.categoryNorm.includes(token)) {
      score += applyScore(
        SCORE.TOKEN_CATEGORY * tokenWeight,
        getIntentMultiplier(intent, "category")
      );
      tokenMatched = true;
      matchedFields.add("category");
    }

    if (texts.titleNorm.includes(token)) {
      score += applyScore(
        SCORE.TOKEN_TITLE * tokenWeight,
        getIntentMultiplier(intent, "title")
      );
      tokenMatched = true;
      matchedFields.add("title");
    }

    if (texts.specNorm.includes(token)) {
      score += applyScore(
        SCORE.TOKEN_SPEC * tokenWeight,
        getIntentMultiplier(intent, "spec")
      );
      tokenMatched = true;
      matchedFields.add("spec");
    }

    if (tokenMatched) {
      matchedTokens += 1;
    }
  }

  if (matchedTokens >= 2) {
    score += SCORE.MULTI_TOKEN_2;
    reasons.push("multiToken:2+");
  }

  if (matchedTokens >= 3) {
    score += SCORE.MULTI_TOKEN_3;
    reasons.push("multiToken:3+");
  }

  if (matchedFields.size >= 2) {
    score += SCORE.FIELD_COVERAGE_2;
    reasons.push("fieldCoverage:2+");
  }

  if (matchedFields.size >= 3) {
    score += SCORE.FIELD_COVERAGE_3;
    reasons.push("fieldCoverage:3+");
  }

  const typoCandidate =
    compactQuery.length >= 5 &&
    (editDistanceWithinOne(texts.partNoCompact, compactQuery) ||
      texts.refsCompact.some((ref) => editDistanceWithinOne(ref, compactQuery)));

  if (typoCandidate) {
    score += applyScore(SCORE.TYPO_NEAR, getIntentMultiplier(intent, "typo"));
    reasons.push("typo:near");
  }

  // Small bonus when normalized exact string matches whole normalized part no.
  if (texts.partNoNorm === normalizedQuery) {
    score += 40;
    reasons.push("partNo:normExact");
  }

  if (score < minScoreForIntent(intent, "part")) return null;

  return {
    product,
    score,
    reasons: uniqueStrings(reasons),
  };
}

function scoreSpecMode(
  product: SearchableProduct,
  rawQuery: string,
  normalizedQuery: string,
  expandedQueries: string[],
  intent: QueryIntent
): SearchHit<SearchableProduct> | null {
  const texts = buildSearchTexts(product);
  const tokens = uniqueStrings([
    ...tokenize(rawQuery),
    ...expandedQueries.flatMap(tokenize),
  ]);

  let score = 0;
  const reasons: string[] = [];
  let matchedTokens = 0;
  const matchedFields = new Set<string>();

  for (const token of tokens) {
    if (!token) continue;

    const tokenWeight = getTokenWeight(token);
    let tokenMatched = false;

    if (texts.specNorm.includes(token)) {
      score += applyScore(
        SCORE.SPEC_TOKEN * tokenWeight,
        getIntentMultiplier(intent, "spec")
      );
      tokenMatched = true;
      matchedFields.add("spec");
    }

    if (texts.titleNorm.includes(token)) {
      score += applyScore(
        SCORE.SPEC_TITLE * tokenWeight,
        getIntentMultiplier(intent, "title")
      );
      tokenMatched = true;
      matchedFields.add("title");
    }

    if (texts.categoryNorm.includes(token)) {
      score += applyScore(
        SCORE.SPEC_CATEGORY * tokenWeight,
        getIntentMultiplier(intent, "category")
      );
      tokenMatched = true;
      matchedFields.add("category");
    }

    if (texts.brandNorm.includes(token)) {
      score += applyScore(
        SCORE.SPEC_BRAND * tokenWeight,
        getIntentMultiplier(intent, "brand")
      );
      tokenMatched = true;
      matchedFields.add("brand");
    }

    if (texts.partNoNorm.includes(token)) {
      score += applyScore(
        SCORE.SPEC_PART * tokenWeight,
        getIntentMultiplier(intent, "part")
      );
      tokenMatched = true;
      matchedFields.add("partNo");
    }

    if (tokenMatched) {
      matchedTokens += 1;
    }
  }

  if (texts.specNorm === normalizedQuery && rawQuery.trim()) {
    score += applyScore(SCORE.SPEC_EXACT, getIntentMultiplier(intent, "spec"));
    reasons.push("spec:exact");
    matchedFields.add("spec");
  }

  if (matchedTokens >= 2) {
    score += SCORE.MULTI_TOKEN_2;
    reasons.push("multiToken:2+");
  }

  if (matchedTokens >= 3) {
    score += SCORE.MULTI_TOKEN_3;
    reasons.push("multiToken:3+");
  }

  if (matchedFields.size >= 2) {
    score += SCORE.FIELD_COVERAGE_2;
    reasons.push("fieldCoverage:2+");
  }

  if (matchedFields.size >= 3) {
    score += SCORE.FIELD_COVERAGE_3;
    reasons.push("fieldCoverage:3+");
  }

  if (score < minScoreForIntent(intent, "spec")) return null;

  return {
    product,
    score,
    reasons: uniqueStrings(reasons),
  };
}

export function debugSearchHits<TProduct extends SearchableProduct>(
  hits: SearchHit<TProduct>[],
  limit = 10
) {
  return hits.slice(0, limit).map((hit) => ({
    id: hit.product.id,
    partNo: hit.product.partNo ?? "",
    brand: hit.product.brand ?? "",
    category: hit.product.category ?? "",
    score: hit.score,
    reasons: hit.reasons,
  }));
}

export function searchProducts<TProduct extends SearchableProduct>(
  products: TProduct[],
  query: string,
  mode: SearchMode = "all",
  limit = 48
): SearchHit<TProduct>[] {
  const rawQuery = query.trim();
  if (!rawQuery) return [];

  const normalizedQuery = normalize(rawQuery);
  const compactQuery = compactNormalize(rawQuery);

  const intent = detectQueryIntent(rawQuery);
  const expandedQueries = getSynonymExpansions(rawQuery);

  const hits = products
    .map((product) => {
      const partHit =
        mode === "spec"
          ? null
          : scorePartMode(
              product,
              rawQuery,
              normalizedQuery,
              compactQuery,
              expandedQueries,
              intent
            );

      const specHit =
        mode === "part"
          ? null
          : scoreSpecMode(product, rawQuery, normalizedQuery, expandedQueries, intent);

      if (!partHit && !specHit) {
        return null;
      }

      if (partHit && specHit) {
        return partHit.score >= specHit.score
          ? {
              product,
              score: partHit.score,
              reasons: uniqueStrings([...partHit.reasons, ...specHit.reasons]),
            }
          : {
              product,
              score: specHit.score,
              reasons: uniqueStrings([...partHit.reasons, ...specHit.reasons]),
            };
      }

      return (partHit ?? specHit) as SearchHit<TProduct>;
    })
    .filter((hit): hit is SearchHit<TProduct> => Boolean(hit))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const aPartNo = a.product.partNo ?? "";
      const bPartNo = b.product.partNo ?? "";
      return aPartNo.localeCompare(bPartNo);
    });

  return hits.slice(0, limit);
}