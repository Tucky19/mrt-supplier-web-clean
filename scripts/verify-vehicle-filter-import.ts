import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import { vehicleFilterProducts } from "@/data/products/products.vehicle-filters";
import { normalizeProductRelations } from "@/lib/products/relations";
import { searchFocusedProducts } from "@/lib/search/search";

assert.equal(vehicleFilterProducts.length, 18);
assert.equal(vehicleFilterProducts.reduce((n, p) => n + (p.vehicleApplications?.length ?? 0), 0), 19);
assert.equal(vehicleFilterProducts.filter((p) => p.stockStatus === "in_stock").length, 15);
assert.deepEqual(vehicleFilterProducts.filter((p) => p.stockStatus === "request").map((p) => p.partNo).sort(), ["HU721X", "P903541", "P955737"]);

for (const source of vehicleFilterProducts) {
  const matching = products.filter((p) => p.partNo === source.partNo);
  assert.equal(matching.length, 1, `Duplicate/missing ${source.partNo}`);
  const product = matching[0];
  assert.deepEqual(product.vehicleApplications, source.vehicleApplications);
  assert.equal(product.stockStatus, source.stockStatus);
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  for (const relation of normalizeProductRelations(source.crossReferences, "unknown")) {
    assert.equal(relations.filter((r) => r.brand === relation.brand && r.partNumber === relation.partNumber).length, 1);
    assert(searchFocusedProducts(relation.partNumber, { limit: 100 }).some((r) => r.partNo === product.partNo), `Missing OEM/reference search ${relation.partNumber}`);
  }
  for (const line of source.vehicleApplications ?? []) {
    const vehicle = line.split(":")[0];
    assert(searchFocusedProducts(vehicle, { limit: 100 }).some((r) => r.partNo === product.partNo), `Missing vehicle search ${vehicle}`);
  }
}

const serialized = JSON.stringify(vehicleFilterProducts);
for (const excluded of ["S4436-11070", "32658092", "2141848", "23300-OLO41", "17801-OL010", "P902384", "P902385", "C40006", "C331460/1", "CF1940"]) {
  assert(!serialized.includes(excluded), `Canceled row imported: ${excluded}`);
}
assert(!/"(?:price|quantity|qty|amount)"/.test(serialized));
assert(!serialized.includes("Back Cup"));
assert(products.find((p) => p.partNo === "P552050")?.vehicleApplications?.includes("HINO MEGA FM1J: กรองน้ำมันเครื่อง 15613-EVO20 → Donaldson P552050"));
assert.equal(products.find((p) => p.partNo === "P550335")?.vehicleApplications?.length, 2);
for (const [query, expected] of [["BLACK CLUBS BO234", "P550335"], ["BLACK CLUBS BF168", "P506115"]]) {
  assert(searchFocusedProducts(query, { limit: 100 }).some((r) => r.partNo === expected));
}
console.log("PASS: 19 vehicle rows / 18 products, OEM and vehicle search, BLACK CLUBS references, status and exclusion checks.");
