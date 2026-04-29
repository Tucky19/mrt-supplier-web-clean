import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// === CONFIG ===
const FILE_PATH = "./Data_Donaldson (2).xlsx";
const OUTPUT_PATH = "./data/products/converted-products.json";

// === HELPER ===
function normalizeThread(thread?: string) {
  if (!thread) return undefined;
  return thread.trim().replace(/\s+/g, " ");
}

function buildSpec(d: any) {
  return [
    d.od_mm && `OD ${d.od_mm} mm`,
    d.length_mm && `L ${d.length_mm} mm`,
    d.thread && d.thread,
  ]
    .filter(Boolean)
    .join(" × ");
}

// === MAIN ===
function run() {
  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  const products = rows.map((row) => {
    const od = Number(row.od_mm || row.OD || row.od);
    const length = Number(row.length_mm || row.Length || row.L);
    const thread = normalizeThread(row.thread || row.Thread);

    const dimensions = {
      od_mm: isNaN(od) ? undefined : od,
      length_mm: isNaN(length) ? undefined : length,
      thread: thread || undefined,
    };

    return {
      partNo: String(row.partNo || row.PartNumber || row.part_number).trim(),
      brand: "donaldson",

      // 👇 UI field
      spec: buildSpec(dimensions),

      // 👇 search / matching engine
      dimensions,
    };
  });

  fs.writeFileSync(
    path.resolve(OUTPUT_PATH),
    JSON.stringify(products, null, 2),
    "utf-8"
  );

  console.log(`✅ Converted ${products.length} products`);
}

run();