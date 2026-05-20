import fs from "node:fs";
import path from "node:path";
import { getProductImageUrl } from "@/lib/products/image";
import { products } from "@/data/products/index";
import type { Product } from "@/types/product";

function safeStr(value: unknown) {
  return String(value ?? "").trim();
}

function normalizePartNo(value: string) {
  return safeStr(value).toLowerCase().replace(/[\s/_-]+/g, "");
}

function normalizeToken(value: string) {
  return safeStr(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function tokenize(value: string) {
  return normalizeToken(value)
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function pushMapList(map: Record<string, string[]>, key: string, value: string) {
  if (!key) return;
  map[key] ??= [];
  map[key].push(value);
}

function buildTokensFromPartNo(partNo: string) {
  const normalized = normalizePartNo(partNo);
  if (!normalized) return [];

  return unique([
    normalized,
    normalized.slice(0, 2),
    normalized.slice(0, 3),
    normalized.slice(0, 4),
  ]).filter(Boolean);
}

function buildSearchDocument(product: Product) {
  return {
    id: safeStr(product.id).toLowerCase(),
    partNo: safeStr(product.partNo),
    partNoNorm: normalizePartNo(product.partNo),
    brand: safeStr(product.brand),
    title: safeStr(product.title),
    category: safeStr(product.category),
    spec: safeStr(product.spec),
    imageUrl: getProductImageUrl(
      product.brand,
      product.partNo,
      product.imageUrl,
    ),
    specifications: (product.specifications ?? [])
      .filter(
        (item) =>
          safeStr(item?.label).length > 0 && safeStr(item?.value).length > 0,
      )
      .map((item) => ({
        label: safeStr(item.label),
        value: safeStr(item.value),
      })),
    stock: safeStr(product.stockStatus || "request"),
    crossReferences: unique(
      [...(product.refs ?? []), ...(product.crossReferences ?? [])]
        .map((value) => safeStr(value))
        .filter(Boolean),
    ),
  };
}

function buildIndex(catalog: Product[]) {
  const items = catalog
    .map(buildSearchDocument)
    .filter((item) => item.id && item.partNoNorm);

  const prefix2: Record<string, string[]> = {};
  const prefix3: Record<string, string[]> = {};
  const prefix4: Record<string, string[]> = {};
  const tokenIndex: Record<string, string[]> = {};
  const xrefIndex: Record<string, string[]> = {};

  for (const item of items) {
    pushMapList(prefix2, item.partNoNorm.slice(0, 2), item.id);
    pushMapList(prefix3, item.partNoNorm.slice(0, 3), item.id);
    pushMapList(prefix4, item.partNoNorm.slice(0, 4), item.id);

    const textBlob = [
      item.partNo,
      item.brand,
      item.title,
      item.category,
      item.spec,
      ...item.crossReferences,
      ...item.specifications.flatMap((spec) => [spec.label, spec.value]),
    ].join(" ");

    const tokens = unique([
      ...tokenize(textBlob),
      ...buildTokensFromPartNo(item.partNo),
    ]);

    for (const token of tokens) {
      pushMapList(tokenIndex, token, item.id);
    }

    for (const ref of item.crossReferences) {
      pushMapList(xrefIndex, normalizePartNo(ref), item.id);
    }
  }

  for (const map of [prefix2, prefix3, prefix4, tokenIndex, xrefIndex]) {
    for (const key of Object.keys(map)) {
      map[key] = unique(map[key]);
    }
  }

  return {
    version: 2,
    generatedAt: new Date().toISOString(),
    counts: {
      items: items.length,
      prefix2: Object.keys(prefix2).length,
      prefix3: Object.keys(prefix3).length,
      prefix4: Object.keys(prefix4).length,
      tokenKeys: Object.keys(tokenIndex).length,
      xrefKeys: Object.keys(xrefIndex).length,
    },
    items,
    prefix2,
    prefix3,
    prefix4,
    tokenIndex,
    xrefIndex,
  };
}

function main() {
  const index = buildIndex(Array.isArray(products) ? products : []);
  const outPath = path.join(process.cwd(), "data", "search-index.v2.json");
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`Built search index: ${outPath}`);
  console.log(index.counts);
}

main();
