import fs from "node:fs";
import path from "node:path";

import { products } from "@/data/products/index";
import { searchProducts } from "@/lib/search/search";

type Product = (typeof products)[number];

const EXPECTED_PART_NOS = [
  "C 1112/2",
  "C 25 900",
  "CF 1830",
  "C 75/2",
  "C 713",
  "C 30 850/2",
  "C 25 710/3",
  "C 23 632/1",
  "C 23 610",
  "C 23 115",
  "C 21 600",
  "C 21 138/1",
  "C 20 325/2",
  "C 20 105",
  "C 1760",
  "C 1633/1",
  "C 15 300",
  "CF 710",
  "CF 610",
  "CF 300",
  "H 1290/1",
  "CF 500",
  "CF 400",
  "CF 200",
  "HU 12 007 x",
  "H 729",
  "C 30 810/3",
  "C 30 703",
  "C 20 500",
  "HU 12 008 x",
  "W 11 102/36",
  "W 11 102",
  "W 11 102/37",
  "HU 931/5 x",
  "HU 7016 x",
  "LB 962/21",
  "LB 962/2",
  "LB 1374/2",
  "LB 13 145/3",
  "LB 11 102/2",
  "W 950",
  "W 940/5",
  "W 940/1",
  "W 962/14",
  "W 962",
] as const;

const DIMENSION_LABEL_PATTERNS = [
  /outer diameter/i,
  /inner diameter/i,
  /height/i,
  /\bgtin\b/i,
  /product type/i,
  /position/i,
  /series/i,
  /includes gasket/i,
];

const rootDir = process.cwd();

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function isMannFilterProduct(product: Product) {
  return product.brand === "MANN-FILTER";
}

function fileExistsInPublic(publicPath: string) {
  if (!publicPath.startsWith("/")) return false;

  const resolvedPath = path.resolve(rootDir, "public", publicPath.slice(1));
  const publicRoot = path.resolve(rootDir, "public");

  if (!resolvedPath.startsWith(publicRoot)) return false;

  return fs.existsSync(resolvedPath);
}

function hasNonEmptySpec(product: Product) {
  return typeof product.spec === "string" && product.spec.trim().length > 0;
}

function hasTechnicalDimensions(product: Product) {
  const specifications = product.specifications ?? [];

  return specifications.some((specification) =>
    DIMENSION_LABEL_PATTERNS.some((pattern) => pattern.test(specification.label))
  );
}

function addIssue(issues: string[], partNo: string, message: string) {
  issues.push(`${partNo}: ${message}`);
}

function main() {
  const issues: string[] = [];
  const exportedByPartNo = new Map<string, Product>();

  for (const product of products) {
    if (!isMannFilterProduct(product)) continue;

    const normalizedPartNo = normalizePartNo(product.partNo);
    if (!exportedByPartNo.has(normalizedPartNo)) {
      exportedByPartNo.set(normalizedPartNo, product);
    }
  }

  const mannPartNoCounts = new Map<string, number>();

  for (const product of products) {
    if (!isMannFilterProduct(product)) continue;

    const normalizedPartNo = normalizePartNo(product.partNo);
    mannPartNoCounts.set(
      normalizedPartNo,
      (mannPartNoCounts.get(normalizedPartNo) ?? 0) + 1
    );
  }

  const duplicatePartNos = Array.from(mannPartNoCounts.entries()).filter(
    ([, count]) => count > 1
  );

  for (const [normalizedPartNo, count] of duplicatePartNos) {
    issues.push(`Duplicate MANN-FILTER partNo "${normalizedPartNo}" appears ${count} times`);
  }

  for (const partNo of EXPECTED_PART_NOS) {
    const product = exportedByPartNo.get(normalizePartNo(partNo));

    if (!product) {
      addIssue(issues, partNo, "not found in exported products");
      continue;
    }

    if (product.brand !== "MANN-FILTER") {
      addIssue(issues, partNo, `brand is "${product.brand}"`);
    }

    if (product.category !== "filter") {
      addIssue(issues, partNo, `category is "${product.category}"`);
    }

    if (!product.imageUrl) {
      addIssue(issues, partNo, "imageUrl is missing");
    } else if (!fileExistsInPublic(product.imageUrl)) {
      addIssue(issues, partNo, `imageUrl file does not exist: ${product.imageUrl}`);
    }

    if (!hasNonEmptySpec(product)) {
      addIssue(issues, partNo, "spec is missing or empty");
    }

    if (!hasTechnicalDimensions(product)) {
      addIssue(issues, partNo, "technical dimensions/specifications are missing");
    }

    const searchResults = searchProducts(partNo, { limit: 10 });
    const foundBySearch = searchResults.some(
      (result) => normalizePartNo(result.partNo) === normalizePartNo(partNo)
    );

    if (!foundBySearch) {
      addIssue(issues, partNo, "not found by product search source");
    }
  }

  console.log("MANN-FILTER batch 1-5 verification");
  console.log(`Expected products: ${EXPECTED_PART_NOS.length}`);
  console.log(`Exported MANN-FILTER products: ${exportedByPartNo.size}`);

  if (issues.length === 0) {
    console.log("PASS: all expected MANN-FILTER products are complete and searchable.");
    process.exit(0);
  }

  console.error(`FAIL: found ${issues.length} issue(s).`);

  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  process.exit(1);
}

main();
