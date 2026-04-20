import { searchProducts, debugSearchHits, detectQueryIntent } from "@/lib/search/search";
import { SEARCH_TUNING_CASES } from "@/lib/search/tuning-cases";
import products from "@/data/products.dump.json";

type ProductRecord = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  stockStatus?: "in_stock" | "low_stock" | "request";
  refs?: string[];
};

type TuningCheckResult = {
  caseName: string;
  query: string;
  mode: "part" | "spec" | "all";
  detectedIntent: string;
  expectedIntent?: string;
  intentPass: boolean;
  topHitPartNo: string;
  topHitScore: number;
  partPass: boolean;
  brandPass: boolean;
  categoryPass: boolean;
  keywordPass: boolean;
  overallPass: boolean;
  failureReasons: string[];
};

const PRODUCT_DATA = products as ProductRecord[];
const TOP_N = 5;

function normalize(value: string | undefined | null): string {
  return String(value ?? "").trim().toLowerCase();
}

function productText(product: ProductRecord): string {
  return [
    product.partNo,
    product.brand,
    product.category,
    product.title,
    product.spec,
    ...(product.refs ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function anyTopHitMatchesPartNos(
  topHits: ReturnType<typeof searchProducts<ProductRecord>>,
  expectedPartNos?: string[]
): boolean {
  if (!expectedPartNos || expectedPartNos.length === 0) return true;

  return expectedPartNos.some((expected) =>
    topHits.some((hit) => normalize(hit.product.partNo) === normalize(expected))
  );
}

function anyTopHitMatchesBrands(
  topHits: ReturnType<typeof searchProducts<ProductRecord>>,
  expectedBrands?: string[]
): boolean {
  if (!expectedBrands || expectedBrands.length === 0) return true;

  return expectedBrands.some((expected) =>
    topHits.some((hit) => normalize(hit.product.brand) === normalize(expected))
  );
}

function anyTopHitMatchesCategories(
  topHits: ReturnType<typeof searchProducts<ProductRecord>>,
  expectedCategories?: string[]
): boolean {
  if (!expectedCategories || expectedCategories.length === 0) return true;

  return expectedCategories.some((expected) =>
    topHits.some((hit) => normalize(hit.product.category) === normalize(expected))
  );
}

function anyTopHitMatchesKeywords(
  topHits: ReturnType<typeof searchProducts<ProductRecord>>,
  expectedKeywords?: string[]
): boolean {
  if (!expectedKeywords || expectedKeywords.length === 0) return true;

  return expectedKeywords.some((expected) =>
    topHits.some((hit) => productText(hit.product).includes(normalize(expected)))
  );
}

function buildFailureReasons(args: {
  topHits: ReturnType<typeof searchProducts<ProductRecord>>;
  detectedIntent: string;
  expectedIntent?: string;
  partPass: boolean;
  brandPass: boolean;
  categoryPass: boolean;
  keywordPass: boolean;
  expectedTopPartNos?: string[];
  expectedBrands?: string[];
  expectedCategories?: string[];
  expectedKeywords?: string[];
}): string[] {
  const reasons: string[] = [];
  const {
    topHits,
    detectedIntent,
    expectedIntent,
    partPass,
    brandPass,
    categoryPass,
    keywordPass,
    expectedTopPartNos,
    expectedBrands,
    expectedCategories,
    expectedKeywords,
  } = args;

  if (topHits.length === 0) {
    reasons.push("No hits returned");
  }

  if (expectedIntent && detectedIntent !== expectedIntent) {
    reasons.push(
      `Intent mismatch: expected "${expectedIntent}" but got "${detectedIntent}"`
    );
  }

  if (!partPass && expectedTopPartNos?.length) {
    reasons.push(
      `Expected partNo not found in top ${TOP_N}: ${expectedTopPartNos.join(", ")}`
    );
  }

  if (!brandPass && expectedBrands?.length) {
    reasons.push(
      `Expected brand not found in top ${TOP_N}: ${expectedBrands.join(", ")}`
    );
  }

  if (!categoryPass && expectedCategories?.length) {
    reasons.push(
      `Expected category not found in top ${TOP_N}: ${expectedCategories.join(", ")}`
    );
  }

  if (!keywordPass && expectedKeywords?.length) {
    reasons.push(
      `Expected keyword not found in top ${TOP_N}: ${expectedKeywords.join(", ")}`
    );
  }

  return reasons;
}

function printDivider() {
  console.log("=".repeat(100));
}

function printCaseResult(
  result: TuningCheckResult,
  topHits: ReturnType<typeof searchProducts<ProductRecord>>,
  note?: string
) {
  printDivider();
  console.log(`CASE: ${result.caseName}`);
  console.log(`query="${result.query}" mode=${result.mode}`);
  console.log(
    `intent: detected=${result.detectedIntent} expected=${result.expectedIntent ?? "-"} pass=${result.intentPass ? "YES" : "NO"}`
  );
  console.log(
    `checks: part=${result.partPass ? "YES" : "NO"} brand=${result.brandPass ? "YES" : "NO"} category=${result.categoryPass ? "YES" : "NO"} keyword=${result.keywordPass ? "YES" : "NO"}`
  );
  console.log(
    `top hit: ${result.topHitPartNo || "-"} score=${result.topHitScore || 0} overall=${result.overallPass ? "PASS" : "FAIL"}`
  );

  if (result.failureReasons.length > 0) {
    console.log("failure reasons:");
    for (const reason of result.failureReasons) {
      console.log(`- ${reason}`);
    }
  }

  console.table(debugSearchHits(topHits, TOP_N));

  if (note) {
    console.log(`note: ${note}`);
  }
}

function run() {
  const results: TuningCheckResult[] = [];

  for (const testCase of SEARCH_TUNING_CASES) {
    const mode = testCase.mode ?? "all";
    const hits = searchProducts(PRODUCT_DATA, testCase.query, mode, TOP_N);
    const detectedIntent = detectQueryIntent(testCase.query);
    const topHit = hits[0];

    const intentPass = testCase.expectedIntent
      ? detectedIntent === testCase.expectedIntent
      : true;

    const partPass = anyTopHitMatchesPartNos(hits, testCase.expectedTopPartNos);
    const brandPass = anyTopHitMatchesBrands(hits, testCase.expectedBrands);
    const categoryPass = anyTopHitMatchesCategories(hits, testCase.expectedCategories);
    const keywordPass = anyTopHitMatchesKeywords(hits, testCase.expectedKeywords);

    const overallPass =
      intentPass && partPass && brandPass && categoryPass && keywordPass;

    const failureReasons = buildFailureReasons({
      topHits: hits,
      detectedIntent,
      expectedIntent: testCase.expectedIntent,
      partPass,
      brandPass,
      categoryPass,
      keywordPass,
      expectedTopPartNos: testCase.expectedTopPartNos,
      expectedBrands: testCase.expectedBrands,
      expectedCategories: testCase.expectedCategories,
      expectedKeywords: testCase.expectedKeywords,
    });

    const result: TuningCheckResult = {
      caseName: testCase.name,
      query: testCase.query,
      mode,
      detectedIntent,
      expectedIntent: testCase.expectedIntent,
      intentPass,
      topHitPartNo: topHit?.product.partNo ?? "",
      topHitScore: topHit?.score ?? 0,
      partPass,
      brandPass,
      categoryPass,
      keywordPass,
      overallPass,
      failureReasons,
    };

    results.push(result);
    printCaseResult(result, hits, testCase.note);
  }

  printDivider();
  console.log("SUMMARY");
  console.table(
    results.map((result) => ({
      case: result.caseName,
      query: result.query,
      overall: result.overallPass ? "PASS" : "FAIL",
      intent: result.intentPass ? "PASS" : "FAIL",
      part: result.partPass ? "PASS" : "FAIL",
      brand: result.brandPass ? "PASS" : "FAIL",
      category: result.categoryPass ? "PASS" : "FAIL",
      keyword: result.keywordPass ? "PASS" : "FAIL",
      topHit: result.topHitPartNo || "-",
      score: result.topHitScore,
      failures:
        result.failureReasons.length > 0
          ? result.failureReasons.join(" | ")
          : "-",
    }))
  );

  const passCount = results.filter((result) => result.overallPass).length;
  const failCount = results.length - passCount;

  printDivider();
  console.log(`TOTAL: ${results.length}`);
  console.log(`PASS: ${passCount}`);
  console.log(`FAIL: ${failCount}`);

  const failedCases = results.filter((result) => !result.overallPass);
  if (failedCases.length > 0) {
    printDivider();
    console.log("FAILED CASES");
    for (const failed of failedCases) {
      console.log(`- ${failed.caseName} (${failed.query})`);
      for (const reason of failed.failureReasons) {
        console.log(`  • ${reason}`);
      }
    }
    process.exitCode = 1;
  }
}

run();