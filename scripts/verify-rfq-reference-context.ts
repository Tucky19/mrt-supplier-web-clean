import assert from "node:assert/strict";
import {
  buildRfqReferenceContext,
  getRfqReferenceContext,
  getRfqReferenceContextKey,
  mergeRfqReferenceContext,
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

assert.deepEqual(
  mergeRfqReferenceContext(undefined, fs1242Context),
  fs1242Context,
  "an incoming cross-reference should be retained when a quote item already exists",
);

assert.deepEqual(
  mergeRfqReferenceContext(fs1242Context, undefined),
  fs1242Context,
  "an existing cross-reference should remain when a direct add has no context",
);

const laterContext = buildRfqReferenceContext({
  searchQuery: "3355903",
  offeredPartNo: "P551864",
  matchType: "Cross Ref",
});

assert.deepEqual(
  mergeRfqReferenceContext(fs1242Context, laterContext),
  laterContext,
  "the latest customer search should replace stale reference context",
);

assert.equal(
  getRfqReferenceContextKey(fs1242Context),
  "FS1242|Cross Ref|FLEETGUARD|FS1242|unknown|pending",
  "duplicate identity should normalize the complete reference context",
);

assert.notEqual(
  getRfqReferenceContextKey(fs1242Context),
  getRfqReferenceContextKey(laterContext),
  "different customer search references must not be treated as duplicate RFQs",
);

assert.equal(
  getRfqReferenceContextKey(undefined),
  "",
  "items without reference context should retain the existing duplicate behavior",
);

console.log("RFQ reference-context verification passed.");
