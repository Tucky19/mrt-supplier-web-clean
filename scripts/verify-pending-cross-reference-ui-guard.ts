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

function isReferenceMatchType(matchType: string | undefined) {
  return matchType === "Cross Ref" || matchType === "Same-brand Ref";
}

function hasPreliminaryRelationNoticeResult(results: ReturnType<typeof searchProducts>) {
  const hasExactPartNumberResult = results.some((product) => product._matchType === "Exact");
  return (
    !hasExactPartNumberResult &&
    results.some(
      (product) =>
        isReferenceMatchType(product._matchType) &&
        isPreliminaryRelation(product._matchedRelation),
    )
  );
}

function suggestionNavigationValue(
  query: string,
  suggestion: ReturnType<typeof searchProducts>[number],
  suggestions: ReturnType<typeof searchProducts>,
) {
  const normalizedQuery = query.trim().toLowerCase().replace(/[\s/_-]+/g, "");
  const hasExactPartNumberSuggestion = suggestions.some(
    (item) =>
      item._matchType === "Exact" &&
      item.partNo.trim().toLowerCase().replace(/[\s/_-]+/g, "") ===
        normalizedQuery,
  );

  return isReferenceMatchType(suggestion._matchType) && !hasExactPartNumberSuggestion
    ? query.trim()
    : suggestion.partNo;
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
    const results = searchProducts(query, { limit: 5 });
    const [top] = results;
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
    assert(
      hasPreliminaryRelationNoticeResult(results),
      `${query} should trigger the page-level preliminary relation notice`,
    );
    assert(
      suggestionNavigationValue(query, top, results) === query.trim(),
      `${query} relation suggestion should preserve the customer reference query`,
    );
  }

  const verifiedProduct = findProduct("P556245");
  verifiedProduct.crossReferences = [
    ...(verifiedProduct.crossReferences ?? []),
    {
      brand: "Fleetguard",
      partNumber: "FF167VERIFIED",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidence: "fixture official source",
      approvedBy: "test",
      approvedAt: "2026-08-27T00:00:00.000Z",
    },
    {
      brand: "Fleetguard",
      partNumber: "FFMIX",
      relationType: "equivalent",
      verificationStatus: "verified",
      evidence: "fixture official source",
      approvedBy: "test",
      approvedAt: "2026-08-27T00:00:00.000Z",
    },
  ] satisfies ProductRelationInput[];

  const [verifiedTop] = searchProducts("Fleetguard FF167VERIFIED", { limit: 5 });
  assert(verifiedTop?.partNo === "P556245", "verified structured relation did not search");
  assert(
    !isPreliminaryRelation(verifiedTop._matchedRelation),
    "verified structured relation should not be preliminary",
  );
  assert(
    !hasPreliminaryRelationNoticeResult(
      searchProducts("Fleetguard FF167VERIFIED", { limit: 5 }),
    ),
    "verified structured relation should not trigger preliminary notice wording",
  );

  const legacyProduct = findProduct("P553004");
  legacyProduct.crossReferences = [
    ...(legacyProduct.crossReferences ?? []),
    "Fleetguard FF42000",
    {
      brand: "Fleetguard",
      partNumber: "FFMIX",
      relationType: "unknown",
      verificationStatus: "pending",
      evidenceNote: "fixture only; not catalog data",
    },
  ];

  for (const query of ["FF42000", "Fleetguard FF42000"]) {
    const [legacyTop] = searchProducts(query, { limit: 5 });
    assert(legacyTop?.partNo === "P553004", `${query} did not find legacy fixture`);
    assert(
      isPreliminaryRelation(legacyTop._matchedRelation),
      `${query} legacy relation should remain preliminary`,
    );
  }

  const mixedResults = searchProducts("Fleetguard FFMIX", { limit: 5 });
  const mixedRelationResults = mixedResults.filter(
    (product) =>
      product._matchType === "Cross Ref" || product._matchType === "Same-brand Ref",
  );
  const hasPreliminaryRelationResult = mixedRelationResults.some((product) =>
    isPreliminaryRelation(product._matchedRelation),
  );
  const onlyPreliminaryRelationResults =
    mixedRelationResults.length > 0 &&
    mixedRelationResults.every((product) =>
      isPreliminaryRelation(product._matchedRelation),
    );

  assert(
    mixedRelationResults.map((product) => product.partNo).includes("P556245") &&
      mixedRelationResults.map((product) => product.partNo).includes("P553004"),
    "mixed relation fixture should return both verified and pending results",
  );
  assert(
    hasPreliminaryRelationResult && !onlyPreliminaryRelationResults,
    "mixed relation fixture should classify as neutral mixed status",
  );
  assert(
    hasPreliminaryRelationNoticeResult(mixedResults),
    "mixed relation fixture should still trigger one neutral page-level notice",
  );

  assertTopParts("AF26395", ["C 20 500", "P778994"]);
  assertTopParts("Fleetguard AF26395", ["C 20 500", "P778994"]);
  assertTopParts("FS19735", ["P505982"]);
  assertTopParts("Fleetguard FS19735", ["P505982"]);
  assertTopParts("FS1006", ["P550687", "P552006", "P551006"]);
  assertTopParts("Fleetguard FS1006", ["P550687", "P552006", "P551006"]);
  assertTopParts("LF667", ["P554004"]);
  assertTopParts("Fleetguard LF667", ["P554004"]);

  const sameBrandResults = searchProducts("UCC HYDRAULICS MX1591410", { limit: 5 });
  const [sameBrandTop] = sameBrandResults;
  assert(
    sameBrandTop?.partNo === "P550148",
    "pending same-brand reference did not find P550148 first",
  );
  assert(
    sameBrandTop._matchType === "Same-brand Ref",
    "pending same-brand reference did not retain Same-brand Ref match type",
  );
  assert(
    isPreliminaryRelation(sameBrandTop._matchedRelation),
    "pending same-brand reference should expose preliminary relation status",
  );
  assert(
    hasPreliminaryRelationNoticeResult(sameBrandResults),
    "pending same-brand reference should trigger the page-level notice",
  );
  assert(
    suggestionNavigationValue(
      "UCC HYDRAULICS MX1591410",
      sameBrandTop,
      sameBrandResults,
    ) === "UCC HYDRAULICS MX1591410",
    "pending same-brand suggestion should preserve the customer reference query",
  );

  const exactResults = searchProducts("P551315", { limit: 5 });
  const [exactTop] = exactResults;
  assert(exactTop?.partNo === "P551315", "exact product fixture did not search");
  assert(exactTop._matchType === "Exact", "exact product fixture did not match as Exact");
  assert(
    suggestionNavigationValue("P551315", exactTop, exactResults) === "P551315",
    "exact suggestion should retain canonical product-number navigation",
  );
  assert(
    !hasPreliminaryRelationNoticeResult(exactResults),
    "exact product query should not trigger the relation notice",
  );

  console.log("Pending cross-reference UI guard validation passed");
  console.log("FF149 and Fleetguard FF149 fixture searches returned P550012");
  console.log("Pending same-brand fixture search returned P550148 with notice coverage");
  console.log("Existing legacy and structured relation searches preserved");
} finally {
  for (const product of fixtureProducts) {
    const original = originals.get(product.partNo);
    product.refs = original?.refs ?? [];
    product.crossReferences = original?.crossReferences ?? [];
  }
}
