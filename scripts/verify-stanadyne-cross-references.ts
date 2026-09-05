import { products } from "@/data/products/index";
import { stanadyneCrossReferencesByDonaldson } from "@/data/products/stanadyne-cross-references";
import { normalizeProductRelations } from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

const EXPECTED_TOTAL = 428;
const EXPECTED_DONALDSON_PRODUCTS = 17;
const EXPECTED_ACTIVE_MAPPINGS = 223;
const SOURCE_TITLE = "Fuel Filters for Stanadyne Fuel Systems";

const spotChecks = [
  ["Baldwin", "BF7677D", "P551425"],
  ["Fleetguard", "FS19992", "P551425"],
  ["Mann + Hummel", "WK8147", "P551425"],
  ["Stanadyne", "31302", "P551425"],
  ["Wix", "33808", "P551425"],
  ["Luber-finer", "L22023F", "P551436"],
] as const;

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const allSupplementalRelations = Object.values(
  stanadyneCrossReferencesByDonaldson,
).flat();

assert(
  allSupplementalRelations.length === EXPECTED_TOTAL,
  `expected ${EXPECTED_TOTAL} mappings`,
);
assert(
  Object.keys(stanadyneCrossReferencesByDonaldson).length ===
    EXPECTED_DONALDSON_PRODUCTS,
  `expected ${EXPECTED_DONALDSON_PRODUCTS} Donaldson products`,
);

const activePartNumbers = new Set(products.map((product) => product.partNo));
const activeMappings = Object.entries(stanadyneCrossReferencesByDonaldson)
  .filter(([partNumber]) => activePartNumbers.has(partNumber))
  .flatMap(([, relations]) => relations);

assert(
  activeMappings.length === EXPECTED_ACTIVE_MAPPINGS,
  `expected ${EXPECTED_ACTIVE_MAPPINGS} active mappings`,
);

for (const [brand, competitorPartNumber, donaldsonPartNumber] of spotChecks) {
  const product = products.find(
    (candidate) => candidate.partNo === donaldsonPartNumber,
  );
  assert(product, `missing active product ${donaldsonPartNumber}`);

  const relation = normalizeProductRelations(
    product?.crossReferences ?? [],
    "unknown",
  ).find(
    (candidate) =>
      candidate.brand === brand &&
      candidate.partNumber === competitorPartNumber,
  );

  assert(relation, `missing ${brand} ${competitorPartNumber}`);
  assert(relation?.relationType === "equivalent", "relation type changed");
  assert(
    relation?.verificationStatus === "verified",
    "verification status changed",
  );
  assert(relation?.evidence === SOURCE_TITLE, "evidence title changed");
  assert(relation?.approvedBy === "Boss/MRT Supplier", "approval changed");
  assert(relation?.approvedAt === "2026-09-04", "approval date changed");

  for (const query of [competitorPartNumber, `${brand} ${competitorPartNumber}`]) {
    const matches = searchProducts(query, { limit: 10 });
    assert(
      matches[0]?.partNo === donaldsonPartNumber &&
        matches[0]?._matchType === "Cross Ref",
      `${query} should rank ${donaldsonPartNumber} first`,
    );
  }
}

console.log("Stanadyne cross-reference validation passed");
console.log(`${EXPECTED_TOTAL} mappings across ${EXPECTED_DONALDSON_PRODUCTS} Donaldson products`);
console.log(`${EXPECTED_ACTIVE_MAPPINGS} mappings attached to active products`);
