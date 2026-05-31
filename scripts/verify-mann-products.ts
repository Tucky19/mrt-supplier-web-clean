import fs from "node:fs";
import path from "node:path";

import { products } from "@/data/products/index";
import { searchProducts } from "@/lib/search/search";

type Product = (typeof products)[number];

type ProductWithImages = Product & {
  detailImageUrl?: string;
  imageDetailUrl?: string;
};

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
  "CF 810",
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
  "WDK 725",
  "WDK 11 102/9",
  "WD 962",
  "WD 950",
  "WDK 962/16",
  "WD 13 145",
  "WD 940",
  "WD 920",
  "WD 1374",
  "WDK 9002",
  "W 1160",
  "W 13 145/3",
  "W 719/5",
  "W 920/21",
  "W 940",
  "WK 842/2",
  "WK 723",
  "WK 1080/7 x",
  "WK 1060/1",
  "TB 1396/5 x",
  "BFU 900 x",
  "TB 1374 x",
  "PL 420 x",
  "C 1132",
] as const;

const EXPECTED_CATEGORY_BY_PART_NO: Partial<Record<string, string>> = {
  "C 30 810/3": "air_filter",
  "WDK 725": "fuel_filter",
  "WDK 11 102/9": "fuel_filter",
  "WD 962": "hydraulic",
  "WD 950": "hydraulic",
  "WDK 962/16": "fuel_filter",
  "WD 13 145": "hydraulic",
  "WD 940": "hydraulic",
  "WD 920": "hydraulic",
  "WD 1374": "hydraulic",
  "WDK 9002": "fuel_filter",
  "W 1160": "oil_filter",
  "W 13 145/3": "oil_filter",
  "W 719/5": "oil_filter",
  "W 920/21": "oil_filter",
  "W 940": "oil_filter",
  "WK 842/2": "fuel_filter",
  "WK 723": "fuel_filter",
  "WK 1080/7 x": "fuel_filter",
  "WK 1060/1": "fuel_filter",
  "TB 1396/5 x": "air_dryer",
  "BFU 900 x": "fuel_filter",
  "TB 1374 x": "air_dryer",
  "PL 420 x": "fuel_filter",
  "C 1132": "air_filter",
};

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

function isDimensionImageUrl(value: string) {
  return /-dim\.jpg$/i.test(value);
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

  for (const product of products) {
    if (!isMannFilterProduct(product)) continue;

    const productWithImages = product as ProductWithImages;

    if (productWithImages.imageUrl) {
      if (isDimensionImageUrl(productWithImages.imageUrl)) {
        addIssue(
          issues,
          product.partNo,
          `imageUrl points to a dimension image: ${productWithImages.imageUrl}`
        );
      }

      if (!fileExistsInPublic(productWithImages.imageUrl)) {
        addIssue(
          issues,
          product.partNo,
          `imageUrl file does not exist: ${productWithImages.imageUrl}`
        );
      }
    }

    const detailImageUrl =
      productWithImages.detailImageUrl ?? productWithImages.imageDetailUrl;

    if (detailImageUrl && !fileExistsInPublic(detailImageUrl)) {
      addIssue(
        issues,
        product.partNo,
        `detail image file does not exist: ${detailImageUrl}`
      );
    }
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

    const expectedCategory = EXPECTED_CATEGORY_BY_PART_NO[partNo] ?? "filter";

    if (product.category !== expectedCategory) {
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

  console.log("MANN-FILTER batch 1-10 verification");
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
