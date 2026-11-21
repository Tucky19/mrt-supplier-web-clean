import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import {
  applyConfirmedMrtStock,
  confirmedStockBatch,
} from "@/data/products/confirmed-stock-2026-11-21";
import { hasVerifiedMrtStock } from "@/lib/products/stock";
import { searchProducts } from "@/lib/search/search";

const ids = new Set<string>();
for (const [id, partNo, brand] of confirmedStockBatch) {
  assert(!ids.has(id), `duplicate stock identity: ${id}`);
  ids.add(id);
  const matches = products.filter((p) => p.id === id || p.partNo === partNo);
  assert.equal(matches.length, 1, `non-unique catalog identity: ${id}`);
  const [product] = matches;
  assert.deepEqual([product.id, product.partNo, product.brand], [id, partNo, brand]);
  assert.equal(product.checkAvailability, false, partNo);
  assert.equal(hasVerifiedMrtStock(product), true, partNo);
  assert.equal(product.mrtStockEvidence?.source, "internal_record", partNo);
  assert.equal(product.mrtStockEvidence?.checkedAt, "2026-11-21", partNo);
}

for (const partNo of ["P116446", "P119373", "C 20 500", "FS1242", "LB 13 145/3"]) {
  const exact = searchProducts(partNo).find((p) => p.partNo === partNo);
  assert(exact && ids.has(exact.id), `missing exact search result for ${partNo}`);
  assert.equal(exact.checkAvailability, false, partNo);
  assert.equal(hasVerifiedMrtStock(exact), true, partNo);
}

for (const partNo of ["C1368", "R000164", "R000165", "R000585", "R000586",
  "R000749", "BF141", "P502593", "P551006", "P181042", "TB1394/1X"]) {
  const product = products.find((p) => p.partNo === partNo);
  assert(product && !ids.has(product.id), `held or sourcing part included: ${partNo}`);
  assert.equal(applyConfirmedMrtStock(product), product, partNo);
}

const original = products.find((p) => p.partNo === "P116446")!;
for (const mismatch of [
  { ...original, id: "not-the-original-id" },
  { ...original, partNo: "P119373" },
  { ...original, brand: "MANN-FILTER" },
  { ...original, inquiryOnly: true },
  { ...original, partNumberOnly: true },
  { ...original, dataQuality: "needs_review" as const },
  {
    ...original, crossReferences: [{
      partNumber: "R001", relationType: "replaced_by" as const, verificationStatus: "verified" as const,
    }],
  },
]) {
  assert.equal(applyConfirmedMrtStock(mismatch), mismatch);
}
console.log(`Confirmed stock scope passed: ${ids.size} exact catalog identities.`);
