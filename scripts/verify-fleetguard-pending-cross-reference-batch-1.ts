import { products } from "@/data/products/index";
import {
  isPreliminaryRelation,
  normalizeProductRelations,
} from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

type BatchPair = {
  fleetguard: string;
  donaldson: string;
  pages: string;
  application: string;
  category: string;
};

const batchPairs: BatchPair[] = [
  {
    fleetguard: "FF149",
    donaldson: "P550012",
    pages: "6,7,8,10,11",
    application:
      "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/GEHL/JOHN DEERE/NEW HOLLAND",
    category: "Fuel",
  },
  {
    fleetguard: "FF167",
    donaldson: "P556245",
    pages: "6,7,8,9,10,11",
    application:
      "AGCO; CNH; JOHN DEERE; skid steer BOBCAT/GEHL/JCB/JOHN DEERE/NEW HOLLAND",
    category: "Fuel",
  },
  {
    fleetguard: "FF42000",
    donaldson: "P553004",
    pages: "6,7,8,10,11",
    application: "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/NEW HOLLAND",
    category: "Fuel",
  },
  {
    fleetguard: "FF5052",
    donaldson: "P550440",
    pages: "6,7,8,10,11",
    application: "AGCO; CNH; JOHN DEERE; skid steer CASE-IH CNH/NEW HOLLAND",
    category: "Fuel",
  },
  {
    fleetguard: "FS1212",
    donaldson: "P558000",
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

function assertStoredRelation(pair: BatchPair) {
  const product = findProduct(pair.donaldson);
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  const relation = relations.find(
    (item) =>
      item.brand === "Fleetguard" && item.partNumber === pair.fleetguard,
  );

  assert(relation, `${pair.donaldson} missing Fleetguard ${pair.fleetguard}`);
  assert(
    relation!.relationType === "unknown",
    `${pair.donaldson}/${pair.fleetguard} relationType should remain unknown`,
  );
  assert(
    relation!.verificationStatus === "pending",
    `${pair.donaldson}/${pair.fleetguard} verificationStatus should remain pending`,
  );
  assert(
    !relation!.approvedBy && !relation!.approvedAt,
    `${pair.donaldson}/${pair.fleetguard} must not be approval-marked`,
  );
  assert(
    relation!.evidenceNote?.includes("EVIDENCE_CANDIDATE_OFFICIAL_EXCERPT") &&
      relation!.evidenceNote.includes(`printed PDF pages ${pair.pages}`) &&
      relation!.evidenceNote.includes(pair.application) &&
      relation!.evidenceNote.includes(pair.category),
    `${pair.donaldson}/${pair.fleetguard} evidenceNote is missing PDF context`,
  );
}

function assertSearchQuery(pair: BatchPair, query: string) {
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
    top._matchedRelation?.brand === "Fleetguard" &&
      top._matchedRelation.partNumber === pair.fleetguard,
    `${query} did not preserve Fleetguard matched relation metadata`,
  );
  const matchedRelation = top._matchedRelation;
  assert(matchedRelation, `${query} should preserve matched relation metadata`);
  assert(
    matchedRelation.relationType === "unknown" &&
      matchedRelation.verificationStatus === "pending",
    `${query} matched relation should be unknown/pending`,
  );
  assert(
    isPreliminaryRelation(top._matchedRelation),
    `${query} should classify as preliminary`,
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

assert(products.length === 453, `active catalog changed: ${products.length}`);

for (const pair of batchPairs) {
  assertStoredRelation(pair);

  for (const query of [pair.fleetguard, `Fleetguard ${pair.fleetguard}`]) {
    const results = assertSearchQuery(pair, query);
    console.log(
      `${query} -> ${results
        .slice(0, 3)
        .map((product) => product.partNo)
        .join(", ")}`,
    );
  }
}

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

console.log("Fleetguard pending cross-reference batch 1 verified.");
