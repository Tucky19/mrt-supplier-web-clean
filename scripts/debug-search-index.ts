import fs from "fs";
import path from "path";

function norm(v: any) {
  return String(v ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

const target = process.argv[2] ?? "P558615";
const targetNorm = norm(target);

const file = path.join(process.cwd(), "data", "search-index.v2.json");

console.log("Using file:", file);

if (!fs.existsSync(file)) {
  console.log("❌ File not found");
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8");

console.log("Contains string:", raw.toLowerCase().includes(target.toLowerCase()));

const json = JSON.parse(raw);

let found = 0;

function scan(obj: any) {
  if (!obj) return;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const partNo =
        item?.partNo ??
        item?.part_no ??
        item?.pn ??
        item?.sku ??
        item?.code;

      if (norm(partNo) === targetNorm) {
        console.log("✅ FOUND ENTRY:");
        console.log(item);
        found++;
      }
    }
  } else if (typeof obj === "object") {
    for (const key in obj) {
      scan(obj[key]);
    }
  }
}

scan(json);

console.log("Total found:", found);