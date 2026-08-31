import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import { hasVerifiedMrtStock } from "@/lib/products/stock";
import { normalizeProductRelations } from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

const fleetguard = products.find((product) => product.partNo === "FS1242");
const donaldson = products.find((product) => product.partNo === "P551864");

assert(fleetguard, "missing active Fleetguard FS1242");
assert(donaldson, "missing active Donaldson P551864");
assert.equal(fleetguard.brand, "Fleetguard");
assert.equal(hasVerifiedMrtStock(fleetguard), true, "FS1242 must carry verified MRT stock evidence");
const cumminsReference = normalizeProductRelations(fleetguard.refs, "unknown").find(
  (item) => item.brand === "Cummins" && item.partNumber === "3355903",
);
assert(cumminsReference, "FS1242 missing structured Cummins 3355903 reference");
assert.equal(cumminsReference.verificationStatus, "pending");
assert.equal(donaldson.brand, "Donaldson");

const relation = normalizeProductRelations(donaldson.crossReferences, "unknown").find(
  (item) => item.brand === "Fleetguard" && item.partNumber === "FS1242",
);

assert(relation, "P551864 missing Fleetguard FS1242 relation");
assert.equal(relation.relationType, "unknown");
assert.equal(relation.verificationStatus, "pending");
assert.equal(relation.approvedBy, undefined);
assert.equal(relation.approvedAt, undefined);
assert.match(relation.evidenceNote ?? "", /FOR REFERENCE PURPOSES ONLY/);

const results = searchProducts("FS1242", { limit: 48 });
assert.deepEqual(
  results.slice(0, 2).map((product) => product.partNo),
  ["FS1242", "P551864"],
  "FS1242 search must show verified MRT stock first and Donaldson alternative second",
);
assert.equal(results[0]?._matchType, "Exact");
assert.equal(results[1]?._matchType, "Cross Ref");
assert.equal(
  results.some(
    (product) =>
      product._matchedRelation?.relationType === "unknown" &&
      product._matchedRelation.verificationStatus === "pending",
  ),
  true,
  "FS1242 results must expose the pending P551864 relation for the page warning",
);

for (const product of products) {
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  assert.equal(
    relations.some(
      (item) => item.brand === "Fleetguard" && item.partNumber === "FS1242" && product.partNo === "P555001",
    ),
    false,
    "P555001 must not be related to Fleetguard FS1242",
  );
}

assert.equal(products.length, 455, `active catalog changed: ${products.length}`);

console.log("FS1242/P551864 MRT stock batch verification passed.");
