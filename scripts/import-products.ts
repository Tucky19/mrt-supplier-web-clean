import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

const csv = require("csv-parser");

// 🔥 import normalize (ถ้ายังไม่มี ให้สร้างตามที่เคยให้)
function normalizeId(input: string): string {
  return input
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[\/_-]/g, "");
}

// 🔥 แปลง cross_ref → refs[]
function parseRefs(cross_ref?: string): string[] {
  if (!cross_ref) return [];
  return cross_ref
    .split(",")
    .map((r) => normalizeId(r))
    .filter(Boolean);
}

// 🎯 map CSV → Product
function mapRow(row: any) {
  return {
    id: normalizeId(row.id || row.partNo),
    partNo: row.partNo?.trim(),
    brand: row.brand?.toLowerCase(),
    category: row.category || "hydraulic_filter",

    description: row.description?.trim(),
    type: row.type,

    spec: row.spec,

    od_mm: row.od_mm ? Number(row.od_mm) : null,
    id_mm: row.id_mm ? Number(row.id_mm) : null,
    length_mm: row.length_mm ? Number(row.length_mm) : null,

    imageUrl: row.image,

    refs: parseRefs(row.cross_ref),
  };
}

async function run() {
  const filePath = path.join(process.cwd(), "data/import/products.csv");

  const results: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => results.push(data))
      .on("end", async () => {
        try {
          console.log(`📦 Importing ${results.length} rows...`);

          for (const row of results) {
            const product = mapRow(row);
            

            // 🔥 upsert ป้องกัน duplicate
            await prisma.product.upsert({
              where: { id: product.id },
              update: product,
              create: product,
            });
          }

          console.log("✅ Import complete");
          resolve();
        } catch (err) {
          console.error("❌ Import failed:", err);
          reject(err);
        }
      })
      .on("error", reject);
  });
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
