import { products } from "@/data/products/index";
import { normalizeProduct } from "@/data/products/normalize";
import {
  hasRelationEvidence,
  normalizeProductRelations,
  relationPartNumbers,
} from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const legacy = normalizeProductRelations(["Fleetguard FS1006"], "unknown");
assert(legacy.length === 1, "legacy string relation should normalize");
assert(legacy[0].partNumber === "Fleetguard FS1006", "legacy part number changed");
assert(legacy[0].verificationStatus === "pending", "legacy relation was auto-verified");
assert(legacy[0].relationType === "unknown", "legacy relation type changed");

const mutableInput = [
  {
    partNumber: " P000000 ",
    relationType: "equivalent",
    verificationStatus: "pending",
    evidenceNote: "kept on input",
  },
];
const beforeNormalize = JSON.stringify(mutableInput);
normalizeProductRelations(mutableInput, "unknown");
assert(
  JSON.stringify(mutableInput) === beforeNormalize,
  "normalizeProductRelations mutated source input",
);

const structured = normalizeProductRelations(
  [
    {
      partNumber: "P550687",
      brand: "Donaldson",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidence: "manual-review",
      evidenceUrl: "https://example.com/evidence",
      evidenceNote: "sample evidence",
      approvedBy: "boss",
      approvedAt: "2026-08-17T00:00:00.000Z",
      note: "approved sample",
    },
    {
      partNo: "P551006",
      relation: "companion",
      verificationStatus: "hidden",
      source: "sample-source",
    },
    {
      partNumber: "P552006",
      relationType: "alternative",
      verificationStatus: "pending",
    },
  ],
  "unknown",
);

assert(structured.length === 3, "structured relations should normalize");
assert(structured[0].verificationStatus === "verified", "verified status not preserved");
assert(structured[1].verificationStatus === "hidden", "hidden status not preserved");
assert(structured[2].verificationStatus === "pending", "pending status not preserved");
assert(structured[1].relationType === "companion", "relation alias not preserved");
assert(structured[0].evidenceUrl === "https://example.com/evidence", "evidence metadata lost");

const rawStructuredProduct = {
  id: "sample-governance-product",
  partNo: "SAMPLE-001",
  brand: "Sample",
  category: "filter",
  refs: [
    " P550687 ",
    {
      partNumber: " P550687 ",
      brand: " Donaldson ",
      relationType: "local_equivalent",
      verificationStatus: "verified",
      evidence: "manual-review",
      evidenceUrl: "https://example.com/evidence",
      evidenceNote: "approved cross-reference sample",
      approvedBy: "boss",
      approvedAt: "2026-08-17T00:00:00.000Z",
      note: "structured metadata must survive canonical normalization",
    },
  ],
  crossReferences: [
    " Fleetguard FS1006 ",
    {
      partNumber: " P000003 ",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidenceUrl: "https://example.com/evidence",
    },
  ],
};
const rawStructuredBeforeNormalize = JSON.stringify(rawStructuredProduct);
const normalizedStructuredProduct = normalizeProduct(rawStructuredProduct);
assert(
  JSON.stringify(rawStructuredProduct) === rawStructuredBeforeNormalize,
  "normalizeProduct mutated source relation input",
);
assert(
  typeof normalizedStructuredProduct.refs?.[0] === "object",
  "structured relation should win over duplicate legacy string in canonical refs",
);
const [preservedRelation] = normalizeProductRelations(
  normalizedStructuredProduct.refs,
  "unknown",
);
assert(
  preservedRelation.partNumber === "P550687",
  "canonical relation part number was not preserved",
);
assert(
  preservedRelation.brand === "Donaldson" &&
    preservedRelation.relationType === "local_equivalent" &&
    preservedRelation.verificationStatus === "verified" &&
    preservedRelation.evidence === "manual-review" &&
    preservedRelation.evidenceUrl === "https://example.com/evidence" &&
    preservedRelation.evidenceNote === "approved cross-reference sample" &&
    preservedRelation.approvedBy === "boss" &&
    preservedRelation.approvedAt === "2026-08-17T00:00:00.000Z" &&
    preservedRelation.note === "structured metadata must survive canonical normalization",
  "structured relation metadata was lost during canonical normalization",
);
const normalizedLegacyCrossRefs = normalizeProductRelations(
  normalizedStructuredProduct.crossReferences,
  "unknown",
);
assert(
  normalizedLegacyCrossRefs[0].partNumber === "Fleetguard FS1006" &&
    normalizedLegacyCrossRefs[0].verificationStatus === "pending",
  "legacy relation should remain supported and normalize as pending",
);
assert(
  normalizedLegacyCrossRefs[1].partNumber === "P000003" &&
    normalizedLegacyCrossRefs[1].verificationStatus === "pending",
  "verified relation missing approval metadata should normalize to pending",
);
assert(
  relationPartNumbers(normalizedStructuredProduct.refs, "unknown").join("|") ===
    "P550687",
  "public flatten output changed for canonical structured relation",
);
assert(
  relationPartNumbers(normalizedStructuredProduct.refs, "unknown").every(
    (partNumber) => !partNumber.includes("[object Object]"),
  ),
  "canonical structured relation flattened to [object Object]",
);

