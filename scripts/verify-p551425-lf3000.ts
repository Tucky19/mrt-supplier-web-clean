import assert from "node:assert/strict";
import { importedProducts } from "@/data/products/products.imported";
import index from "@/data/search-index.v2.json";
import { products } from "@/data/products/index";
import { relationPartNumbers } from "@/lib/products/relations";
import { createExactProductLookup, searchProducts } from "@/lib/search/search";

// Rejected: fuel/water separator cartridge versus lube spin-on (official pages
// recorded in cross-reference-next-batch-template.md, reviewed 2026-11-16).
for (const field of ["refs", "crossReferences"] as const) {
  const source = importedProducts.find((item) => item.partNo === "P553000")!;
  assert.ok(source[field].includes("Fleetguard: LF3000"));
}
const product = products.find((item) => item.partNo === "P551425")!;
const preserved = products.find((item) => item.partNo === "P553000")!;
assert.ok(product);
for (const field of ["refs", "crossReferences"] as const) {
  assert.ok(!relationPartNumbers(product[field], "unknown").some((ref) => /LF3000/i.test(ref)));

}
assert.ok(relationPartNumbers(preserved.crossReferences, "unknown").some((ref) => /LF3000/i.test(ref)));
for (const query of ["LF3000", "LF 3000", "Fleetguard LF3000"]) {
  const results = searchProducts(query, { limit: 1000 });
  assert.ok(!results.some((item) => item.partNo === "P551425"), query);
  assert.ok(results.some((item) => item.partNo === "P553000"), query);
}
assert.ok(!createExactProductLookup().find("LF3000").some((item) => item.partNo === "P551425"));
for (const field of ["tokenIndex", "refIndex", "xrefIndex"] as const) {
  for (const [key, ids] of Object.entries(index[field])) {
    if (key.includes("lf3000")) assert.ok(!ids.includes(product.id), `${field}.${key}`);
  }
}
const indexed = index.items.find((item) => item.id === product.id)!;
assert.ok(![...indexed.refs, ...indexed.crossReferences].some((ref) => /LF3000/i.test(ref)));
console.log("PASS: rejected P551425/LF3000 canonical, search, exact lookup and index; P553000 preserved");


