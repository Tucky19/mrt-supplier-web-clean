import assert from "node:assert/strict";
import { parseBulkPartText } from "@/lib/search/bulkPartInput";
import { createExactProductLookup, searchProducts } from "@/lib/search/search";
import { buildRfqReferenceContext, getRfqReferenceContexts, mergeRfqReferenceContext } from "@/lib/rfq/referenceContext";

const lookup = createExactProductLookup();
const reference = lookup.find("2P4004");
assert.equal(reference.length, 1);
assert.equal(reference[0].partNo, "P554004");
assert.equal(reference[0]._matchType, "Cross Ref");
assert(searchProducts("2P4004", { limit: 20 }).some((item) => item.id === reference[0].id));
assert.equal(lookup.find("P554004")[0]._matchType, "Exact");
assert(lookup.find("FS1006").length > 1);
assert.equal(lookup.find("UNKNOWN-TEST-001").length, 0);
assert(!lookup.find("LF3000").some((item) => item.partNo === "P551425"));

const context = buildRfqReferenceContext({ searchQuery: "2P4004", offeredPartNo: "P554004", matchType: reference[0]._matchType });
assert.equal(context?.searchQuery, "2P4004");
assert.equal(getRfqReferenceContexts(mergeRfqReferenceContext(context, context)).length, 1);
assert.equal(buildRfqReferenceContext({ searchQuery: "P554004", offeredPartNo: "P554004", matchType: "Exact" }), undefined);

for (const input of ["P551315 x 2", "P551315x2", "P551315,2", "P551315\t2", "P551315 - 2", "P551315 2"]) {
  assert.equal(parseBulkPartText(input)[0].qty, 2, input);
  assert.equal(parseBulkPartText(input)[0].originalPartNo, "P551315", input);
}
assert.equal(parseBulkPartText("2P4004")[0].qty, 1);
assert.equal(parseBulkPartText("W 962/14")[0].originalPartNo, "W 962/14");
assert.equal(parseBulkPartText("P551315\nP551315 x 2")[0].qty, 3);
assert.equal(parseBulkPartText("P551315 x 2000")[0].qty, 999);
assert.deepEqual(parseBulkPartText("\n  \n"), []);
assert.equal(parseBulkPartText("FS1006 x 4\nFS1006,2")[0].qty, 6);
console.log("RFQ bulk entry: catalog parity, reference context, ambiguity, unknown, deployed exclusion, quantity formats and duplicates passed.");