const invalidVerified = normalizeProductRelations(
  [
    {
      partNumber: "P000001",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidenceUrl: "https://example.com/evidence",
    },
    {
      partNumber: "P000002",
      relationType: "equivalent",
      verificationStatus: "verified",
      approvedBy: "boss",
      approvedAt: "2026-08-17T00:00:00.000Z",
    },
  ],
  "unknown",
);

assert(
  invalidVerified.every((relation) => relation.verificationStatus === "pending"),
  "verified relation without evidence and approval metadata should normalize to pending",
);

const visiblePartNumbers = relationPartNumbers(structured, "unknown");
assert(
  visiblePartNumbers.join("|") === "P550687|P551006|P552006",
  "public part-number flattening changed or hid a relation",
);
assert(
  visiblePartNumbers.every((partNumber) => !partNumber.includes("[object Object]")),
  "structured relation metadata leaked into public part numbers",
);

const allowedRelationTypes = new Set([
  "equivalent",
  "replaced_by",
  "alternative",
  "companion",
  "local_equivalent",
  "unknown",
]);
const allowedStatuses = new Set(["verified", "pending", "rejected", "hidden"]);
const duplicateKeys = new Set<string>();
const seenKeys = new Set<string>();

for (const product of products) {
  const relationGroups = [
    normalizeProductRelations(product.refs, "unknown"),
    normalizeProductRelations(product.crossReferences, "unknown"),
    normalizeProductRelations(
      product.pairedParts?.map((part) => ({
        partNumber: part.partNo,
        relationType: "companion",
        note: part.note,
      })),
      "companion",
    ),
  ];

  for (const relation of relationGroups.flat()) {
    assert(
      allowedRelationTypes.has(relation.relationType),
      `unexpected relationType ${relation.relationType}`,
    );
    assert(
      allowedStatuses.has(relation.verificationStatus),
      `unexpected verificationStatus ${relation.verificationStatus}`,
    );
    assert(
      !relation.partNumber.includes("[object Object]"),
      `metadata leaked into part number for ${product.partNo}`,
    );
    assert(
      relation.partNumber === relation.partNumber.trim(),
      `relation part number has outer whitespace for ${product.partNo}`,
    );

    if (relation.brand) {
      assert(
        relation.brand === relation.brand.trim(),
        `relation brand has outer whitespace for ${product.partNo}`,
      );
    }

    if (relation.verificationStatus === "verified") {
      assert(
        hasRelationEvidence(relation) && relation.approvedBy && relation.approvedAt,
        `verified relation missing evidence or approval metadata for ${product.partNo}`,
      );
    }

    const key = [
      product.brand.trim().toLowerCase(),
      product.partNo.trim().toLowerCase().replace(/[\s/_-]+/g, ""),
      relation.relationType,
      relation.partNumber.trim().toLowerCase().replace(/[\s/_-]+/g, ""),
    ].join("|");

    if (seenKeys.has(key)) duplicateKeys.add(key);
    else seenKeys.add(key);
  }
}

const searchSnapshots = {
  P551315: { count: 1, top: ["P551315"] },
  "C 20 500": { count: 48, top: ["C 20 500", "CF 500"] },
  "Fleetguard FS1006": {
    count: 3,
    top: ["P550687", "P552006", "P551006"],
  },
};

assert(products.length === 455, `active product count changed: ${products.length}`);

for (const [query, expected] of Object.entries(searchSnapshots)) {
  const results = searchProducts(query, { limit: 48 });
  assert(
    results.length === expected.count,
    `search count changed for "${query}": ${results.length}`,
  );

  const top = results.slice(0, expected.top.length).map((product) => product.partNo);
  assert(
    top.join("|") === expected.top.join("|"),
    `search order changed for "${query}": ${top.join(", ")}`,
  );
}

console.log("Cross-reference governance validation passed");
console.log(`Active products: ${products.length}`);
console.log(`Duplicate normalized relations: ${duplicateKeys.size}`);
