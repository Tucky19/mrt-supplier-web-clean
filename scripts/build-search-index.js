// scripts/build-search-index.js
// MRT Supplier — Search Index v2 Builder
// Source of truth: data/products.dump.json
// Output: data/search-index.v2.json
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

// ---------- utils ----------
function safeStr(v) {
  return String(v ?? "").trim();
}

function normPartNo(v) {
  return String(v ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function pushMapList(map, key, value) {
  if (!key) return;
  if (!map[key]) map[key] = [];
  map[key].push(value);
}

function tokenize(text) {
  const raw = String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/g)
    .filter(Boolean);

  return raw.filter((t) => t.length >= 2);
}

function buildTokensFromPartNo(partNo) {
  const n = normPartNo(partNo);
  if (!n) return [];
  const tokens = [n];
  if (n.length >= 2) tokens.push(n.slice(0, 2));
  if (n.length >= 3) tokens.push(n.slice(0, 3));
  if (n.length >= 4) tokens.push(n.slice(0, 4));
  return uniq(tokens);
}

function pickPartNo(p) {
  return (
    p?.partNo ??
    p?.part_no ??
    p?.partno ??
    p?.pn ??
    p?.sku ??
    p?.code ??
    p?.number ??
    ""
  );
}

function pickId(p, partNoNorm) {
  const id = safeStr(p?.id ?? p?.productId ?? p?.product_id ?? "");
  if (id) return id.toLowerCase();

  const brand = normPartNo(p?.brand ?? p?.manufacturer ?? "");
  return [brand, partNoNorm].filter(Boolean).join("-").toLowerCase();
}

function pickBrand(p) {
  return safeStr(p?.brand ?? p?.manufacturer ?? "");
}

function pickTitle(p) {
  return safeStr(p?.title ?? p?.name ?? p?.nameTh ?? p?.name_th ?? "");
}

function pickCategory(p) {
  return safeStr(p?.category ?? p?.product_type ?? p?.type ?? "");
}

function pickSpec(p) {
  return safeStr(p?.spec ?? p?.summarySpec ?? p?.specSummary ?? "");
}

function pickXrefs(p) {
  const xs =
    p?.cross_reference ??
    p?.crossReference ??
    p?.xrefs ??
    p?.xref ??
    p?.cross_refs ??
    [];

  if (!Array.isArray(xs)) return [];

  return xs
    .map((x) => ({
      brand: safeStr(x?.brand ?? x?.maker ?? ""),
      partNo: safeStr(x?.partNo ?? x?.part_no ?? x?.pn ?? x?.code ?? ""),
    }))
    .filter((x) => x.brand || x.partNo);
}

// ---------- load products ----------
function loadProducts() {
  const root = process.cwd();
  const dumpPath = path.join(root, "data", "products.dump.json");

  if (!fs.existsSync(dumpPath)) {
    console.error("❌ products.dump.json not found at:", dumpPath);
    console.error("👉 สร้าง/Export dump ก่อน แล้วค่อย build index v2");
    return [];
  }

  const raw = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
  const products = Array.isArray(raw) ? raw : raw?.products;

  if (!Array.isArray(products) || !products.length) {
    console.error("❌ Invalid products.dump.json shape (expected array or {products:[]})");
    return [];
  }

  console.log("✅ Loaded products from:", dumpPath, "| count:", products.length);
  return products;
}

// ---------- build index ----------
function buildIndex(products) {
  const items = [];
  const prefix2 = {};
  const prefix3 = {};
  const prefix4 = {};
  const tokenIndex = {};
  const xrefIndex = {};

  for (const p of products) {
    const partNo = safeStr(pickPartNo(p));
    const partNoNorm = normPartNo(partNo);
    if (!partNoNorm) continue;

    const id = pickId(p, partNoNorm);
    if (!id) continue;

    const brand = pickBrand(p);
    const title = pickTitle(p);
    const category = pickCategory(p);
    const spec = pickSpec(p);

    const crossReferences = Array.isArray(p?.crossReferences)
  ? p.crossReferences.filter(Boolean)
  : [];

const doc = {
  id,
  partNo,
  partNoNorm,
  brand,
  title,
  category,
  spec,
  stock: safeStr(p?.stock ?? p?.stockStatus ?? "request"),
  crossReferences,
};
    items.push(doc);

    const p2 = partNoNorm.slice(0, 2);
    const p3 = partNoNorm.slice(0, 3);
    const p4 = partNoNorm.slice(0, 4);

    if (p2) pushMapList(prefix2, p2, id);
    if (p3) pushMapList(prefix3, p3, id);
    if (p4) pushMapList(prefix4, p4, id);

     const textBlob = [
      partNo,
      brand,
      title,
      category,
      spec,

      ...(Array.isArray(p?.applications)
        ? p.applications.map((x) => safeStr(x))
        : []),

      ...(Array.isArray(p?.refs)
        ? p.refs.map((x) => safeStr(x))
        : []),

      ...(Array.isArray(p?.crossReferences)
        ? p.crossReferences.map((x) => safeStr(x))
        : []),

      ...(Array.isArray(p?.seo?.keywords)
        ? p.seo.keywords.map((x) => safeStr(x))
        : []),
    ].join(" ");

   
    const toks = uniq([
      ...tokenize(textBlob),
      ...buildTokensFromPartNo(partNo),
    ]);

    for (const t of toks) pushMapList(tokenIndex, t, id);

    const xrefs = pickXrefs(p);
    for (const x of xrefs) {
      const xn = normPartNo(x.partNo);
      if (xn) pushMapList(xrefIndex, xn, id);
    }
  }

  for (const k of Object.keys(prefix2)) prefix2[k] = uniq(prefix2[k]);
  for (const k of Object.keys(prefix3)) prefix3[k] = uniq(prefix3[k]);
  for (const k of Object.keys(prefix4)) prefix4[k] = uniq(prefix4[k]);
  for (const k of Object.keys(tokenIndex)) tokenIndex[k] = uniq(tokenIndex[k]);
  for (const k of Object.keys(xrefIndex)) xrefIndex[k] = uniq(xrefIndex[k]);

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

// ---------- main ----------
function main() {
  const products = loadProducts();

  if (!products.length) {
    console.error("No products loaded. Expected data/products.dump.json");
    process.exit(1);
  }

  const index = buildIndex(products);

  const outPath = path.join(process.cwd(), "data", "search-index.v2.json");
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), "utf8");

  console.log("✅ Built search index v2:", outPath);
  console.log("Counts:", index.counts);
}

main();