import fs from "fs";
import path from "path";
import { products } from "../data/products/index";

const missing: string[] = [];

for (const p of products) {
  const imageUrl = p.imageUrl;

  if (!imageUrl) {
    missing.push(`${p.partNo} | ไม่มี imageUrl`);
    continue;
  }

  const cleanPath = imageUrl.startsWith("/")
    ? imageUrl.slice(1)
    : imageUrl;

  const fullPath = path.join(process.cwd(), "public", cleanPath);

  if (!fs.existsSync(fullPath)) {
    missing.push(`${p.partNo} | ${imageUrl}`);
  }
}

console.log("=== Missing Product Images ===");

if (missing.length === 0) {
  console.log("✅ รูปครบทุกสินค้า");
} else {
  console.log(`❌ พบรูปหาย ${missing.length} รายการ\n`);
  console.log(missing.join("\n"));
}