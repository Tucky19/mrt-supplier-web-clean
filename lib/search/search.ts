import { products } from "@/data/products/index";
import { synonyms } from "@/data/synonyms";
import {
  dimensionDistanceMm,
  dimensionToleranceForProduct,
  isFilterProduct,
  matchesDimensions,
  type DimensionSearchCriteria,
} from "@/lib/search/dimensions";
import {
  type ProductRelationInput,
  type ProductRelation,
  normalizeProductRelations,
  relationSearchTerms,
} from "@/lib/products/relations";
import { hasVerifiedMrtStock, isMrtCoreBrand } from "@/lib/products/stock";

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
  refs?: ProductRelationInput[];
  crossReferences?: ProductRelationInput[];
  pairedParts?: Array<{
    partNo: string;
    relation: "outer" | "inner" | "paired";
    note?: string;
  }>;
  specifications?: ProductSpecification[];
  stockStatus?: string;
  mrtStockEvidence?: {
    status: "in_stock";
    checkedAt: string;
    source: "physical_count" | "internal_record";
    note?: string;
  };
};

export type SearchResult = Product & {
  _score: number;
  _matchType: string;
  _matchedRelation?: ProductRelation;
  _matchedRelationField?: "refs" | "crossReferences";
};

export type ExactProductLookup = {
  find: (query: string) => SearchResult[];
};

function mrtBrandPriority(product: Product) {
  if (hasVerifiedMrtStock(product) && !isMrtCoreBrand(product.brand)) return 3;
  if (isMrtCoreBrand(product.brand)) return 2;
  return 1;
}

function sortByMrtPriority(results: SearchResult[]) {
  return [...results].sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;

    const priorityDifference = mrtBrandPriority(b) - mrtBrandPriority(a);
    if (priorityDifference !== 0) return priorityDifference;

    return a.partNo.localeCompare(b.partNo);
  });
}

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

function buildRelationSearchEntries(
  values: unknown,
  defaultRelationType: ProductRelation["relationType"],
) {
  return normalizeProductRelations(values, defaultRelationType).map((relation) => ({
    relation,
    tokens: buildPartRelationTokens(relationSearchTerms([relation], defaultRelationType)),
  }));
}

