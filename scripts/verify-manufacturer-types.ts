import assert from "node:assert/strict";
import { products } from "../data/products/index";
import { getManufacturerType, verifiedManufacturerTypes } from "../lib/products/manufacturerType";

const snapshot = JSON.stringify(products);
for (const [partNo, evidence] of Object.entries(verifiedManufacturerTypes)) {
  const product = products.find(p => p.partNo === partNo && p.brand.toLowerCase() === "donaldson");
  assert.ok(product, `${partNo} must be in active catalog`);
  assert.equal(getManufacturerType(product, "en"), evidence.label);
  assert.ok(getManufacturerType(product, "th")?.includes(evidence.label));
  if (evidence.sourceKind === "manufacturer_page") {
    assert.match(evidence.source, /^https:\/\/shop.donaldson.com\//);
  } else {
    assert.equal(partNo, "P551006");
    assert.equal(evidence.label, "FUEL FILTER");
    assert.equal(evidence.thai, "ไส้กรองเชื้อเพลิง");
    assert.match(evidence.source, /user-supplied.*P551006.*visually verified by dot/i);
    assert.equal(evidence.originalWording, undefined);
  }
  assert.equal(getManufacturerType({brand:"MANN",partNo},"en"),undefined);
}
for (const product of products) {
  if (product.brand.toLowerCase() !== "donaldson" || !verifiedManufacturerTypes[product.partNo]) {
    assert.equal(getManufacturerType(product,"en"),undefined);
  }
}
assert.equal(JSON.stringify(products), snapshot, "all catalog fields, specs and relations remain unchanged");
console.log(`PASS ${Object.keys(verifiedManufacturerTypes).length} verified types; brand isolation; unchanged complete catalog`);
