import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import { focusSearchResults, searchFocusedProducts, searchProducts } from "@/lib/search/search";
import { normalizeProductRelations } from "@/lib/products/relations";
import { buildRfqReferenceContext } from "@/lib/rfq/referenceContext";

const key = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const before = JSON.stringify(products);
for (const query of ["C20500", "c 20 500", "C 20 500", "P778994", "p 778994"]) {
  const results = searchFocusedProducts(query);
  const exact = key(query).startsWith("c") ? "C 20 500" : "P778994";
  const other = exact === "P778994" ? "C 20 500" : "P778994";
  assert.equal(results[0].partNo, exact);
  const counterpart = results.find((item) => item.partNo === other)!;
  assert.ok(counterpart);
  assert.equal(counterpart._matchType, "Cross Ref");
  assert.equal(counterpart._matchedRelation?.verificationStatus, "verified");
  assert.equal(counterpart._matchedRelation?.partNumber, exact);
  assert.equal(buildRfqReferenceContext({ searchQuery: query, offeredPartNo: other,
    matchType: counterpart._matchType, matchedRelation: counterpart._matchedRelation
  })?.matchedRelation?.partNumber, exact);
  assert.equal(new Set(results.map((item) => item.id)).size, results.length);
  assert.equal(searchFocusedProducts(query, { limit: 1 }).length, 1);
  assert.ok(!results.some((item) => ["CF 500", "P780036"].includes(item.partNo)));
}

// Audit every published verified Donaldson/MANN edge, including absent endpoints.
const pairs = new Map<string, { from: string; to: string; active: boolean }>();
for (const product of products) {
  for (const relation of normalizeProductRelations([
    ...(product.refs ?? []), ...(product.crossReferences ?? []),
  ], "unknown")) {
    if (relation.verificationStatus !== "verified" || relation.relationType !== "equivalent") continue;
    if (!["donaldson", "mannfilter"].includes(key(product.brand))) continue;
    if (!["donaldson", "mannfilter"].includes(key(relation.brand ?? ""))) continue;
    if (key(product.brand) === key(relation.brand ?? "")) continue;
    const counterpart = products.find((item) => key(item.partNo) === key(relation.partNumber) &&
      key(item.brand) === key(relation.brand ?? ""));
    pairs.set([key(product.partNo), key(relation.partNumber)].sort().join("|"), {
      from: product.partNo, to: counterpart?.partNo ?? relation.partNumber, active: Boolean(counterpart),
    });
    if (!counterpart) continue;
    for (const [query, expected] of [[product.partNo, counterpart.partNo], [counterpart.partNo, product.partNo]]) {
      const results = searchFocusedProducts(query);
      assert.equal(key(results[0].partNo), key(query));
      assert.ok(results.some((item) => item.partNo === expected), `${query} missing ${expected}`);
    }
  }
}
console.log("Published verified Donaldson/MANN audit:", JSON.stringify([...pairs.values()]));

// Synthetic direct-edge controls exercise eligibility without importing catalog data.
const originalLength = products.length;
const relation = { brand: "Test Brand", partNumber: "QA-EXACT", relationType: "equivalent",
  verificationStatus: "verified", evidenceUrl: "https://example.test/manufacturer",
  approvedBy: "QA", approvedAt: "2026-11-25" };
try {
  const exact = { id: "qa-exact", brand: "Test Brand", partNo: "QA-EXACT" };
  products.push(exact);
  const cases = [
    ["direct", relation, true],
    ["legacy", "QA-EXACT", false],
    ["pending", { ...relation, verificationStatus: "pending" }, false],
    ["hidden", { ...relation, verificationStatus: "hidden" }, false],
    ["rejected", { ...relation, verificationStatus: "rejected" }, false],
    ["unapproved", { ...relation, approvedBy: undefined }, false],
    ["wrong-brand", { ...relation, brand: "Other Brand" }, false],
    ["replacement", { ...relation, relationType: "replaced_by" }, false],
    ["companion", { ...relation, relationType: "companion" }, false],
    ["size-only", { ...relation, relationType: "alternative" }, false],
    ["transitive", { ...relation, partNumber: "QA-direct" }, false],
  ] as const;
  for (const [name, edge] of cases) products.push({ id: `qa-${name}`, partNo: `QA-${name}`,
    brand: "Test Brand", crossReferences: [edge] });
  const results = focusSearchResults(searchProducts("QA-EXACT"));
  for (const [name, , expected] of cases) assert.equal(results.some((item) => item.id === `qa-${name}`), expected, name);
  assert.equal(results[0].id, "qa-exact");
  // An explicit hidden duplicate vetoes a verified copy.
  products[originalLength + 1].refs = [{ ...relation, verificationStatus: "hidden" }];
  assert.ok(!focusSearchResults(searchProducts("QA-EXACT")).some((item) => item.id === "qa-direct"));
  // One-way stored equivalence supports the reverse search, without a missing card.
  delete products[originalLength + 1].refs;
  assert.ok(searchFocusedProducts("QA-direct").some((item) => item.id === "qa-exact"));
  assert.ok(!searchFocusedProducts("QA-replacement").some((item) => item.id === "qa-exact"),
    "Directional replacement must not become symmetric equivalence");
  products[originalLength].crossReferences = [{ ...relation, partNumber: "QA-ABSENT" }];
  assert.ok(!searchFocusedProducts("QA-EXACT").some((item) => item.partNo === "QA-ABSENT"),
    "An absent endpoint must never create a synthetic product card");
} finally {
  products.splice(originalLength);
}
assert.equal(JSON.stringify(products), before, "Search must not mutate catalog/specs/stock/relations");
console.log(`PASS verified direct search; ${pairs.size} published Donaldson/MANN pairs audited.`);
