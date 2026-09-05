import {
  focusSearchResults,
  searchFocusedProducts,
  searchProducts,
} from "@/lib/search/search";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const exactReferenceResults = focusSearchResults(
  searchProducts("33651XE", { limit: 48 }),
);
assert(
  exactReferenceResults.length === 1 &&
    exactReferenceResults[0]?.partNo === "P550467" &&
    exactReferenceResults[0]?._matchType === "Cross Ref",
  "33651XE should show only the exact P550467 reference result",
);

const ambiguousReferenceResults = focusSearchResults(
  searchProducts("33358", { limit: 48 }),
);
assert(
  ambiguousReferenceResults.some((result) => result.partNo === "P553004") &&
    ambiguousReferenceResults.some((result) => result.partNo === "P550440"),
  "33358 should preserve both documented Donaldson options",
);
assert(
  ambiguousReferenceResults.every(
    (result) =>
      result._matchType === "Cross Ref" ||
      result._matchType === "Same-brand Ref",
  ),
  "exact ambiguous references should not include unrelated results",
);

const partialReferenceResults = searchProducts("33651", {
  limit: 24,
  allowPartialRelationMatches: true,
}).filter(
  (result) =>
    result._matchType === "Cross Ref" ||
    result._matchType === "Same-brand Ref",
);
const partialReferenceNumbers = new Set(
  partialReferenceResults
    .map((result) => result._matchedRelation?.partNumber)
    .filter(Boolean),
);
assert(
  partialReferenceNumbers.has("33651XE"),
  "partial 33651 autocomplete should include 33651XE",
);

const focusedPartialResults = searchFocusedProducts("336", { limit: 48 });
assert(
  focusedPartialResults.length > 0 &&
    focusedPartialResults.every((result) =>
      [
        "Exact",
        "Prefix",
        "Cross Ref",
        "Same-brand Ref",
        "Kit Component",
      ].includes(result._matchType),
    ),
  "partial part-number search should exclude unrelated title/spec results",
);
assert(
  focusedPartialResults.some(
    (result) => result._matchedRelation?.partNumber === "33651XE",
  ),
  "partial 336 results should include the stored 33651XE reference",
);

const p50Results = searchFocusedProducts("p50", { limit: 48 });
const firstP50ReferenceIndex = p50Results.findIndex(
  (result) =>
    result._matchType === "Cross Ref" ||
    result._matchType === "Same-brand Ref",
);
const lastP50PartPrefixIndex = p50Results.reduce(
  (lastIndex, result, index) =>
    result.partNo.toLowerCase().startsWith("p50") ? index : lastIndex,
  -1,
);
assert(
  lastP50PartPrefixIndex >= 0 &&
    (firstP50ReferenceIndex === -1 || lastP50PartPrefixIndex < firstP50ReferenceIndex),
  "p50 Part No. prefix matches should rank before products found only through references",
);
assert(
  p50Results[0]?.partNo.toLowerCase().startsWith("p50"),
  "p50 should not rank P823295 ahead of direct Part No. prefix matches",
);

const exactDonaldsonResults = focusSearchResults(
  searchProducts("P551315", { limit: 48 }),
);
assert(
  exactDonaldsonResults.length === 1 &&
    exactDonaldsonResults[0]?.partNo === "P551315" &&
    exactDonaldsonResults[0]?._matchType === "Exact",
  "exact Donaldson search should remain a single normal result",
);

const ordinarySpecResults = focusSearchResults(
  searchProducts("OD 93", { limit: 48 }),
);
assert(
  ordinarySpecResults.some(
    (result) => result.partNo === "P550388" && result._matchType === "Spec",
  ),
  "ordinary specification search should remain available",
);

console.log("Focused exact-result and reference autocomplete validation passed");
console.log("33651XE resolves only to P550467");
console.log("Partial 33651 includes the stored 33651XE reference");
console.log("Ambiguous 33358 and ordinary specification search remain available");
