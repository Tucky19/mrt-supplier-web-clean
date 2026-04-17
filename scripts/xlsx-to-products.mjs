import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const xlsxPath = path.resolve("donaldson_web_data.xlsx"); // ถ้าไฟล์อยู่ root โปรเจกต์
// ถ้าไฟล์อยู่ที่อื่น ให้เปลี่ยน path ให้ตรง เช่น path.resolve("data/raw/donaldson_web_data.xlsx")

const wb = xlsx.readFile(xlsxPath);
const sheetName = wb.SheetNames[0]; // ใช้ชีทแรก
const ws = wb.Sheets[sheetName];

// แปลงเป็น array ของ object (หัวตารางต้องอยู่แถวแรก)
const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

// 🔧 ตรงนี้ “แมพคอลัมน์” ให้ตรงกับหัวตารางของนาย
// เปลี่ยนชื่อคีย์ด้านซ้ายให้ตรงตามหัวตารางใน Excel ของนาย
const products = rows
  .map((r, i) => ({
    id: String(r.id || r.ID || r.Id || i + 1),
    partNo: String(r.partNo || r["Part No"] || r["PART NO"] || r["PartNo"] || "").trim(),
    brand: String(r.brand || r.Brand || "Donaldson").trim(),
    category: String(r.category || r.Category || "Filter").trim(),
    name: String(r.name || r.Name || r.Description || "").trim(),
    url: String(r.url || r.URL || "").trim(),
  }))
  .filter((p) => p.partNo.length > 0);

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/products.json", JSON.stringify(products, null, 2), "utf8");

console.log(`✅ Exported ${products.length} products -> data/products.json (sheet: ${sheetName})`);
