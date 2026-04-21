import type { QueryIntent } from "@/lib/search/search";

export type SearchTuningCase = {
  name: string;
  query: string;
  mode?: "part" | "spec" | "all";
  expectedIntent?: QueryIntent;

  /**
   * Part numbers that should ideally appear near the top.
   * Use when you know exact SKU / part behavior matters.
   */
  expectedTopPartNos?: string[];

  /**
   * Brands that should be represented in the top results.
   */
  expectedBrands?: string[];

  /**
   * Categories that should be represented in the top results.
   */
  expectedCategories?: string[];

  /**
   * Substrings that should appear in top result titles/specs/part numbers.
   * Useful for looser keyword validation.
   */
  expectedKeywords?: string[];

  /**
   * Notes for human review.
   */
  note?: string;
};

export const SEARCH_TUNING_CASES: SearchTuningCase[] = [
  {
    name: "Exact part number - Donaldson",
    query: "P558615",
    mode: "all",
    expectedIntent: "part",
    expectedTopPartNos: ["P558615"],
    expectedCategories: ["filter"],
    note: "Exact part number must win clearly.",
  },
  {
    name: "Prefix part search - p55",
    query: "p55",
    mode: "all",
    expectedIntent: "part",
    expectedTopPartNos: ["P558615"],
    expectedCategories: ["filter"],
    note: "Prefix search should favor matching part numbers, not random descriptions.",
  },
  {
    name: "Short bearing part number",
    query: "6205",
    mode: "all",
    expectedIntent: "part",
    expectedKeywords: ["6205"],
    expectedCategories: ["bearing"],
    note: "Classic bearing query. Part-like short numeric searches should stay strong.",
  },
  {
    name: "Brand + part number mixed query",
    query: "6205 NTN",
    mode: "all",
    expectedIntent: "mixed",
    expectedBrands: ["NTN"],
    expectedKeywords: ["6205"],
    expectedCategories: ["bearing"],
    note: "Mixed part and brand query should rank matching NTN bearing results higher.",
  },
  {
    name: "English generic keyword - oil filter",
    query: "oil filter",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["filter"],
    expectedKeywords: ["oil", "filter"],
    note: "Keyword search should return relevant filter-related products, not random partNo matches.",
  },
  {
    name: "English generic keyword - air filter",
    query: "air filter",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["filter"],
    expectedKeywords: ["air", "filter"],
    note: "Category/title/spec matching should work well for generic English search.",
  },
  {
    name: "Thai keyword - ไส้กรอง",
    query: "ไส้กรอง",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["filter"],
    expectedKeywords: ["filter"],
    note: "Thai synonym should pull filter-related items into the top results.",
  },
  {
    name: "Thai keyword - ลูกปืน",
    query: "ลูกปืน",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["bearing"],
    expectedKeywords: ["bearing"],
    note: "Thai synonym for bearing should work reliably.",
  },
  {
    name: "Keyword with brand context",
    query: "donaldson oil filter",
    mode: "all",
    expectedIntent: "keyword",
    expectedBrands: ["Donaldson"],
    expectedCategories: ["filter"],
    expectedKeywords: ["oil", "filter"],
    note: "Brand + keyword should prefer Donaldson filter products.",
  },
  {
    name: "Typo tolerance - filtre",
    query: "filtre",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["filter"],
    expectedKeywords: ["filter"],
    note: "Light typo tolerance should still surface filter-like results.",
  },
  {
    name: "Hydraulic keyword",
    query: "hydraulic",
    mode: "all",
    expectedIntent: "keyword",
    expectedKeywords: ["hydraulic"],
    note: "Hydraulic-related products should rank ahead of generic unrelated results.",
  },
  {
    name: "Seal keyword",
    query: "seal",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["seal"],
    expectedKeywords: ["seal"],
    note: "Seal-related products should appear without polluting top ranks with unrelated generic parts.",
  },
  {
    name: "Thai seal keyword",
    query: "ซีล",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["seal"],
    expectedKeywords: ["seal"],
    note: "Thai synonym for seal should produce relevant results if seal data exists.",
  },
  {
    name: "Spec-like dimensional query",
    query: "93mm",
    mode: "spec",
    expectedIntent: "part",
    expectedKeywords: ["93mm"],
    note: "Dimension-like tokens should help spec mode without letting weak matches dominate.",
  },
  {
    name: "Mixed query with generic + part clue",
    query: "p55 filter",
    mode: "all",
    expectedIntent: "mixed",
    expectedTopPartNos: ["P558615"],
    expectedCategories: ["filter"],
    expectedKeywords: ["filter"],
    note: "Mixed search should still prioritize strong part prefix results.",
  },
  {
    name: "Fuel filter query",
    query: "fuel filter",
    mode: "all",
    expectedIntent: "keyword",
    expectedCategories: ["filter"],
    expectedKeywords: ["fuel", "filter"],
    note: "Synonym expansion should support fuel filter retrieval.",
  },
  {
    name: "Brand-only query",
    query: "Donaldson",
    mode: "all",
    expectedIntent: "keyword",
    expectedBrands: ["Donaldson"],
    note: "Brand search should not collapse into unrelated keyword noise.",
  },
  {
    name: "Another brand-only query",
    query: "NTN",
    mode: "all",
    expectedIntent: "keyword",
    expectedBrands: ["NTN"],
    expectedCategories: ["bearing"],
    note: "Brand-only query should still favor relevant category families.",
  },
];