import { products } from "@/data/products/index";
import {
  hasRelationEvidence,
  normalizeProductRelations,
  type ProductRelation,
} from "@/lib/products/relations";

type InventoryRow = {
  productPartNo: string;
  productBrand: string;
  relation: ProductRelation;
};

function collectRows() {
  const rows: InventoryRow[] = [];

  for (const product of products) {
    for (const relation of normalizeProductRelations(product.refs, "unknown")) {
      rows.push({
        productPartNo: product.partNo,
        productBrand: product.brand,
        relation,
      });
    }

    for (const relation of normalizeProductRelations(
      product.crossReferences,
      "unknown",
    )) {
      rows.push({
        productPartNo: product.partNo,
        productBrand: product.brand,
        relation,
      });
    }

    for (const relation of normalizeProductRelations(
      product.pairedParts?.map((part) => ({
        partNumber: part.partNo,
        relationType: "companion",
        note: part.note,
      })),
      "companion",
    )) {
      rows.push({
        productPartNo: product.partNo,
        productBrand: product.brand,
        relation,
      });
    }
  }

  return rows;
}

function formatRow(row: InventoryRow) {
  return [
    `${row.productBrand} ${row.productPartNo}`,
    row.relation.relationType,
    row.relation.partNumber,
    row.relation.brand ?? "",
    row.relation.verificationStatus,
    row.relation.evidenceUrl ?? row.relation.source ?? row.relation.evidence ?? "",
  ].join(" | ");
}

const rows = collectRows();
const readyForBossReview = rows.filter((row) => hasRelationEvidence(row.relation));
const missingEvidence = rows.filter((row) => !hasRelationEvidence(row.relation));
const autoVerified = rows.filter(
  (row) =>
    row.relation.verificationStatus === "verified" &&
    (!hasRelationEvidence(row.relation) ||
      !row.relation.approvedBy ||
      !row.relation.approvedAt),
);
const duplicateKeys = new Set<string>();
const seenKeys = new Set<string>();

for (const row of rows) {
  const key = [
    row.productBrand.trim().toLowerCase(),
    row.productPartNo.trim().toLowerCase().replace(/[\s/_-]+/g, ""),
    row.relation.relationType,
    row.relation.partNumber.trim().toLowerCase().replace(/[\s/_-]+/g, ""),
  ].join("|");

  if (seenKeys.has(key)) {
    duplicateKeys.add(key);
  } else {
    seenKeys.add(key);
  }
}

console.log("Cross-reference governance inventory");
console.log(`Active products: ${products.length}`);
console.log(`Relations total: ${rows.length}`);
console.log(`Ready for Boss review: ${readyForBossReview.length}`);
console.log(`Missing evidence: ${missingEvidence.length}`);
console.log(`Verified without approval metadata: ${autoVerified.length}`);
console.log(`Duplicate normalized relations: ${duplicateKeys.size}`);
console.log("");
console.log("Ready for Boss review samples:");
for (const row of readyForBossReview.slice(0, 20)) {
  console.log(formatRow(row));
}
console.log("");
console.log("Missing evidence samples:");
for (const row of missingEvidence.slice(0, 20)) {
  console.log(formatRow(row));
}
