// scripts/debug-search-index.ts
/* eslint-disable no-console */
import fs from "fs";
import path from "path";

type AnyObj = Record<string, any>;

function normPartNo(v: any) {
  return String(v ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function isObj(x: any): x is AnyObj {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

// หา array ทั้งหมดใน JSON ไม่ว่าจะซ่อนลึกแค่ไหน (กัน index v2 หลาย shape)
function collectArrays(root: any, maxArrays = 200) {
  const arrays: Array<{ path: string; arr: any[] }> = [];
  const seen = new Set<any>();

  const stack: Array<{ path: string; node: any }> = [{ path: "$", node: root }];

  while (stack.length && arrays.length < maxArrays) {
    const { path: p, node } = stack.pop()!;
    if (!node) continue;

    if (Array.isArray(node)) {
      if (!seen.has(node)) {
        seen.add(node);
        arrays.push({ path: p, arr: node });
      }
      // ไม่ต้องไล่ลึกเข้าไปใน array อีก เพราะจะหนักเกิน
      continue;
    }

    if (isObj(node)) {
      for (const k of Object.keys(node)) {
        const child = node[k];
        if (child && (Array.isArray(child) || isObj(child))) {
          stack.push({ path: `${p}.${k}`, node: child });
        }
      }
    }
  }

  return arrays;
}

function getPartNoLike(x: any) {
  if (!x || typeof x !== "object") return undefined;
  return (
    x.partNo ??
    x.part_no ??
    x.partno ??
    x.pn ??
    x.sku ??
    x.code ??
    x.number ??
    x.part ??
    undefined
  );
}

function getIdLike(x: any) {
  if (!x || typeof x !== "object") return undefined;
  return x.id ?? x.productId ?? x.product_id ?? x.pid ?? undefined;
}

function findHitsInArray(arr: any[], targetNorm: string) {
  const hits: any[] = [];
  for (const x of arr) {
    const pn = getPartNoLike(x);
    const id = getIdLike(x);

    const pnN = pn != null ? normPartNo(pn) : "";
    const idN = id != null ? normPartNo(id) : "";

    if (pnN === targetNorm || idN === targetNorm) {
      hits.push(x);
      if (hits.length >= 10) break;
    }
  }
  return hits;
}

function peekRoot(idx: any) {
  if (Array.isArray(idx)) {
    console.log("[PEEK] root is ARRAY length:", idx.length);
    return;
  }
  if (isObj(idx)) {
    const ks = Object.keys(idx);
    console.log("[PEEK] root is OBJECT keys sample:", ks.slice(0, 25));
    const preview = ks.slice(0, 12).map((k) => {
      const v = (idx as AnyObj)[k];
      const t = Array.isArray(v) ? `array(${v.length})` : typeof v;
      return `${k}:${t}`;
    });
    console.log("[PEEK] top fields:", preview.join(" | "));
    return;
  }
  console.log("[PEEK] root type:", typeof idx);
}

function main() {
  const target = process.argv[2] ?? "P558615";
  const targetNorm = normPartNo(target);

  const file = path.join(process.cwd(), "data", "search-index.v2.json");

  if (!fs.existsSync(file)) {
    console.error("❌ NOT FOUND:", file);
    console.error("👉 เช็คว่ามีไฟล์ data/search-index.v2.json จริงไหม");
    process.exit(1);
  }

  const raw = fs.readFileSync(file, "utf8");
  const size = fs.statSync(file).size;

  console.log("====================================");
  console.log("USING FILE:", file);
  console.log("FILE SIZE:", size, "bytes");
  console.log("TARGET:", target, "| norm:", targetNorm);
  console.log("HAS target string:", raw.toLowerCase().includes(String(target).toLowerCase()));
  console.log("HAS target digits:", raw.includes(target.replace(/[^0-9]/g, "")));
  console.log("====================================");

  const idx = JSON.parse(raw);

  // 1) ดูโครงสร้าง root
  peekRoot(idx);

  // 2) รวม arrays ทุกจุด แล้วลองหา
  const arrays = collectArrays(idx);

  console.log("[SCAN] arrays discovered:", arrays.length);

  let totalHits = 0;
  let firstFoundPath = "";

  for (const { path: p, arr } of arrays) {
    const hits = findHitsInArray(arr, targetNorm);
    if (hits.length) {
      if (!firstFoundPath) firstFoundPath = p;
      totalHits += hits.length;

      console.log("------------------------------------");
      console.log("✅ FOUND in:", p, "| array length:", arr.length, "| hits:", hits.length);
      console.log("Sample hit #1:");
      console.dir(hits[0], { depth: 5 });
      if (hits.length > 1) {
        console.log("Sample hit #2:");
        console.dir(hits[1], { depth: 5 });
      }
    }
  }

  console.log("====================================");
  if (!totalHits) {
    console.log("❌ RESULT: FOUND 0");
    console.log("แปลว่าอย่างน้อยในไฟล์นี้ (ที่ path ด้านบน) ไม่มี entry ที่ partNo/id ตรงกับ:", target);
    console.log("ถ้าคุณมั่นใจว่ามีในไฟล์ → มักเป็นกรณี field ชื่อแปลกมาก หรือถูกเก็บไม่ใช่ partNo/id");
  } else {
    console.log("✅ RESULT: total hits =", totalHits);
    console.log("FIRST FOUND PATH:", firstFoundPath);
  }
  console.log("====================================");
}

main();