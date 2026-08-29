import assert from "node:assert/strict";
import {
  dimensionToleranceForProduct,
  getNormalizedDimensions,
  isFilterProduct,
  matchesDimensions,
  parseMillimeters,
} from "@/lib/search/dimensions";
import { searchFilterProductsByDimensions } from "@/lib/search/search";
import type { Product } from "@/types/product";

assert.equal(parseMillimeters("128.8 mm (5.07 inch)"), 128.8);
assert.equal(parseMillimeters("2.5 inch"), 63.5);
assert.equal(parseMillimeters(93), 93);

const filter: Product = {
  id: "filter-test",
  partNo: "FILTER-TEST",
  brand: "Donaldson",
  category: "air_filter",
  title: "Air Filter",
  specifications: [
    { label: "Outer Diameter", value: "128.8 mm (5.07 inch)" },
    { label: "Inner Diameter", value: "85.1 mm" },
    { label: "Length", value: "279.4 mm" },
    { label: "Thread Size", value: "1 1/8-16 UN" },
  ],
};

assert.deepEqual(getNormalizedDimensions(filter), {
  outerDiameterMm: 128.8,
  innerDiameterMm: 85.1,
  lengthMm: 279.4,
  widthMm: undefined,
  threadSize: "1 1/8-16 UN",
});
assert.equal(matchesDimensions(filter, { outerDiameterMm: 130, toleranceMm: 2 }), true);
assert.equal(matchesDimensions(filter, { outerDiameterMm: 132, toleranceMm: 2 }), false);
assert.equal(matchesDimensions(filter, { threadSize: "1-1/8-16 UN" }), true);
assert.equal(dimensionToleranceForProduct(filter), 3);
assert.equal(
  matchesDimensions(filter, {
    outerDiameterMm: 131.8,
    toleranceMm: dimensionToleranceForProduct(filter),
  }),
  true,
);
assert.equal(
  matchesDimensions(filter, {
    outerDiameterMm: 131.801,
    toleranceMm: dimensionToleranceForProduct(filter),
  }),
  false,
);

const bearing: Product = {
  id: "bearing-test",
  partNo: "6205ZZ",
  brand: "NTN",
  category: "Bearings",
  spec: "25 x 52 x 15 mm",
};

assert.equal(dimensionToleranceForProduct(bearing), 0);

assert.deepEqual(getNormalizedDimensions(bearing), {
  outerDiameterMm: 52,
  innerDiameterMm: 25,
  lengthMm: undefined,
  widthMm: 15,
  threadSize: undefined,
});
assert.equal(
  matchesDimensions(bearing, {
    innerDiameterMm: 25,
    outerDiameterMm: 52,
    widthMm: 15,
  }),
  true,
);
assert.equal(
  matchesDimensions(bearing, {
    innerDiameterMm: 25,
    outerDiameterMm: 52,
    widthMm: 16,
  }),
  false,
);

assert.equal(isFilterProduct(filter), true);
assert.equal(isFilterProduct(bearing), false);

const catalogDimensionResults = searchFilterProductsByDimensions(
  { outerDiameterMm: 93 },
  { limit: 100 },
);
assert.ok(catalogDimensionResults.length > 0);
assert.ok(
  catalogDimensionResults.every(
    (result) =>
      result._matchType === "Dimensions" &&
      !String(result.category ?? "").toLowerCase().includes("bearing"),
  ),
);
assert.ok(
  catalogDimensionResults.some((result) => result.partNo === "P550388"),
);
for (let index = 1; index < catalogDimensionResults.length; index += 1) {
  assert.ok(
    catalogDimensionResults[index - 1]._score >=
      catalogDimensionResults[index]._score,
  );
}

const exactP550388 = searchFilterProductsByDimensions({
  outerDiameterMm: 93,
  lengthMm: 173,
  threadSize: "1-12 UN",
});
assert.ok(exactP550388.some((result) => result.partNo === "P550388"));

const boundaryP550388 = searchFilterProductsByDimensions({
  outerDiameterMm: 96,
});
assert.ok(boundaryP550388.some((result) => result.partNo === "P550388"));

const outsideP550388 = searchFilterProductsByDimensions({
  outerDiameterMm: 96.01,
});
assert.ok(!outsideP550388.some((result) => result.partNo === "P550388"));

console.log("Dimension search verification passed.");
