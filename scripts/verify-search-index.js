// scripts/verify-search-index.js
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
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

function loadIndex() {
  const file = path.join(process.cwd(), "data", "search-index.v2.json");
  if (!fs.existsSync(file)) {
    throw new Error(`search-index.v2.json not found: ${file}`);
  }
  const idx = JSON.parse(fs.readFileSync(file, "utf8"));
  return { idx, file };
}

function getItems(idx) {
  if (Array.isArray(idx?.items)) return idx.items;
  if (Array.isArray(idx?.docs)) return idx.docs;
  if (Array.isArray(idx)) return idx;
  if (idx?.items && typeof idx.items === "object") return Object.values(idx.items);
  return [];
}

function main() {
  const qRaw = process.argv[2] ?? "P558615";
  const q = norm(qRaw);

  const { idx, file } = loadIndex();
  const items = getItems(idx);

  const counts = idx?.counts ?? null;
  const ver = idx?.version ?? "unknown";

  const hits = items.filter((p) => {
    const pn = norm(pickPartNo(p));
    const pnNorm = norm(p?.partNoNorm ?? "");
    const id = norm(p?.id ?? "");

    return (
      pn === q ||
      pnNorm === q ||
      id === q ||
      pn.includes(q) ||
      pnNorm.includes(q) ||
      id.includes(q)
    );
  });

  console.log("✅ verify:index");
  console.log("  file:", file);
  console.log("  version:", ver);
  if (counts) console.log("  counts:", counts);
  console.log("  items:", items.length);
  console.log("  query:", qRaw, "->", q);
  console.log("  found:", hits.length);

  if (hits[0]) {
    const p = hits[0];
    console.log("  sample:", {
      id: p?.id,
      partNo: pickPartNo(p),
      partNoNorm: p?.partNoNorm,
      brand: p?.brand,
      title: p?.title,
      category: p?.category,
    });
  }

  const p2 = q.slice(0, 2);
  const p3 = q.slice(0, 3);
  const p4 = q.slice(0, 4);

  const prefix2Hit = Array.isArray(idx?.prefix2?.[p2]) ? idx.prefix2[p2].length : 0;
  const prefix3Hit = Array.isArray(idx?.prefix3?.[p3]) ? idx.prefix3[p3].length : 0;
  const prefix4Hit = Array.isArray(idx?.prefix4?.[p4]) ? idx.prefix4[p4].length : 0;

  const exactTokenHit = Array.isArray(idx?.tokenIndex?.[q]) ? idx.tokenIndex[q].length : 0;
  const xrefHit = Array.isArray(idx?.xrefIndex?.[q]) ? idx.xrefIndex[q].length : 0;

  console.log("  diagnostics:", {
    prefix2: { key: p2, ids: prefix2Hit },
    prefix3: { key: p3, ids: prefix3Hit },
    prefix4: { key: p4, ids: prefix4Hit },
    tokenIndex: { key: q, ids: exactTokenHit },
    xrefIndex: { key: q, ids: xrefHit },
  });

  process.exit(hits.length ? 0 : 2);
}

try {
  main();
} catch (e) {
  console.error("❌ verify:index error:", e?.message || e);
  process.exit(1);
}