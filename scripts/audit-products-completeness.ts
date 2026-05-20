import fs from "node:fs";
import path from "node:path";

import { products } from "../data/products/index";
import type { Product } from "../types/product";

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function isBadSpec(value?: string) {
  const normalized = String(value ?? "").trim().toLowerCase();

  return (
    !normalized ||
    normalized === "standard industrial filter" ||
    normalized.includes("specification to be confirmed") ||
    normalized.includes("to be confirmed")
  );
}

function isBadOfficialUrl(value?: string) {
  const normalized = String(value ?? "").trim();

  return !normalized || normalized === "#" || normalized.toLowerCase() === "null";
}

function imageExists(imageUrl?: string) {
  if (!imageUrl) return false;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return true;
  if (imageUrl === "/images/placeholder.jpg") return false;

  const fullPath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
  return fs.existsSync(fullPath);
}

const rows = products
  .map((product: Product) => {
    const missing: string[] = [];

    if (!imageExists(product.imageUrl)) missing.push("image");

    if (
      isBadSpec(product.spec) &&
      (!Array.isArray(product.specifications) || product.specifications.length === 0)
    ) {
      missing.push("spec");
    }

    if (isBadOfficialUrl(product.officialUrl)) missing.push("officialUrl");

    return {
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      imageUrl: product.imageUrl,
      spec: product.spec,
      officialUrl: product.officialUrl,
      missing: missing.join(", "),
    };
  })
  .filter((row) => row.missing);

console.table(rows);
console.log(`\nMissing/incomplete products: ${rows.length} / ${products.length}`);

const auditOutputPath = path.join(process.cwd(), "product-completeness-audit.json");
const auditHistoryDir = path.join(process.cwd(), "audit-history");
const latestSummaryPath = path.join(auditHistoryDir, "latest-audit-summary.json");

fs.mkdirSync(auditHistoryDir, { recursive: true });

let historyFilePath: string | null = null;

if (fs.existsSync(auditOutputPath)) {
  const historyFileName = `product-completeness-audit-${formatTimestamp(new Date())}.json`;
  historyFilePath = path.join(auditHistoryDir, historyFileName);
  fs.copyFileSync(auditOutputPath, historyFilePath);
}

fs.writeFileSync(
  auditOutputPath,
  JSON.stringify(rows, null, 2),
  "utf8"
);

const summary = {
  generatedAt: new Date().toISOString(),
  incompleteCount: rows.length,
  totalProducts: products.length,
  groups: rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.missing] = (counts[row.missing] ?? 0) + 1;
    return counts;
  }, {}),
  latestAuditPath: auditOutputPath,
  previousAuditHistoryPath: historyFilePath,
};

fs.writeFileSync(latestSummaryPath, JSON.stringify(summary, null, 2), "utf8");

if (historyFilePath) {
  console.log(`Previous audit archived to: ${historyFilePath}`);
}

console.log(`Latest audit summary written to: ${latestSummaryPath}`);
