import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import index from "@/data/search-index.v2.json";
import { createExactProductLookup, searchProducts } from "@/lib/search/search";
import { normalizeProductRelations, relationPartNumbers } from "@/lib/products/relations";
import { buildRfqReferenceContext } from "@/lib/rfq/referenceContext";

const product = products.find((item) => item.partNo === "P551807")!;
assert.ok(product);
assert.equal(products.filter((item) => item.partNo === "P551807").length, 1);
assert.ok(!products.some((item) => item.partNo === "1R1807"));
const relation = normalizeProductRelations(product.crossReferences, "unknown").find((item) => item.partNumber === "1R1807")!;
assert.equal(relation.brand, "CATERPILLAR");
assert.equal(relation.verificationStatus, "verified");
assert.equal(relation.evidenceUrl, "https://shop.donaldson.com/store/en-th/search?Ntt=1R1807");
assert.ok(relationPartNumbers(product.crossReferences, "unknown").includes("P553191"));
for (const query of ["1R1807", "1r1807", "1R-1807", "1R 1807", "CAT 1R1807", "CATERPILLAR 1R1807"]) {
  const match = searchProducts(query, { limit: 1000 }).find((item) => item.partNo === "P551807");
  assert.ok(match, query);
  assert.equal(match._matchType, "Cross Ref", query);
}
assert.ok(createExactProductLookup().find("1R1807").some((item) => item.partNo === "P551807"));
const indexed = index.items.find((item) => item.id === product.id)!;
assert.ok(indexed.crossReferences.some((value) => value.includes("1R1807")));
assert.ok(index.xrefIndex["1r1807"]?.includes(product.id));
const context = buildRfqReferenceContext({ searchQuery: "CAT 1R1807", offeredPartNo: product.partNo, matchType: "Cross Ref", matchedRelation: relation });
assert.ok(context);
assert.equal(context.matchedRelation?.partNumber, "1R1807");
console.log("PASS: single canonical P551807, official evidence, existing reference, search variants, exact lookup, index and RFQ reference context");

// Existing Caterpillar mapping must retain its original pending status.
for (const query of ["CAT 2P4004", "CATERPILLAR 2P4004", "cat 2p-4004"]) {
  const match = searchProducts(query, { limit: 1000 }).find((item) => item.partNo === "P554004");
  assert.ok(match, query);
  assert.equal(match._matchedRelation?.partNumber, "2P4004");
  assert.equal(match._matchedRelation?.verificationStatus, "pending");
  assert.ok(!searchProducts(query, { limit: 1000 }).some((item) => item.partNo === "P551807"));
}
for (const query of ["CAT 1R1808", "CAT 1R180", "CAT P551807", "CATERPILLAR P551807", "Fleetguard 1R1807", "BOBCAT 1R1807"]) {
  assert.ok(!searchProducts(query, { limit: 1000 }).some((item) => item.partNo === "P551807"), query);
}

// In-memory controls exercise equal-code collisions without adding catalog mappings.
const originalCount = products.length;
const otherBrand = {
  ...product,
  id: "test-only-other-brand-reference",
  partNo: "TEST-OTHER-BRAND",
  refs: [],
  crossReferences: [{ ...relation, brand: "Fleetguard" }],
};
const directCode = {
  ...product,
  id: "test-only-direct-part-code",
  partNo: "1R1807",
  refs: [],
  crossReferences: [],
};
try {
  products.push(otherBrand, directCode);
  for (const query of ["CAT 1R1807", "CATERPILLAR 1R1807"]) {
    const results = searchProducts(query, { limit: 1000 });
    assert.ok(results.some((item) => item.id === product.id), query);
    assert.ok(!results.some((item) => item.id === otherBrand.id || item.id === directCode.id), query);
  }
  const fleetguard = searchProducts("Fleetguard 1R1807", { limit: 1000 });
  assert.ok(fleetguard.some((item) => item.id === otherBrand.id));
  assert.ok(!fleetguard.some((item) => item.id === product.id));
  assert.equal(searchProducts("1R1807", { limit: 1000 })[0]?.id, directCode.id);
} finally {
  products.splice(originalCount);
}
assert.equal(products.length, originalCount);
console.log("PASS: existing CAT/CATERPILLAR qualifier, pending status, negative/partial queries and cross-brand/direct-code collisions; no catalog mappings added");
