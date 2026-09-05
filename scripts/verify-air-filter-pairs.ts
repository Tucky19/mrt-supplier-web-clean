import { products } from "@/data/products/index";
import { verifiedAirFilterPairs } from "@/data/products/air-filter-pairs";

function normalizePartNo(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");
}

const productByPartNo = new Map(
  products.map((product) => [normalizePartNo(product.partNo), product]),
);

for (const pair of verifiedAirFilterPairs) {
  const primary = productByPartNo.get(normalizePartNo(pair.primaryPartNo));
  const safety = productByPartNo.get(normalizePartNo(pair.safetyPartNo));

  if (!primary || !safety) {
    throw new Error(
      `Verified air-filter pair is missing from the active catalog: ${pair.primaryPartNo} / ${pair.safetyPartNo}`,
    );
  }

  if (primary.category !== "air_filter" || safety.category !== "air_filter") {
    throw new Error(
      `Verified pair must contain two air filters: ${pair.primaryPartNo} / ${pair.safetyPartNo}`,
    );
  }

  if (
    !primary.pairedParts?.some(
      (part) =>
        normalizePartNo(part.partNo) === normalizePartNo(pair.safetyPartNo) &&
        part.relation === "inner",
    )
  ) {
    throw new Error(`Primary mapping is missing: ${pair.primaryPartNo}`);
  }

  if (
    !safety.pairedParts?.some(
      (part) =>
        normalizePartNo(part.partNo) === normalizePartNo(pair.primaryPartNo) &&
        part.relation === "outer",
    )
  ) {
    throw new Error(`Safety mapping is missing: ${pair.safetyPartNo}`);
  }
}

console.log(
  `Verified ${verifiedAirFilterPairs.length} new Donaldson Primary/Safety relationships.`,
);
