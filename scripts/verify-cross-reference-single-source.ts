import assert from "node:assert/strict";

import { products } from "@/data/products/index";
import { normalizeProduct } from "@/data/products/normalize";
import { relationPartNumbers } from "@/lib/products/relations";
import { searchFocusedProducts } from "@/lib/search/search";

function key(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

const refsOnly = normalizeProduct({
  id: "refs-only",
  partNo: "TEST-REFS",
  brand: "TEST",
  refs: ["ABC 123"],
});
assert.deepEqual(refsOnly.refs, ["ABC 123"]);
assert.deepEqual(refsOnly.crossReferences, []);

const crossReferencesOnly = normalizeProduct({
  id: "cross-only",
  partNo: "TEST-CROSS",
  brand: "TEST",
  crossReferences: ["XYZ 789"],
});
assert.deepEqual(crossReferencesOnly.refs, []);
assert.deepEqual(crossReferencesOnly.crossReferences, ["XYZ 789"]);

const duplicatedLegacy = normalizeProduct({
  id: "duplicate",
  partNo: "TEST-DUPLICATE",
  brand: "TEST",
  refs: ["ABC 123", "KEEP-456"],
  crossReferences: ["ABC-123"],
});
assert.deepEqual(duplicatedLegacy.refs, ["KEEP-456"]);
assert.deepEqual(duplicatedLegacy.crossReferences, ["ABC-123"]);

const structuredRelation = {
  partNumber: "ABC 123",
  relationType: "companion" as const,
  verificationStatus: "pending" as const,
  note: "Structured metadata must not be discarded by legacy cleanup.",
};
const structuredOverlap = normalizeProduct({
  id: "structured",
  partNo: "TEST-STRUCTURED",
  brand: "TEST",
  refs: [structuredRelation],
  crossReferences: ["ABC123"],
});
assert.equal(typeof structuredOverlap.refs?.[0], "object");
assert.deepEqual(structuredOverlap.crossReferences, ["ABC123"]);

const overlaps = products.flatMap((product) => {
  const refKeys = new Set(
    relationPartNumbers(product.refs ?? [], "unknown").map(key),
  );
  return relationPartNumbers(product.crossReferences ?? [], "unknown")
    .filter((partNo) => refKeys.has(key(partNo)))
    .map((partNo) => ({ product: product.partNo, partNo }));
});
assert.deepEqual(overlaps, []);

for (const query of ["FS1006", "P181049", "P500202"]) {
  assert.ok(
    searchFocusedProducts(query, { limit: 48 }).length > 0,
    `Expected legacy relation query ${query} to remain searchable`,
  );
}

console.log(
  JSON.stringify(
    {
      activeProducts: products.length,
      overlappingRelations: overlaps.length,
      regressionQueries: ["FS1006", "P181049", "P500202"],
    },
    null,
    2,
  ),
);
