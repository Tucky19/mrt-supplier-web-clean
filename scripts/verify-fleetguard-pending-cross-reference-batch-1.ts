import { products } from "@/data/products/index";
import {
  isPreliminaryRelation,
  normalizeProductRelations,
} from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

type BatchPair = {
  donaldson: string;
  relations: Array<{
    brand: "Fleetguard" | "Baldwin" | "Wix";
    partNumber: string;
  }>;
  pages: string;
  application: string;
  category: string;
};

const batchPairs: BatchPair[] = [
  {
    donaldson: "P550012",
    relations: [
      { brand: "Fleetguard", partNumber: "FF149" },
      { brand: "Baldwin", partNumber: "BF840" },
      { brand: "Wix", partNumber: "33002" },
    ],
    pages: "6,7,8,10,11",
    application:
      "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/GEHL/JOHN DEERE/NEW HOLLAND",
    category: "Fuel",
  },
  {
    donaldson: "P556245",
    relations: [
      { brand: "Fleetguard", partNumber: "FF167" },
      { brand: "Baldwin", partNumber: "BF825" },
      { brand: "Wix", partNumber: "33166MP" },
    ],
    pages: "6,7,8,9,10,11",
    application:
      "AGCO; CNH; JOHN DEERE; skid steer BOBCAT/GEHL/JCB/JOHN DEERE/NEW HOLLAND",
    category: "Fuel",
  },
  {
    donaldson: "P553004",
    relations: [
      { brand: "Fleetguard", partNumber: "FF42000" },
      { brand: "Baldwin", partNumber: "BF988" },
      { brand: "Wix", partNumber: "33358" },
    ],
    pages: "6,7,8,10,11",
    application: "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/NEW HOLLAND",
    category: "Fuel",
  },
  {
    donaldson: "P550440",
    relations: [
      { brand: "Fleetguard", partNumber: "FF5052" },
      { brand: "Baldwin", partNumber: "BF788" },
      { brand: "Wix", partNumber: "33358" },
    ],
    pages: "6,7,8,10,11",
    application: "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/NEW HOLLAND",
    category: "Fuel",
  },
  {
    donaldson: "P558000",
    relations: [
      { brand: "Fleetguard", partNumber: "FS1212" },
      { brand: "Baldwin", partNumber: "BF1212" },
      { brand: "Wix", partNumber: "3405MP" },
    ],
    pages: "6,7,8",
    application: "AGCO; CASE; CNH; JOHN DEERE",
    category: "Fuel",
  },
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isReferenceMatchType(matchType: string | undefined) {
  return matchType === "Cross Ref" || matchType === "Same-brand Ref";
}

function hasPreliminaryRelationNoticeResult(results: ReturnType<typeof searchProducts>) {
  const hasExactPartNumberResult = results.some(
    (product) => product._matchType === "Exact",
  );

  return (
    !hasExactPartNumberResult &&
    results.some(
      (product) =>
        isReferenceMatchType(product._matchType) &&
        isPreliminaryRelation(product._matchedRelation),
    )
  );
}

function findProduct(partNo: string) {
  const product = products.find((item) => item.partNo === partNo);
  assert(product, `missing active Donaldson product ${partNo}`);
  return product!;
}

function assertStoredRelation(
  pair: BatchPair,
  expected: BatchPair["relations"][number],
) {
  const product = findProduct(pair.donaldson);
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  const relation = relations.find(
    (item) =>
      item.brand === expected.brand && item.partNumber === expected.partNumber,
  );

  assert(
    relation,
    `${pair.donaldson} missing ${expected.brand} ${expected.partNumber}`,
  );
  assert(
    relation!.relationType === "unknown",
    `${pair.donaldson}/${expected.partNumber} relationType should remain unknown`,
  );
  assert(
    relation!.verificationStatus === "verified",
    `${pair.donaldson}/${expected.partNumber} verificationStatus should be verified`,
  );
  assert(
    relation!.evidence ===
      "Donaldson Filtration Products for Popular Agricultural Equipment",
    `${pair.donaldson}/${expected.partNumber} evidence is missing document header`,
  );
  assert(
    relation!.approvedBy === "Boss/MRT Supplier" &&
      relation!.approvedAt === "2026-08-27T00:00:00.000Z",
    `${pair.donaldson}/${expected.partNumber} approval metadata is missing`,
  );
  assert(
    relation!.evidenceNote?.includes(
      "Donaldson Filtration Products for Popular Agricultural Equipment",
    ) &&
      relation!.evidenceNote.includes(`printed PDF pages ${pair.pages}`) &&
      relation!.evidenceNote.includes(pair.application) &&
      relation!.evidenceNote.includes(`filter category ${pair.category}`) &&
      !relation!.evidenceNote.includes("not independently confirmed"),
    `${pair.donaldson}/${expected.partNumber} evidenceNote is missing PDF context`,
  );
}

function assertSearchQuery(
  pair: BatchPair,
  expected: BatchPair["relations"][number],
  query: string,
) {
  const results = searchProducts(query, { limit: 48 });
  const [top] = results;

  assert(top, `${query} returned no products`);
  assert(
    top.partNo === pair.donaldson,
    `${query} should rank ${pair.donaldson} first, got ${top.partNo}`,
  );
  assert(
    top._matchType === "Cross Ref",
    `${query} should remain relation-based Cross Ref, got ${top._matchType}`,
  );
  assert(
    top._matchedRelationField === "crossReferences",
    `${query} should match crossReferences`,
  );
  assert(
    top._matchedRelation?.brand === expected.brand &&
      top._matchedRelation.partNumber === expected.partNumber,
    `${query} did not preserve matched relation metadata`,
  );
  const matchedRelation = top._matchedRelation;
  assert(matchedRelation, `${query} should preserve matched relation metadata`);
  assert(
    matchedRelation.relationType === "unknown" &&
      matchedRelation.verificationStatus === "verified",
    `${query} matched relation should be unknown/verified`,
  );
  assert(
    isPreliminaryRelation(top._matchedRelation),
    `${query} should classify as informational because relationType remains unknown`,
  );
  assert(
    hasPreliminaryRelationNoticeResult(results),
    `${query} should trigger the single neutral reference-information notice`,
  );

  const relationMatches = results.filter((product) =>
    isReferenceMatchType(product._matchType),
  );
  assert(
    relationMatches.length === 1 && relationMatches[0].partNo === pair.donaldson,
    `${query} created unexpected relation ambiguity: ${relationMatches
      .map((product) => product.partNo)
      .join(", ")}`,
  );

  return results;
}

function assertExactRelationSet(query: string, expectedParts: string[]) {
  const results = searchProducts(query, { limit: 48 });
  const relationMatches = results.filter((product) =>
    isReferenceMatchType(product._matchType),
  );
  const actualParts = relationMatches.map((product) => product.partNo).sort();
  const expectedSorted = [...expectedParts].sort();

  assert(
    actualParts.join("|") === expectedSorted.join("|"),
    `${query} relation matches changed: ${actualParts.join(", ")}`,
  );
  assert(
    relationMatches.every(
      (product) =>
        product._matchedRelation?.brand === "Wix" &&
        product._matchedRelation.partNumber === "33358" &&
        product._matchedRelation.relationType === "unknown" &&
        product._matchedRelation.verificationStatus === "verified",
    ),
    `${query} should preserve Wix 33358 unknown/verified relation metadata`,
  );
  assert(
    hasPreliminaryRelationNoticeResult(results),
    `${query} should trigger the single neutral reference-information notice`,
  );
}

assert(products.length === 453, `active catalog changed: ${products.length}`);

for (const pair of batchPairs) {
  for (const relation of pair.relations) {
    assertStoredRelation(pair, relation);

    if (relation.brand === "Wix" && relation.partNumber === "33358") {
      continue;
    }

    for (const query of [
      relation.partNumber,
      `${relation.brand} ${relation.partNumber}`,
    ]) {
      const results = assertSearchQuery(pair, relation, query);
      console.log(
        `${query} -> ${results
          .slice(0, 3)
          .map((product) => product.partNo)
          .join(", ")}`,
      );
    }
  }
}

assertExactRelationSet("33358", ["P553004", "P550440"]);
assertExactRelationSet("Wix 33358", ["P553004", "P550440"]);
console.log("33358 / Wix 33358 -> P553004, P550440 documented ambiguity");

const exactResults = searchProducts("P551315", { limit: 48 });
assert(exactResults.length === 1, "P551315 exact search count changed");
assert(
  exactResults[0]?.partNo === "P551315" && exactResults[0]._matchType === "Exact",
  "P551315 exact search behavior changed",
);
assert(
  !hasPreliminaryRelationNoticeResult(exactResults),
  "normal exact product search should not trigger reference notice",
);

console.log("Fleetguard/Baldwin/Wix cross-reference batch 1 verified.");
