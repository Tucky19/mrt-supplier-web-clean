import { products } from "@/data/products/index";
import { synonyms } from "@/data/synonyms";

type ProductSpecification = {
  label: string;
  value: string | number;
};

export type Product = {
  id: string;
  partNo: string;
  brand: string;
  category?: string;
  title?: string;
  spec?: string;
  refs?: string[];
  crossReferences?: string[];
  pairedParts?: Array<{
    partNo: string;
    relation: "outer" | "inner" | "paired";
    note?: string;
  }>;
  specifications?: ProductSpecification[];
};

export type SearchResult = Product & {
  _score: number;
  _matchType: string;
};

const SPEC_ALIAS_MAP: Record<string, string[]> = {
  outerdiameter: ["outerdiameter", "od"],
  innerdiameter: ["innerdiameter", "id"],
  length: ["length", "l"],
  height: ["height", "h"],
  threadsize: ["threadsize", "thread"],
  efficiency: ["efficiency", "eff", "micron"],
  efficiency99: ["efficiency99", "eff", "micron"],
  efficiency999: ["efficiency999", "eff", "micron"],
  micronrating: ["micronrating", "eff", "micron"],
};

const QUERY_ALIAS_MAP: Record<string, string[]> = {
  od: ["od", "outerdiameter"],
  outerdiameter: ["od", "outerdiameter"],
  id: ["id", "innerdiameter"],
  innerdiameter: ["id", "innerdiameter"],
  l: ["l", "length"],
  length: ["l", "length"],
  h: ["h", "height"],
  height: ["h", "height"],
  thread: ["thread", "threadsize"],
  threadsize: ["thread", "threadsize"],
  micron: ["micron", "eff", "efficiency"],
  eff: ["micron", "eff", "efficiency"],
  efficiency: ["micron", "eff", "efficiency"],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s\-_/]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizePartLike(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s\-_/./]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeLoose(value: string) {
  return value
    .toLowerCase()
    .replace(/[×x]/g, " ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeLoose(value: string) {
  return normalizeLoose(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildPartRelationTokens(values: string[]) {
  const tokens = new Set<string>();

  for (const value of values) {
    const normalizedValue = normalizePartLike(value);
    if (normalizedValue) {
      tokens.add(normalizedValue);
    }

    for (const token of tokenizeLoose(value)) {
      const normalizedToken = normalizePartLike(token);
      if (
        normalizedToken &&
        /[a-z]/.test(normalizedToken) &&
        /\d/.test(normalizedToken)
      ) {
        tokens.add(normalizedToken);
      }
    }
  }

  return Array.from(tokens);
}

function relationMatchesQuery(tokens: string[], queryVariants: string[]) {
  if (tokens.some((token) => queryVariants.some((variant) => token === variant))) {
    return "exact";
  }

  if (
    tokens.some((token) =>
      queryVariants.some((variant) => token.startsWith(variant)),
    )
  ) {
    return "prefix";
  }

  if (
    tokens.some((token) =>
      queryVariants.some((variant) => token.includes(variant)),
    )
  ) {
    return "contains";
  }

  return null;
}

function buildQueryVariants(query: string) {
  const variants = new Set([query]);

  for (const key in synonyms) {
    if (!query.includes(normalize(key))) continue;

    for (const synonym of synonyms[key]) {
      variants.add(normalize(synonym));
    }
  }

  return Array.from(variants);
}

function normalizeSpecLabel(label: string) {
  return normalize(label);
}

function aliasesForSpecLabel(label: string) {
  const normalizedLabel = normalizeSpecLabel(label);
  return SPEC_ALIAS_MAP[normalizedLabel] ?? [normalizedLabel];
}

function buildSpecTerms(item: Product) {
  const terms = new Set<string>();
  const spec = String(item.spec ?? "");
  const looseSpecTokens = tokenizeLoose(spec);
  const normalizedSpec = normalize(spec);

  if (normalizedSpec) {
    terms.add(normalizedSpec);
  }

  for (const token of looseSpecTokens) {
    const normalizedToken = normalize(token);
    if (normalizedToken) {
      terms.add(normalizedToken);
    }
  }

  for (let index = 0; index < looseSpecTokens.length - 1; index += 1) {
    const combined = normalize(`${looseSpecTokens[index]}${looseSpecTokens[index + 1]}`);
    if (combined) {
      terms.add(combined);
    }
  }

  for (const specItem of item.specifications ?? []) {
    const label = String(specItem.label ?? "");
    const value = String(specItem.value ?? "");
    const labelNorm = normalize(label);
    const valueNorm = normalize(value);

    if (labelNorm) {
      terms.add(labelNorm);
    }

    if (valueNorm) {
      terms.add(valueNorm);
    }

    const valueTokens = tokenizeLoose(value)
      .map((token) => normalize(token))
      .filter(Boolean);
    const combinedValueTokens = valueTokens.join("");

    if (combinedValueTokens) {
      terms.add(combinedValueTokens);
    }

    for (const alias of aliasesForSpecLabel(label)) {
      if (alias) {
        terms.add(alias);
      }

      if (alias && valueNorm) {
        terms.add(`${alias}${valueNorm}`);
      }

      if (alias && combinedValueTokens) {
        terms.add(`${alias}${combinedValueTokens}`);
      }

      for (const token of valueTokens) {
        if (alias && token) {
          terms.add(`${alias}${token}`);
        }
      }
    }
  }

  return terms;
}

function buildSpecQueryTokens(query: string) {
  const rawTokens = tokenizeLoose(query);
  const tokens = new Set<string>();

  for (const token of rawTokens) {
    const normalizedToken = normalize(token);
    if (normalizedToken) {
      tokens.add(normalizedToken);
    }
  }

  for (let index = 0; index < rawTokens.length - 1; index += 1) {
    const combined = normalize(`${rawTokens[index]}${rawTokens[index + 1]}`);
    if (combined) {
      tokens.add(combined);
    }
  }

  for (let index = 0; index < rawTokens.length; index += 1) {
    const currentToken = normalize(rawTokens[index]);
    const aliases = QUERY_ALIAS_MAP[currentToken];

    if (!aliases) continue;

    let combinedValue = "";

    for (let nextIndex = index + 1; nextIndex < rawTokens.length; nextIndex += 1) {
      const nextTokenRaw = rawTokens[nextIndex];
      const nextToken = normalize(nextTokenRaw);

      if (!nextToken) continue;
      if (QUERY_ALIAS_MAP[nextToken]) break;

      combinedValue += nextToken;

      for (const alias of aliases) {
        tokens.add(`${alias}${combinedValue}`);
      }
    }
  }

  return Array.from(tokens);
}

function scoreSpecQueryMatches(specTerms: Set<string>, query: string) {
  const queryTokens = buildSpecQueryTokens(query);
  if (queryTokens.length === 0) {
    return 0;
  }

  const matchedTokens = queryTokens.filter((token) => {
    if (specTerms.has(token)) return true;
    return Array.from(specTerms).some((term) => term.includes(token));
  });

  if (matchedTokens.length === 0) {
    return 0;
  }

  const allMatched = matchedTokens.length === queryTokens.length;
  const specAliasMatched = matchedTokens.some((token) =>
    ["od", "id", "l", "h", "thread", "micron", "eff"].some((alias) =>
      token.startsWith(alias),
    ),
  );

  if (allMatched && specAliasMatched) {
    return 1800 + matchedTokens.length * 120;
  }

  if (allMatched) {
    return 1400 + matchedTokens.length * 100;
  }

  return matchedTokens.length * 180;
}

export function searchProducts(
  q: string,
  { limit = 50 }: { limit?: number } = {},
): SearchResult[] {
  const catalog = Array.isArray(products) ? products : [];
  const query = normalize(q);

  if (!query) return [];

  const queryVariants = buildQueryVariants(query);

  const scored: SearchResult[] = catalog.map((item: Product) => {
    let score = 0;
    let matchType = "";

    const part = normalize(item.partNo);
    const brand = normalize(item.brand);
    const title = normalize(item.title ?? "");
    const spec = normalize(item.spec ?? "");
    const sameBrandRefs = buildPartRelationTokens(item.refs ?? []);
    const crossReferences = buildPartRelationTokens(item.crossReferences ?? []);
    const pairedParts = buildPartRelationTokens(
      (item.pairedParts ?? []).map((part) => part.partNo),
    );
    const specTerms = buildSpecTerms(item);

    if (part === query) {
      score += 10000;
      matchType = "Exact";
    } else if (part.startsWith(query)) {
      score += 8000;
      matchType = "Prefix";
    } else if (queryVariants.some((variant) => part.includes(variant))) {
      score += 5000;
      matchType = "Contains";
    }

    const sameBrandMatch = relationMatchesQuery(sameBrandRefs, queryVariants);
    const crossRefMatch = relationMatchesQuery(crossReferences, queryVariants);
    const pairedPartMatch = relationMatchesQuery(pairedParts, queryVariants);

    if (sameBrandMatch) {
      score +=
        sameBrandMatch === "exact"
          ? 7000
          : sameBrandMatch === "prefix"
            ? 6500
            : 6000;
      if (!matchType) matchType = "Same-brand Ref";
    }

    if (crossRefMatch) {
      score +=
        crossRefMatch === "exact"
          ? 7000
          : crossRefMatch === "prefix"
            ? 6500
            : 6000;
      if (!matchType) matchType = "Cross Ref";
    }

    if (pairedPartMatch) {
      score +=
        pairedPartMatch === "exact"
          ? 6200
          : pairedPartMatch === "prefix"
            ? 5800
            : 5200;
      if (!matchType) matchType = "Kit Component";
    }

    if (title.includes(query)) {
      score += title.startsWith(query) ? 1800 : 1200;
      if (!matchType) matchType = "Title";
    }

    if (spec.includes(query)) {
      score += spec.startsWith(query) ? 1100 : 800;
      if (!matchType) matchType = "Spec";
    }

    const specMatchScore = scoreSpecQueryMatches(specTerms, q);
    if (specMatchScore > 0) {
      score += specMatchScore;
      if (!matchType) matchType = "Spec";
    }

    if (brand === query) {
      score += 900;
      if (!matchType) matchType = "Brand";
    } else if (brand.startsWith(query)) {
      score += 700;
      if (!matchType) matchType = "Brand";
    }

    if (part.includes(query) && query.length >= 4) {
      score += 500;
    }

    return {
      ...item,
      _score: score,
      _matchType: matchType,
    };
  });

  return scored
    .filter((item) => item._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;

      const aPart = normalize(a.partNo);
      const bPart = normalize(b.partNo);
      const aDistance = Math.abs(aPart.length - query.length);
      const bDistance = Math.abs(bPart.length - query.length);

      if (aDistance !== bDistance) return aDistance - bDistance;

      return a.partNo.localeCompare(b.partNo);
    })
    .slice(0, limit);
}

export function searchFallback(q: string, limit = 5): Product[] {
  const query = normalize(q);
  if (!query) return [];

  const catalog = Array.isArray(products) ? products : [];

  return catalog
    .map((item: Product) => {
      const part = normalize(item.partNo);
      let similarity = 0;

      if (part.includes(query)) similarity += 5;
      similarity += Math.max(0, 10 - Math.abs(part.length - query.length));

      return { item, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((entry) => entry.item);
}
