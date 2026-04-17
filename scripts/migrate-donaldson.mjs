// scripts/migrate-donaldson.mjs
// run: node scripts/migrate-donaldson.mjs
import fs from "fs";
import path from "path";

const LIST = path.join(process.cwd(), "donaldson_web.txt");
const OUT_TS = path.join(process.cwd(), "data", "products", "products.donaldson.ts");

const OFFICIAL_TH_SEARCH = "https://shop.donaldson.com/store/en-th/search?query=";

function prefixFromPartNo(partNo) {
  const s = String(partNo || "").trim();
  const m = s.match(/^[A-Za-z]+/);
  return (m ? m[0][0] : s[0] || "").toUpperCase();
}

// ✅ rule-based category/type (ปรับได้ทีหลัง)
function inferType(partNo) {
  const pn = String(partNo).toUpperCase();
  // Donaldson ส่วนใหญ่ที่เราขาย = filtration → ใช้เป็น filter ก่อน
  // ถ้ามี pattern ชัดค่อยแยก
  if (pn.startsWith("P")) return "Filter Element";
  if (pn.startsWith("X")) return "Hydraulic Filter";
  if (pn.startsWith("F")) return "Fuel Filter";
  if (pn.startsWith("L")) return "Lube/Oil Filter";
  if (pn.startsWith("A")) return "Air Filter";
  return "Filtration Part";
}

function buildSpec(partNo) {
  const t = inferType(partNo);
  // ✅ enterprise-style: ชัด + ปลอดภัย + ให้ verify ด้วย RFQ
  return `${t} — verify application/spec via RFQ`;
}

function toTs(products) {
  return `// data/products/products.donaldson.ts
import type { Product } from "@/data/types";

export const donaldsonProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;
}

function main() {
  if (!fs.existsSync(LIST)) {
    console.error("❌ ไม่เจอไฟล์:", LIST);
    process.exit(1);
  }

  const partNos = fs
    .readFileSync(LIST, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const products = partNos.map((pn) => {
    const partNo = pn.toUpperCase();
    const prefix = prefixFromPartNo(partNo);
    return {
      id: `don-${partNo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      partNo,
      brand: "DONALDSON",
      category: "filter",
      title: `Donaldson ${inferType(partNo)} - ${partNo}`,
      spec: buildSpec(partNo),
      
      prefix,
      refs: [],
      officialUrl: `${OFFICIAL_TH_SEARCH}${encodeURIComponent(partNo)}`,
    };
  });

  fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });
  fs.writeFileSync(OUT_TS, toTs(products), "utf8");

  console.log("✅ wrote:", OUT_TS);
  console.log("✅ count:", products.length);
}

main();
