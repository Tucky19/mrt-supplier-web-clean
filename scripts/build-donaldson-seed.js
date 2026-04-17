// scripts/build-donaldson-seed.js
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function normPart(x) {
  if (x === null || x === undefined) return null;
  return String(x).trim().toUpperCase().replace(/\s+/g, "");
}

function parseStock(x) {
  if (x === null || x === undefined) return null;
  const s = String(x).trim();
  if (!s || s === "-" || s.toLowerCase() === "nan") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const excelPath = path.join(process.cwd(), "donaldson_web_data.xlsx"); // << วางไฟล์ Excel ไว้ที่ root โปรเจกต์
const outPath = path.join(process.cwd(), "data", "donaldson.seed.ts");

if (!fs.existsSync(excelPath)) {
  console.log("❌ ไม่เจอไฟล์:", excelPath);
  process.exit(1);
}

const wb = XLSX.readFile(excelPath);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

const map = new Map();

for (const r of rows) {
  const partNo = normPart(r.Donaldson);
  if (!partNo) continue;

  const stockQty = parseStock(r.STOCK);
  const specText = r.SPEC ? String(r.SPEC).trim() : null;

  // ✅ ตัดซ้ำ: ถ้า partNo ซ้ำ ให้เก็บ stock มากสุด + spec ที่มีค่า
  const prev = map.get(partNo);
  if (!prev) {
    map.set(partNo, { partNo, stockQty, specText });
  } else {
    const bestStock =
      prev.stockQty === null ? stockQty : stockQty === null ? prev.stockQty : Math.max(prev.stockQty, stockQty);
    const bestSpec = prev.specText || specText || null;
    map.set(partNo, { partNo, stockQty: bestStock, specText: bestSpec });
  }
}

const items = Array.from(map.values()).sort((a, b) => a.partNo.localeCompare(b.partNo));

const lines = [];
lines.push(`import type { Product } from "./types";`);
lines.push("");
lines.push(`export const DONALDSON_SEED: Product[] = [`);

items.forEach((it) => {
  const obj = {
    id: `donaldson-${it.partNo}`,
    partNo: it.partNo,
    title: `Donaldson Filter ${it.partNo}`,
    brand: "donaldson",
    category: "filter",
    stockStatus: "in_stock", // ✅ คุณต้องการ in stock ทั้งหมด
  };

  if (it.stockQty !== null && it.stockQty !== undefined) obj.stockQty = it.stockQty;
  if (it.specText) obj.specText = it.specText;

  lines.push(`  ${JSON.stringify(obj)},`);
});

lines.push(`];`);
lines.push("");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log("✅ Generated:", outPath);
console.log("✅ Unique partNo:", items.length);
