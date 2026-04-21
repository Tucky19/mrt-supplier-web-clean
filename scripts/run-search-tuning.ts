import { products } from "@/data/products";
import {
  detectQueryIntent,
  searchProducts,
  type SearchHit,
  type SearchableProduct,
} from "@/lib/search/search";
import {
  SEARCH_TUNING_CASES,
  type SearchTuningCase,
} from "@/lib/search/tuning-cases";

type ProductLike = SearchableProduct & {
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
};

type CaseResult = {
  passed: boolean;
  reasons: string[];
  topHits: SearchHit<ProductLike>[];
};

function includesAny(values: string[], expected: string[]) {
  const normalized = values.map((value) => String(value ?? "").toLowerCase());
  return expected.some((value) =>
    normalized.includes(String(value ?? "").toLowerCase())
  );
}

function hitText(hit: SearchHit<ProductLike>) {
  const product = hit.product;
  return [
    product.partNo || "-",
    product.brand || "-",
    product.category || "-",
    product.title || "-",
  ].join(" | ");
}

function evaluateCase(testCase: SearchTuningCase): CaseResult {
  const mode = testCase.mode ?? "all";
  const expectedIntent = testCase.expectedIntent;
  const detectedIntent = detectQueryIntent(testCase.query);
  const hits = searchProducts(products as ProductLike[], testCase.query, mode, 8);
  const topHits = hits.slice(0, 5);
  const reasons: string[] = [];

  if (expectedIntent && detectedIntent !== expectedIntent) {
    reasons.push(
      `intent mismatch: expected ${expectedIntent}, got ${detectedIntent}`
    );
  }

  if (testCase.expectedTopPartNos?.length) {
    const topPartNos = topHits.map((hit) => hit.product.partNo ?? "");
    if (!includesAny(topPartNos, testCase.expectedTopPartNos)) {
      reasons.push(
        `missing expected top part number: ${testCase.expectedTopPartNos.join(", ")}`
      );
    }
  }

  if (testCase.expectedBrands?.length) {
    const brands = topHits.map((hit) => hit.product.brand ?? "");
    if (!includesAny(brands, testCase.expectedBrands)) {
      reasons.push(
        `missing expected brand: ${testCase.expectedBrands.join(", ")}`
      );
    }
  }

  if (testCase.expectedCategories?.length) {
    const categories = topHits.map((hit) => hit.product.category ?? "");
    if (!includesAny(categories, testCase.expectedCategories)) {
      reasons.push(
        `missing expected category: ${testCase.expectedCategories.join(", ")}`
      );
    }
  }

  if (testCase.expectedKeywords?.length) {
    const searchable = topHits.map((hit) =>
      [
        hit.product.partNo,
        hit.product.brand,
        hit.product.category,
        hit.product.title,
        hit.product.spec,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
    );

    const hasKeyword = testCase.expectedKeywords.some((keyword) =>
      searchable.some((blob) => blob.includes(keyword.toLowerCase()))
    );

    if (!hasKeyword) {
      reasons.push(
        `missing expected keyword: ${testCase.expectedKeywords.join(", ")}`
      );
    }
  }

  if (topHits.length === 0) {
    reasons.push("no hits returned");
  }

  return {
    passed: reasons.length === 0,
    reasons,
    topHits,
  };
}

function printCaseResult(testCase: SearchTuningCase, result: CaseResult) {
  const status = result.passed ? "PASS" : "FAIL";
  console.log(`\n[${status}] ${testCase.name}`);
  console.log(`  query: "${testCase.query}" | mode: ${testCase.mode ?? "all"}`);

  if (testCase.note) {
    console.log(`  note: ${testCase.note}`);
  }

  if (result.reasons.length > 0) {
    console.log("  reasons:");
    for (const reason of result.reasons) {
      console.log(`  - ${reason}`);
    }
  }

  console.log("  top hits:");
  for (const hit of result.topHits.slice(0, 3)) {
    console.log(`  - ${hitText(hit)} | score=${hit.score}`);
  }
}

function main() {
  const results = SEARCH_TUNING_CASES.map((testCase) => ({
    testCase,
    result: evaluateCase(testCase),
  }));

  let passed = 0;
  let failed = 0;

  for (const entry of results) {
    printCaseResult(entry.testCase, entry.result);
    if (entry.result.passed) {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  console.log("\n=== Search Tuning Summary ===");
  console.log(`Total cases: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