function relationMatchesQuery(
  tokens: string[],
  queryVariants: string[],
  { allowPartialMatches = false }: { allowPartialMatches?: boolean } = {},
) {
  if (tokens.some((token) => queryVariants.some((variant) => token === variant))) {
    return "exact";
  }

  if (!allowPartialMatches) {
    return null;
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

function findRelationMatch(
  entries: ReturnType<typeof buildRelationSearchEntries>,
  queryVariants: string[],
  { allowPartialMatches = false }: { allowPartialMatches?: boolean } = {},
) {
  for (const entry of entries) {
    const match = relationMatchesQuery(entry.tokens, queryVariants, {
      allowPartialMatches,
    });

    if (match) {
      return {
        relation: entry.relation,
        match,
      };
    }
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

function buildRecognizedBrandQualifiers(catalog: Product[]) {
  const brands = new Set<string>();

  for (const item of catalog) {
    const productBrand = normalizeLoose(item.brand ?? "");
    if (productBrand) {
      brands.add(productBrand);
    }

    for (const relation of [
      ...normalizeProductRelations(item.refs ?? [], "unknown"),
      ...normalizeProductRelations(item.crossReferences ?? [], "unknown"),
    ]) {
      const relationBrand = normalizeLoose(relation.brand ?? "");
      if (relationBrand) {
        brands.add(relationBrand);
      }
    }
  }

  return Array.from(brands).sort((a, b) => b.length - a.length);
}

function queryWithoutBrandQualifier(query: string, brandQualifiers: string[]) {
  const looseQuery = normalizeLoose(query);

  for (const brand of brandQualifiers) {
    if (looseQuery.startsWith(`${brand} `)) {
      return looseQuery.slice(brand.length).trim();
    }
  }

  return query;
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
  {
    limit = 50,
    allowPartialRelationMatches = false,
  }: { limit?: number; allowPartialRelationMatches?: boolean } = {},
): SearchResult[] {
  const catalog = Array.isArray(products) ? products : [];
  const query = normalize(q);

  if (!query) return [];

  const queryVariants = buildQueryVariants(query);
  const specQuery = queryWithoutBrandQualifier(
    q,
    buildRecognizedBrandQualifiers(catalog),
  );
  const normalizedSpecQuery = normalize(specQuery);

  const scored: SearchResult[] = catalog.map((item: Product) => {
    let score = 0;
    let matchType = "";

    const part = normalize(item.partNo);
    const brand = normalize(item.brand);
    const title = normalize(item.title ?? "");
    const spec = normalize(item.spec ?? "");
    let matchedRelation: ProductRelation | undefined;
    let matchedRelationField: SearchResult["_matchedRelationField"];
    const sameBrandRefs = buildRelationSearchEntries(item.refs ?? [], "unknown");
    const crossReferences = buildRelationSearchEntries(
      item.crossReferences ?? [],
      "unknown",
    );
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

    const relationQueryVariants = allowPartialRelationMatches
      ? queryVariants
      : [query];
    const relationMatchOptions = {
      allowPartialMatches: allowPartialRelationMatches,
    };
    const sameBrandMatch = findRelationMatch(
      sameBrandRefs,
      relationQueryVariants,
      relationMatchOptions,
    );
    const crossRefMatch = findRelationMatch(
      crossReferences,
      relationQueryVariants,
      relationMatchOptions,
    );
    const pairedPartMatch = relationMatchesQuery(
      pairedParts,
      relationQueryVariants,
      relationMatchOptions,
    );

    const relationMatch = crossRefMatch ?? sameBrandMatch;

    if (relationMatch) {
      score +=
        relationMatch.match === "exact"
          ? 7000
          : relationMatch.match === "prefix"
            ? 6500
            : 6000;
      if (!matchType) {
        matchType = crossRefMatch ? "Cross Ref" : "Same-brand Ref";
        matchedRelation = relationMatch.relation;
        matchedRelationField = crossRefMatch ? "crossReferences" : "refs";
      }
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

    if (normalizedSpecQuery && spec.includes(normalizedSpecQuery)) {
      score += spec.startsWith(normalizedSpecQuery) ? 1100 : 800;
      if (!matchType) matchType = "Spec";
    }

    const specMatchScore = scoreSpecQueryMatches(specTerms, specQuery);
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
      _matchedRelation: matchedRelation,
      _matchedRelationField: matchedRelationField,
    };
  });

  return scored
    .filter((item) => item._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;

      const priorityDifference = mrtBrandPriority(b) - mrtBrandPriority(a);
      if (priorityDifference !== 0) return priorityDifference;

      const aPart = normalize(a.partNo);
      const bPart = normalize(b.partNo);
      const aDistance = Math.abs(aPart.length - query.length);
      const bDistance = Math.abs(bPart.length - query.length);

      if (aDistance !== bDistance) return aDistance - bDistance;

      return a.partNo.localeCompare(b.partNo);
    })
    .slice(0, limit);
}

export function createExactProductLookup(): ExactProductLookup {
  const catalog = Array.isArray(products) ? products : [];
  const index = new Map<string, Map<string, SearchResult>>();

  function addResult(key: string, result: SearchResult) {
    if (!key) return;

    const keyedResults = index.get(key) ?? new Map<string, SearchResult>();
    const existing = keyedResults.get(result.id);

    if (!existing || result._score > existing._score) {
      keyedResults.set(result.id, result);
    }

    index.set(key, keyedResults);
  }

  for (const item of catalog) {
    addResult(normalize(item.partNo), {
      ...item,
      _score: 10000,
      _matchType: "Exact",
    });

    for (const entry of buildRelationSearchEntries(item.refs ?? [], "unknown")) {
      for (const token of entry.tokens) {
        addResult(token, {
          ...item,
          _score: 7000,
          _matchType: "Same-brand Ref",
          _matchedRelation: entry.relation,
          _matchedRelationField: "refs",
        });
      }
    }

    for (const entry of buildRelationSearchEntries(
      item.crossReferences ?? [],
      "unknown",
    )) {
      for (const token of entry.tokens) {
        addResult(token, {
          ...item,
          _score: 7000,
          _matchType: "Cross Ref",
          _matchedRelation: entry.relation,
          _matchedRelationField: "crossReferences",
        });
      }
    }
  }

  return {
    find(query: string) {
      const matches = Array.from(index.get(normalize(query))?.values() ?? []);
      const exactMatches = matches.filter((item) => item._matchType === "Exact");

      return (exactMatches.length > 0 ? exactMatches : matches).sort((a, b) =>
        a.partNo.localeCompare(b.partNo),
      );
    },
  };
}

export function focusSearchResults(results: SearchResult[]): SearchResult[] {
  const exactPartResults = results.filter((item) => item._matchType === "Exact");
  if (exactPartResults.length > 0) {
    const verifiedStockedNonCoreResults = exactPartResults.filter(
      (item) => hasVerifiedMrtStock(item) && !isMrtCoreBrand(item.brand),
    );
    const coreReferenceResults = results.filter(
      (item) =>
        isMrtCoreBrand(item.brand) &&
        (item._matchType === "Cross Ref" ||
          item._matchType === "Same-brand Ref"),
    );

    if (
      verifiedStockedNonCoreResults.length > 0 &&
      coreReferenceResults.length > 0
    ) {
      return sortByMrtPriority([
        ...verifiedStockedNonCoreResults,
        ...coreReferenceResults,
      ]);
    }

    if (
      exactPartResults.every((item) => !isMrtCoreBrand(item.brand)) &&
      coreReferenceResults.length > 0
    ) {
      return sortByMrtPriority(coreReferenceResults);
    }

    return sortByMrtPriority(exactPartResults);
  }

  const exactReferenceResults = results.filter(
    (item) =>
      item._matchType === "Cross Ref" ||
      item._matchType === "Same-brand Ref",
  );
  if (exactReferenceResults.length > 0) {
    return sortByMrtPriority(exactReferenceResults);
  }

  const exactKitResults = results.filter(
    (item) => item._matchType === "Kit Component",
  );
  if (exactKitResults.length > 0) {
    return sortByMrtPriority(exactKitResults);
  }

  return results;
}

export function searchFocusedProducts(
  q: string,
  { limit = 50 }: { limit?: number } = {},
): SearchResult[] {
  const exactResults = searchProducts(q, { limit });
  const focusedExactResults = focusSearchResults(exactResults);

  if (focusedExactResults !== exactResults) {
    return focusedExactResults;
  }

  const partialCandidates = searchProducts(q, {
    limit,
    allowPartialRelationMatches: true,
  }).filter((item) =>
    [
      "Exact",
      "Prefix",
      "Cross Ref",
      "Same-brand Ref",
      "Kit Component",
    ].includes(item._matchType),
  );

  return partialCandidates.length > 0 ? partialCandidates : exactResults;
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

export type FilterDimensionCategory =
  | "all"
  | "air_filter"
  | "oil_filter"
  | "fuel_filter"
  | "hydraulic_filter";

function matchesFilterDimensionCategory(
  item: Product,
  category: FilterDimensionCategory,
) {
  if (category === "all") return true;

  const text = normalize(`${item.category ?? ""} ${item.title ?? ""}`);
  if (category === "air_filter") return text.includes("air");
  if (category === "oil_filter") {
    return text.includes("oil") || text.includes("lube");
  }
  if (category === "fuel_filter") {
    return text.includes("fuel") || text.includes("waterseparator");
  }
  return text.includes("hydraulic");
}

export function searchFilterProductsByDimensions(
  criteria: DimensionSearchCriteria,
  {
    category = "all",
    limit = 500,
  }: { category?: FilterDimensionCategory; limit?: number } = {},
): SearchResult[] {
  const hasCriteria =
    criteria.outerDiameterMm !== undefined ||
    criteria.innerDiameterMm !== undefined ||
    criteria.lengthMm !== undefined ||
    criteria.widthMm !== undefined ||
    Boolean(criteria.threadSize?.trim());

  if (!hasCriteria) return [];

  const catalog = Array.isArray(products) ? products : [];
  return catalog
    .filter(
      (item) =>
        isFilterProduct(item) &&
        matchesFilterDimensionCategory(item, category) &&
        matchesDimensions(item, {
          ...criteria,
          toleranceMm: dimensionToleranceForProduct(item),
        }),
    )
    .map((item) => {
      const distanceMm = dimensionDistanceMm(item, criteria);
      return {
        ...item,
        _score: 9000 - distanceMm * 100,
        _matchType: "Dimensions",
      };
    })
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return a.partNo.localeCompare(b.partNo);
    })
    .slice(0, limit);
}

export function searchProductsByDimensions(
  criteria: DimensionSearchCriteria,
  { limit = 50 }: { limit?: number } = {},
): Product[] {
  const hasCriteria =
    criteria.outerDiameterMm !== undefined ||
    criteria.innerDiameterMm !== undefined ||
    criteria.lengthMm !== undefined ||
    criteria.widthMm !== undefined ||
    Boolean(criteria.threadSize?.trim());

  if (!hasCriteria) return [];

  const catalog = Array.isArray(products) ? products : [];
  return catalog
    .filter((product) => matchesDimensions(product, criteria))
    .slice(0, limit);
}
