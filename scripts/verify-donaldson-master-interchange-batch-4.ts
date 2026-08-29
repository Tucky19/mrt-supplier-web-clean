import { products } from "@/data/products/index";
import { searchProducts } from "@/lib/search/search";

type ExpectedRelation = {
  brand: string;
  competitor: string;
  donaldson: string;
  pdfPage: number;
  printedPage: number;
};

const expected: ExpectedRelation[] = [
  { brand: "Fleetguard", competitor: "AF1733K", donaldson: "P181059", pdfPage: 106, printedPage: 1068 },
  { brand: "Fleetguard", competitor: "AF1869", donaldson: "P150135", pdfPage: 106, printedPage: 1068 },
  { brand: "Fleetguard", competitor: "AF25062", donaldson: "P780006", pdfPage: 106, printedPage: 1068 },
  { brand: "MANN & HUMMEL", competitor: "C18369", donaldson: "P181119", pdfPage: 206, printedPage: 1168 },
  { brand: "MANN & HUMMEL", competitor: "C1881", donaldson: "P119374", pdfPage: 206, printedPage: 1168 },
  { brand: "Sakura", competitor: "FS8002", donaldson: "P550388", pdfPage: 265, printedPage: 1227 },
  { brand: "Sakura", competitor: "H5502", donaldson: "P550816", pdfPage: 265, printedPage: 1227 },
  { brand: "Sure Filter", competitor: "SFA1009", donaldson: "P181009", pdfPage: 279, printedPage: 1241 },
  { brand: "Sure Filter", competitor: "SFF1212", donaldson: "P558000", pdfPage: 280, printedPage: 1242 },
  { brand: "Wix", competitor: "33651XE", donaldson: "P550467", pdfPage: 318, printedPage: 1280 },
];

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function relationResults(query: string) {
  return searchProducts(query, { limit: 50 }).filter(
    (result) =>
      result._matchType === "Cross Ref" ||
      result._matchType === "Same-brand Ref",
  );
}

for (const item of expected) {
  const product = products.find((candidate) => candidate.partNo === item.donaldson);
  assert(product, `missing active Donaldson product ${item.donaldson}`);

  const relation = product?.crossReferences?.find(
    (candidate) =>
      typeof candidate !== "string" &&
      candidate.brand === item.brand &&
      candidate.partNumber === item.competitor,
  );

  assert(relation && typeof relation !== "string", `missing ${item.brand} ${item.competitor}`);
  if (!relation || typeof relation === "string") continue;

  assert(relation.relationType === "unknown", `${item.competitor} relationType changed`);
  assert(relation.verificationStatus === "pending", `${item.competitor} status changed`);
  assert(!relation.approvedBy && !relation.approvedAt, `${item.competitor} must not be approved`);
  assert(relation.evidence === "Donaldson MASTER INTERCHANGE", `${item.competitor} evidence changed`);
  assert(
    relation.evidenceNote?.includes(`PDF file page ${item.pdfPage}`) &&
      relation.evidenceNote.includes(`printed page ${item.printedPage}`) &&
      relation.evidenceNote.includes("same-row mapping") &&
      relation.evidenceNote.includes("FOR REFERENCE PURPOSES ONLY"),
    `${item.competitor} evidence note is incomplete`,
  );

  for (const query of [item.competitor, `${item.brand} ${item.competitor}`]) {
    const matches = relationResults(query);
    assert(matches[0]?.partNo === item.donaldson, `${query} should rank ${item.donaldson} first`);
    assert(
      matches.filter((result) => result.partNo !== item.donaldson).length === 0,
      `${query} created unexpected relation ambiguity`,
    );
    assert(
      matches[0]?._matchedRelation?.verificationStatus === "pending",
      `${query} should preserve pending metadata`,
    );
  }
}

for (const excluded of ["C18436", "SFA1735PF"]) {
  assert(
    relationResults(excluded).length === 0,
    `${excluded} must remain excluded because its source mappings are ambiguous`,
  );
}

const exact = searchProducts("P551315", { limit: 5 });
assert(exact[0]?.partNo === "P551315" && exact[0]?._matchType === "Exact", "exact search regressed");

console.log("Donaldson Master Interchange Batch 4 validation passed");
console.log("10 pending relations validated with part-only and brand-prefixed queries");
console.log("C18436 and SFA1735PF remain excluded as ambiguous");
