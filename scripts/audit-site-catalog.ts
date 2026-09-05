import fs from "node:fs";
import path from "node:path";

import { products } from "@/data/products/index";
import {
  normalizeProductRelations,
  type ProductRelation,
} from "@/lib/products/relations";

type Finding = {
  severity: "Critical" | "High" | "Medium" | "Low";
  area: string;
  partNo?: string;
  issue: string;
};

const findings: Finding[] = [];

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function addFinding(finding: Finding) {
  findings.push(finding);
}

function relationKey(relation: ProductRelation) {
  return normalizePartNo(relation.partNumber);
}

const productByPartNo = new Map(
  products.map((product) => [normalizePartNo(product.partNo), product]),
);

const categoryCounts = new Map<string, number>();
const qualityCounts = new Map<string, number>();
let localImages = 0;
let remoteImages = 0;
let productsWithOfficialUrl = 0;
let verifiedRelations = 0;
let pendingRelations = 0;

for (const product of products) {
  categoryCounts.set(product.category ?? "(missing)", (categoryCounts.get(product.category ?? "(missing)") ?? 0) + 1);
  qualityCounts.set(product.dataQuality ?? "(unspecified)", (qualityCounts.get(product.dataQuality ?? "(unspecified)") ?? 0) + 1);

  if (product.officialUrl) {
    productsWithOfficialUrl += 1;
    const normalizedUrl = normalizePartNo(product.officialUrl);
    if (!normalizedUrl.includes(normalizePartNo(product.partNo))) {
      addFinding({
        severity: "Medium",
        area: "Official source",
        partNo: product.partNo,
        issue: "Official URL does not contain the product Part No.; requires live verification.",
      });
    }
  } else {
    addFinding({
      severity: "Medium",
      area: "Official source",
      partNo: product.partNo,
      issue: "No official product URL is stored.",
    });
  }

  if (product.imageUrl?.startsWith("http")) {
    remoteImages += 1;
  } else if (product.imageUrl) {
    localImages += 1;
    const imagePath = path.join(process.cwd(), "public", product.imageUrl.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) {
      addFinding({
        severity: "High",
        area: "Product image",
        partNo: product.partNo,
        issue: `Local image is missing: ${product.imageUrl}`,
      });
    }
  }

  const refs = normalizeProductRelations(product.refs, "unknown");
  const crossReferences = normalizeProductRelations(product.crossReferences, "unknown");
  const refKeys = new Set(refs.map(relationKey));

  for (const relation of [...refs, ...crossReferences]) {
    if (relation.verificationStatus === "verified") verifiedRelations += 1;
    if (relation.verificationStatus === "pending") pendingRelations += 1;
    if (normalizePartNo(relation.partNumber) === normalizePartNo(product.partNo)) {
      addFinding({
        severity: "High",
        area: "Cross Reference",
        partNo: product.partNo,
        issue: `Self-reference found: ${relation.partNumber}.`,
      });
    }
  }

  for (const relation of crossReferences) {
    if (refKeys.has(relationKey(relation))) {
      addFinding({
        severity: "Medium",
        area: "Cross Reference",
        partNo: product.partNo,
        issue: `${relation.partNumber} is stored in both refs and crossReferences.`,
      });
    }
  }

  for (const pairedPart of product.pairedParts ?? []) {
    const target = productByPartNo.get(normalizePartNo(pairedPart.partNo));
    if (!target) {
      addFinding({
        severity: "High",
        area: "Paired filter",
        partNo: product.partNo,
        issue: `Paired Part No. ${pairedPart.partNo} is not in the active catalog.`,
      });
      continue;
    }

    if (product.category === "filter_kit") continue;

    const expectedReverse = pairedPart.relation === "inner" ? "outer" : pairedPart.relation === "outer" ? "inner" : "paired";
    const reciprocal = target.pairedParts?.some(
      (candidate) =>
        normalizePartNo(candidate.partNo) === normalizePartNo(product.partNo) &&
        candidate.relation === expectedReverse,
    );
    if (!reciprocal) {
      addFinding({
        severity: "High",
        area: "Paired filter",
        partNo: product.partNo,
        issue: `${pairedPart.partNo} is missing the reciprocal ${expectedReverse} relation.`,
      });
    }
  }

  if (product.category === "air_filter") {
    const typeValues = (product.specifications ?? [])
      .filter((item) => ["type", "stage", "media type"].includes(item.label.trim().toLowerCase()))
      .map((item) => String(item.value));
    const label = `${product.title ?? ""} ${typeValues.join(" ")}`.toLowerCase();
    const isPrimary = label.includes("primary");
    const isSafety = label.includes("safety");
    if (isPrimary && isSafety) {
      addFinding({
        severity: "High",
        area: "Air-filter classification",
        partNo: product.partNo,
        issue: "The same record is labelled as both Primary and Safety.",
      });
    }
    if ((product.pairedParts ?? []).some((part) => part.relation === "inner") && isSafety && !isPrimary) {
      addFinding({
        severity: "High",
        area: "Air-filter classification",
        partNo: product.partNo,
        issue: "Record is labelled Safety but its pair relation classifies it as a Primary/outer filter.",
      });
    }
    if ((product.pairedParts ?? []).some((part) => part.relation === "outer") && isPrimary && !isSafety) {
      addFinding({
        severity: "High",
        area: "Air-filter classification",
        partNo: product.partNo,
        issue: "Record is labelled Primary but its pair relation classifies it as a Safety/inner filter.",
      });
    }
  }
}

const severityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 } as const;
findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || (a.partNo ?? "").localeCompare(b.partNo ?? "", undefined, { numeric: true }));

const counts = Object.fromEntries(
  ["Critical", "High", "Medium", "Low"].map((severity) => [severity, findings.filter((finding) => finding.severity === severity).length]),
);

const lines = [
  "# MRT Supplier Site and Catalog Audit",
  "",
  "Audit date: 2026-09-05",
  "",
  "## Scope and evidence policy",
  "",
  "This automated pass checks the active catalog structure, relation integrity, local assets, source coverage, and search-regression signals. It does not declare a product specification correct merely because required fields exist. Product facts require an official manufacturer source before correction or publication.",
  "",
  "## Catalog summary",
  "",
  `- Active products: ${products.length}`,
  `- Products with an official URL: ${productsWithOfficialUrl}`,
  `- Local product images: ${localImages}`,
  `- Remote product images: ${remoteImages}`,
  `- Verified relation records: ${verifiedRelations}`,
  `- Pending relation records: ${pendingRelations}`,
  "",
  "## Automated findings",
  "",
  `- Critical: ${counts.Critical}`,
  `- High: ${counts.High}`,
  `- Medium: ${counts.Medium}`,
  `- Low: ${counts.Low}`,
  "",
  "| Severity | Area | Part No. | Finding |",
  "| --- | --- | --- | --- |",
  ...findings.map((finding) => `| ${finding.severity} | ${finding.area} | ${finding.partNo ?? "-"} | ${finding.issue.replace(/\|/g, "\\|")} |`),
  "",
  "## Category distribution",
  "",
  "| Category | Products |",
  "| --- | ---: |",
  ...[...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => `| ${category} | ${count} |`),
  "",
  "## Data-quality labels",
  "",
  "| Label | Products |",
  "| --- | ---: |",
  ...[...qualityCounts.entries()].sort((a, b) => b[1] - a[1]).map(([quality, count]) => `| ${quality} | ${count} |`),
  "",
  "## UX/UI audit status",
  "",
  "| Area | Finding | Status |",
  "| --- | --- | --- |",
  "| Search suggestions | Duplicate-looking entries for one Part No. | Fixed in PR #107 |",
  "| Partial Part No. search | A relation-only hit could outrank direct `p50` Part No. prefixes | Fixed in PR #107 |",
  "| Result ordering | Default products and prefix suggestions were not naturally sorted by Part No. | Fixed in PR #107 |",
  "| Search overlay | Cookie control could overlap search suggestions | Fixed in PR #107 |",
  "| Product detail layout | Independent columns created excessive blank space | Fixed in PR #107 |",
  "| Air-filter pairing | Primary/Safety relationship was unclear and had no product thumbnails | Fixed in PR #107 |",
  "| Cross Reference mobile table | A 560 px minimum width forced horizontal scrolling | Fixed in PR #107 follow-up |",
  "| Thai technical wording | Mixed translated and technical labels reduced clarity | First terminology pass completed in PR #107; site-wide consistency remains queued |",
  "| Responsive visual QA | Desktop, notebook, tablet, and mobile browser screenshots | Pending live-browser pass |",
  "",
  "## Manual audit queue",
  "",
  "1. Verify High findings first; do not publish inferred corrections.",
  "2. Live-check official URLs that do not identify the current Part No. in the URL.",
  "3. Review duplicated relation storage and retain one canonical, evidence-backed relation.",
  "4. Run desktop, notebook, tablet, and mobile UX checks for search, product detail, RFQ, language switching, cookie controls, and empty states.",
  "5. Keep fixes in small PRs grouped by root cause.",
  "",
];

const outputPath = path.join(process.cwd(), "_audit", "site-and-catalog-audit-2026-09-05.md");
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

console.log(JSON.stringify({ outputPath, products: products.length, counts, findings: findings.length }, null, 2));
