import { products } from "@/data/products/index";
import {
  isPreliminaryRelation,
  normalizeProductRelations,
} from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

type BatchPair = {
  brand: "Fleetguard" | "Wix" | "MANN & HUMMEL" | "Sure Filter" | "Sakura";
  partNumber: string;
  donaldson: string;
  pdfFilePage: number;
  printedPage: string;
};

const DISCLAIMER =
  "FOR REFERENCE PURPOSES ONLY—CHECK VEHICLE APPLICATION LISTING FOR CORRECT DONALDSON FILTER.";

const batchPairs: BatchPair[] = [
  {
    brand: "Fleetguard",
    partNumber: "AF25555",
    donaldson: "P827653",
    pdfFilePage: 107,
    printedPage: "1069",
  },
  {
    brand: "Fleetguard",
    partNumber: "AF25558",
    donaldson: "P829333",
    pdfFilePage: 107,
    printedPage: "1069",
  },
  {
    brand: "Wix",
    partNumber: "CR522",
    donaldson: "P556245",
    pdfFilePage: 317,
    printedPage: "1279",
  },
  {
    brand: "Wix",
    partNumber: "33405MP",
    donaldson: "P558000",
    pdfFilePage: 318,
    printedPage: "1280",
  },
  {
    brand: "MANN & HUMMEL",
    partNumber: "A5008340004",
    donaldson: "P181063",
    pdfFilePage: 205,
    printedPage: "1167",
  },
  {
    brand: "Sure Filter",
    partNumber: "SFA0015",
    donaldson: "P150135",
    pdfFilePage: 279,
    printedPage: "1241",
  },
  {
    brand: "Sure Filter",
    partNumber: "SFA0057S",
    donaldson: "P158671",
    pdfFilePage: 279,
    printedPage: "1241",
  },
  {
    brand: "Sakura",
    partNumber: "A5639",
    donaldson: "P181191",
    pdfFilePage: 264,
    printedPage: "1226",
  },
  {
    brand: "Sakura",
    partNumber: "C1101",
    donaldson: "P550227",
    pdfFilePage: 265,
    printedPage: "1227",
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
  return product;
}

function assertStoredRelation(pair: BatchPair) {
  const product = findProduct(pair.donaldson);
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  const relation = relations.find(
    (item) =>
      item.brand === pair.brand && item.partNumber === pair.partNumber,
  );

  assert(
    relation,
    `${pair.donaldson} missing ${pair.brand} ${pair.partNumber}`,
  );
  assert(
    relation.relationType === "unknown",
    `${pair.donaldson}/${pair.partNumber} relationType should be unknown`,
  );
  assert(
    relation.verificationStatus === "pending",
    `${pair.donaldson}/${pair.partNumber} verificationStatus should remain pending`,
  );
  assert(
    relation.evidence === "Donaldson MASTER INTERCHANGE",
    `${pair.donaldson}/${pair.partNumber} evidence title changed`,
  );
  assert(
    !relation.approvedBy && !relation.approvedAt,
    `${pair.donaldson}/${pair.partNumber} should not include approval metadata`,
  );
  assert(
    relation.evidenceNote?.includes(`PDF file page ${pair.pdfFilePage}`) &&
      relation.evidenceNote.includes(`printed page ${pair.printedPage}`) &&
      relation.evidenceNote.includes(DISCLAIMER),
    `${pair.donaldson}/${pair.partNumber} evidenceNote is missing PDF context`,
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
    top._matchedRelation?.brand === pair.brand &&
      top._matchedRelation.partNumber === pair.partNumber,
    `${query} did not preserve matched relation metadata`,
  );
  assert(
    top._matchedRelation.relationType === "unknown" &&
      top._matchedRelation.verificationStatus === "pending",
    `${query} matched relation should be unknown/pending`,
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

  for (const query of [pair.partNumber, `${pair.brand} ${pair.partNumber}`]) {
    const results = assertSearchQuery(pair, query);
    console.log(
      `${query} -> ${results
        .slice(0, 3)
        .map((product) => product.partNo)
        .join(", ")}`,
    );
  }

  const exactResults = searchProducts(pair.donaldson, { limit: 48 });
  assert(
    exactResults[0]?.partNo === pair.donaldson &&
      exactResults[0]._matchType === "Exact",
    `${pair.donaldson} exact search behavior changed`,
  );
  assert(
    !hasPreliminaryRelationNoticeResult(exactResults),
    `${pair.donaldson} exact search should not trigger reference notice`,
  );
}

for (const excluded of ["P550388", "FS1006", "LF3000", "LF9009", "33358"]) {
  assert(
    batchPairs.every(
      (pair) => pair.donaldson !== excluded && pair.partNumber !== excluded,
    ),
    `${excluded} should not be part of Batch 2`,
  );
}

console.log("Donaldson Master Interchange cross-reference batch 2 verified.");
