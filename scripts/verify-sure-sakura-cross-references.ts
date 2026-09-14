import assert from "node:assert/strict";
import { products } from "@/data/products/index";
import { sureSakuraMappings } from "@/data/products/sure-sakura-cross-references";
import { isPreliminaryRelation, normalizeProductRelations } from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

const key = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
const brandKey = (value: string) => key(value).replace("SUREFILTER", "SURE");
assert.equal(sureSakuraMappings.length, 427);
assert.equal(new Set(sureSakuraMappings.map(([d, b, p]) => `${d}/${b}/${p}`)).size, 427);

for (const [donaldson, brand, part, pdfPage, printedPage, column] of sureSakuraMappings) {
  const product = products.find((p) => p.partNo === donaldson);
  assert(product && product.brand.toLowerCase() === "donaldson", `Not an active Donaldson: ${donaldson}`);
  const matching = normalizeProductRelations(product.crossReferences, "unknown").filter(
    (r) => brandKey(r.brand ?? "") === brand && key(r.partNumber) === key(part),
  );
  assert.equal(matching.length, 1, `Duplicate or missing ${donaldson}/${brand}/${part}`);
  assert(isPreliminaryRelation(matching[0]));
  assert.equal(matching[0].verificationStatus, "pending");
  assert(!matching[0].approvedBy && !matching[0].approvedAt);
  assert.equal(matching[0].source, `Donaldson-${brand}.pdf`);
  assert(matching[0].evidenceNote?.includes(`PDF file page ${pdfPage}, printed page ${printedPage}, column ${column}`));
  for (const query of [part, `${brand} ${part}`]) {
    const found = searchProducts(query, { limit: 100 }).find((p) => p.partNo === donaldson);
    assert(found, `Search failed for ${query} -> ${donaldson}`);
    assert(isPreliminaryRelation(found._matchedRelation), `Missing preliminary notice: ${query}`);
  }
}

// Independently selected PDF rows cover continuation lines, shared references,
// multiple Sakura references, and a part number also used by Fleetguard.
const spotChecks = [
  ["P181034", "SURE", "SFA0418P"],
  ["P182034", "SURE", "SFA0418P"],
  ["P535365", "SURE", "SFA3113P"],
  ["P550588", "SURE", "SFF8425"],
  ["P550588", "SAKURA", "FC57083"],
  ["P550588", "SAKURA", "FC6801"],
  ["P550227", "SAKURA", "C18058"],
  ["P558000", "SAKURA", "FS1212"],
] as const;
for (const [donaldson, brand, part] of spotChecks) {
  const product = products.find((p) => p.partNo === donaldson)!;
  assert(normalizeProductRelations(product.crossReferences, "unknown").some(
    (r) => brandKey(r.brand ?? "") === brand && key(r.partNumber) === key(part),
  ), `PDF spot check failed: ${donaldson}/${part}`);
}
const all = products.flatMap((p) => normalizeProductRelations(p.crossReferences, "unknown")
  .filter((r) => ["SURE", "SAKURA"].includes(brandKey(r.brand ?? "")))
  .map((r) => ({ donaldson: p.partNo, brand: brandKey(r.brand ?? "") })));
assert.equal(all.length, 439);
assert.equal(all.filter((r) => r.brand === "SURE").length, 207);
assert.equal(all.filter((r) => r.brand === "SAKURA").length, 232);
assert.equal(new Set(all.map((r) => r.donaldson)).size, 191);
assert(!sureSakuraMappings.some(([d]) => ["P550520", "P502344", "P556485"].includes(d)));
console.log("PASS: 427 new / 439 total mappings, 191 existing Donaldson products, search and preliminary notices.");
