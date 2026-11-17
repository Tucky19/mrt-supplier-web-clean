import assert from "node:assert/strict";
import { getVerifiedProductCopy } from "../lib/products/verifiedCopy";
import { products } from "../data/products/index";

for (const partNo of ["P502649", "P554004"]) {
  const product = products.find((p) => p.partNo === partNo)!;
  assert.ok(product, partNo);
  const snapshot = JSON.stringify(product);
  for (const locale of ["th", "en"]) {
    const copy = getVerifiedProductCopy(product, locale)!;
    assert.ok(copy?.title && copy.metaTitle.includes(partNo));
    assert.ok(copy.metaDescription.includes(partNo));
    assert.equal(copy.paragraphs.length, 2);
    assert.equal(JSON.stringify(product), snapshot, "catalog must stay unchanged");
    if (partNo === "P502649") {
      assert.ok(copy.verificationNote);
      assert.notEqual(copy.category, "Filter");
      assert.match(copy.title, /OAT/);
    }
    if (locale === "en") assert.doesNotMatch(JSON.stringify(copy), /[\u0e00-\u0e7f]/);
  }
}
for (const product of products.filter((p) => !["P502649", "P554004"].includes(p.partNo))) {
  assert.equal(getVerifiedProductCopy(product, "th"), undefined);
}
assert.equal(getVerifiedProductCopy({brand:"OTHER",partNo:"P502649"},"en"),undefined);
console.log("PASS: TH/EN copy, unchanged catalog, and unrelated-product isolation");
