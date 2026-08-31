import assert from "node:assert/strict";
import {
  buildRfqReferenceContext,
  getRfqReferenceContext,
} from "@/lib/rfq/referenceContext";

const fs1242Context = buildRfqReferenceContext({
  searchQuery: "fs1242",
  offeredPartNo: "P551864",
  matchType: "Cross Ref",
  matchedRelation: {
    brand: "Fleetguard",
    partNumber: "FS1242",
    relationType: "unknown",
    verificationStatus: "pending",
  },
});

assert(fs1242Context, "FS1242 cross-reference context should be preserved");
assert.equal(fs1242Context.searchQuery, "FS1242");
assert.equal(fs1242Context.matchedRelation?.partNumber, "FS1242");
assert.equal(fs1242Context.matchedRelation?.verificationStatus, "pending");
assert.deepEqual(getRfqReferenceContext(fs1242Context), fs1242Context);

assert.equal(
  buildRfqReferenceContext({
    searchQuery: "P551864",
    offeredPartNo: "P551864",
    matchType: "Exact",
  }),
  undefined,
  "exact product searches should not create redundant reference context",
);

assert.equal(getRfqReferenceContext({ searchQuery: "FS1242" }), null);

console.log("RFQ reference-context verification passed.");
