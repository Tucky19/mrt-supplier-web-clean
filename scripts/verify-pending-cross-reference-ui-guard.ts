import { products } from "@/data/products/index";
import {
  isPreliminaryRelation,
  relationSearchTerms,
  type ProductRelationInput,
} from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function findProduct(partNo: string) {
  const product = products.find((item) => item.partNo === partNo);
  assert(product, `missing fixture product ${partNo}`);
  return product!;
}

function assertTopParts(query: string, expected: string[]) {
  const results = searchProducts(query, { limit: 48 });
  const actual = results.slice(0, expected.length).map((product) => product.partNo);

  assert(
    actual.join("|") === expected.join("|"),
    `search order changed for "${query}": ${actual.join(", ")}`,
  );

  return results;
}

const fixtureProducts = ["P550012", "P556245", "P553004"].map(findProduct);
const originals = new Map(
  fixtureProducts.map((product) => [
    product.partNo,
    {
      refs: product.refs,
      crossReferences: product.crossReferences,
    },
  ]),
);

try {
  const pendingProduct = findProduct("P550012");
  pendingProduct.crossReferences = [
    ...(pendingProduct.crossReferences ?? []),
    {
      brand: "Fleetguard",
      partNumber: "FF149",
      relationType: "unknown",
      verificationStatus: "pending",
      evidenceNote: "fixture only; not catalog data",
    },
  ] satisfies ProductRelationInput[];

  const pendingTerms = relationSearchTerms(
    [
      {
        brand: "Fleetguard",
        partNumber: "FF149",
        relationType: "unknown",
        verificationStatus: "pending",
      },
    ],
    "unknown",
  );

  assert(
    pendingTerms.includes("FF149") &&
      pendingTerms.includes("Fleetguard FF149") &&
      pendingTerms.includes("Fleetguard: FF149"),
    "structured relation search terms should include part-only and brand-aware forms",
  );

  for (const query of ["FF149", "Fleetguard FF149"]) {
    const [top] = searchProducts(query, { limit: 5 });
    assert(top?.partNo === "P550012", `${query} did not find P550012 first`);
    assert(top._matchType === "Cross Ref", `${query} did not match as Cross Ref`);
    assert(
      isPreliminaryRelation(top._matchedRelation),
      `${query} should expose a preliminary matched relation`,
    );
    assert(
      top._matchedRelation?.brand === "Fleetguard" &&
        top._matchedRelation.partNumber === "FF149",
      `${query} did not preserve matched relation brand/part metadata`,
    );
  }

  const verifiedProduct = findProduct("P556245");
  verifiedProduct.crossReferences = [
    ...(verifiedProduct.crossReferences ?? []),
    {
      brand: "Fleetguard",
      partNumber: "FF167",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidence: "fixture official source",
      approvedBy: "test",
      approvedAt: "2026-08-27T00:00:00.000Z",
    },
  ] satisfies ProductRelationInput[];

  const [verifiedTop] = searchProducts("Fleetguard FF167", { limit: 5 });
  assert(verifiedTop?.partNo === "P556245", "verified structured relation did not search");
  assert(
    !isPreliminaryRelation(verifiedTop._matchedRelation),
    "verified structured relation should not be preliminary",
  );

  const legacyProduct = findProduct("P553004");
  legacyProduct.crossReferences = [
    ...(legacyProduct.crossReferences ?? []),
    "Fleetguard FF42000",
  ];

  for (const query of ["FF42000", "Fleetguard FF42000"]) {
    const [legacyTop] = searchProducts(query, { limit: 5 });
    assert(legacyTop?.partNo === "P553004", `${query} did not find legacy fixture`);
    assert(
      isPreliminaryRelation(legacyTop._matchedRelation),
      `${query} legacy relation should remain preliminary`,
    );
  }

  assertTopParts("AF26395", ["C 20 500", "P778994"]);
  assertTopParts("Fleetguard AF26395", ["C 20 500", "P778994"]);
  assertTopParts("FS19735", ["P505982"]);
  assertTopParts("Fleetguard FS19735", ["P505982"]);
  assertTopParts("FS1006", ["P550687", "P552006", "P551006"]);
  assertTopParts("Fleetguard FS1006", ["P550687", "P552006", "P551006"]);
  assertTopParts("LF667", ["P554004"]);
  assertTopParts("Fleetguard LF667", ["P554004"]);

  console.log("Pending cross-reference UI guard validation passed");
  console.log("FF149 and Fleetguard FF149 fixture searches returned P550012");
  console.log("Existing legacy and structured relation searches preserved");
} finally {
  for (const product of fixtureProducts) {
    const original = originals.get(product.partNo);
    product.refs = original?.refs ?? [];
    product.crossReferences = original?.crossReferences ?? [];
  }
}
