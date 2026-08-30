import assert from "node:assert/strict";
import { focusSearchResults, type SearchResult } from "@/lib/search/search";
import { hasVerifiedMrtStock } from "@/lib/products/stock";

function result(
  overrides: Partial<SearchResult> & Pick<SearchResult, "id" | "partNo" | "brand">,
): SearchResult {
  return {
    _score: 7000,
    _matchType: "Cross Ref",
    ...overrides,
  };
}

const referenceResults = focusSearchResults([
  result({ id: "other", partNo: "ZZ-OTHER", brand: "Fleetguard" }),
  result({ id: "mann", partNo: "C 1234", brand: "MANN-FILTER" }),
  result({ id: "donaldson", partNo: "P550001", brand: "Donaldson" }),
]);

assert.deepEqual(
  referenceResults.map((item) => item.id),
  ["mann", "donaldson", "other"],
  "Core MRT brands must rank before non-core reference results with the same score",
);

const unverifiedExact = result({
  id: "fleetguard-request",
  partNo: "FS-DEMO",
  brand: "Fleetguard",
  _score: 10000,
  _matchType: "Exact",
  stockStatus: "in_stock",
});
const coreAlternative = result({
  id: "donaldson-alternative",
  partNo: "P-DEMO",
  brand: "Donaldson",
});

assert.deepEqual(
  focusSearchResults([unverifiedExact, coreAlternative]).map((item) => item.id),
  ["donaldson-alternative"],
  "Legacy in_stock alone must not promote a non-core exact product over a core alternative",
);

const verifiedExact = result({
  ...unverifiedExact,
  id: "fleetguard-stocked",
  mrtStockEvidence: {
    status: "in_stock",
    checkedAt: "2026-08-30",
    source: "physical_count",
  },
});

assert.equal(hasVerifiedMrtStock(verifiedExact), true);
assert.deepEqual(
  focusSearchResults([verifiedExact, coreAlternative]).map((item) => item.id),
  ["fleetguard-stocked", "donaldson-alternative"],
  "Verified non-core stock must remain visible with the core alternative",
);

console.log("MRT search priority verification passed.");
