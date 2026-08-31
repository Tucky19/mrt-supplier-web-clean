import assert from "node:assert/strict";
import {
  buildRfqReferenceContext,
  getRfqReferenceContext,
  getRfqReferenceContexts,
  getRfqReferenceContextKey,
  mergeRfqReferenceContext,
} from "@/lib/rfq/referenceContext";
import { findSameRfqLite } from "@/lib/rfq/dedupe";

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

const mergedContexts = mergeRfqReferenceContext(fs1242Context, laterContext);
assert.deepEqual(
  getRfqReferenceContexts(mergedContexts).map((context) => context.searchQuery),
  ["FS1242", "3355903"],
  "every customer search contributing to a merged quote row should be preserved",
);

assert.equal(
  getRfqReferenceContextKey(fs1242Context),
  "FS1242|Cross Ref",
  "duplicate identity should use the customer-visible reference context",
);

const fs1242WithoutRelation = buildRfqReferenceContext({
  searchQuery: "FS1242",
  offeredPartNo: "P551864",
  matchType: "Cross Ref",
});
assert.equal(
  getRfqReferenceContextKey(fs1242Context),
  getRfqReferenceContextKey(fs1242WithoutRelation),
  "the same customer-visible request should dedupe across search entry paths",
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

const customer = { phone: "0812345678", email: "", lineId: "" };
const contextA = {
  customer,
  items: [{ partNo: "P551864", qty: 1, meta: fs1242Context }],
};
const contextB = {
  customer,
  items: [{ partNo: "P551864", qty: 1, meta: laterContext }],
};

assert.equal(
  findSameRfqLite([contextB, contextA], contextA),
  contextA,
  "a retry must match any equivalent RFQ inside the duplicate window, not only the newest one",
);

console.log("RFQ reference-context verification passed.");
