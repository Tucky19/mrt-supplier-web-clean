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

function buildRelationPartTokens(values: string[]) {
  const tokens = new Set<string>();

  for (const value of values) {
    const normalizedValue = normalizePartNo(value);
    if (normalizedValue) {
      tokens.add(normalizedValue);
    }

    for (const token of tokenize(value)) {
      const normalizedToken = normalizePartNo(token);
      if (
        normalizedToken &&
        /[a-z]/.test(normalizedToken) &&
        /\d/.test(normalizedToken)
      ) {
        tokens.add(normalizedToken);
      }
    }
  }

  return Array.from(tokens);
}

function buildSearchDocument(product: Product) {
  const refs = unique(
    (product.refs ?? []).map((value) => safeStr(value)).filter(Boolean),
  );
  const crossReferences = unique(
    (product.crossReferences ?? [])
      .map((value) => safeStr(value))
      .filter(Boolean),
  );
  const pairedParts = unique(
    (product.pairedParts ?? [])
      .map((part) => ({
        partNo: safeStr(part?.partNo),
        relation: safeStr(part?.relation),
        note: safeStr(part?.note),
      }))
      .filter((part) => part.partNo),
  );

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
    refs,
    crossReferences,
    pairedParts,
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
  const refIndex: Record<string, string[]> = {};
  const xrefIndex: Record<string, string[]> = {};
  const pairedPartIndex: Record<string, string[]> = {};

  for (const item of items) {
    pushMapList(prefix2, item.partNoNorm.slice(0, 2), item.id);
    pushMapList(prefix3, item.partNoNorm.slice(0, 3), item.id);
    pushMapList(prefix4, item.partNoNorm.slice(0, 4), item.id);

    const pairedPartNumbers = item.pairedParts.map((part) => part.partNo);
    const relationValues = [
      ...item.refs,
      ...item.crossReferences,
      ...pairedPartNumbers,
    ];
    const relationPartTokens = buildRelationPartTokens(relationValues);

    const textBlob = [
      item.partNo,
      item.brand,
      item.title,
      item.category,
      item.spec,
      ...item.refs,
      ...item.crossReferences,
      ...pairedPartNumbers,
      ...item.specifications.flatMap((spec) => [spec.label, spec.value]),
    ].join(" ");

    const tokens = unique([
      ...tokenize(textBlob),
      ...buildTokensFromPartNo(item.partNo),
      ...relationPartTokens,
    ]);

    for (const token of tokens) {
      pushMapList(tokenIndex, token, item.id);
    }

    for (const ref of buildRelationPartTokens(item.refs)) {
      pushMapList(refIndex, ref, item.id);
    }

    for (const ref of buildRelationPartTokens(item.crossReferences)) {
      pushMapList(xrefIndex, ref, item.id);
    }

    for (const ref of buildRelationPartTokens(pairedPartNumbers)) {
      pushMapList(pairedPartIndex, ref, item.id);
    }
  }

  for (const map of [
    prefix2,
    prefix3,
    prefix4,
    tokenIndex,
    refIndex,
    xrefIndex,
    pairedPartIndex,
  ]) {
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
      refKeys: Object.keys(refIndex).length,
      xrefKeys: Object.keys(xrefIndex).length,
      pairedPartKeys: Object.keys(pairedPartIndex).length,
    },
    items,
    prefix2,
    prefix3,
    prefix4,
    tokenIndex,
    refIndex,
    xrefIndex,
    pairedPartIndex,
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
