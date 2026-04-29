import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products/index";
import { isBestConvertingProduct } from "@/data/merchandising/productHighlights";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().toUpperCase();

  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const items = products
    .map((product) => {
      const partNo = String(product.partNo ?? "");
      const brand = String(product.brand ?? "");
      const category = String(product.category ?? "");
      const title = String(product.title ?? "");
      const haystack = [partNo, brand, category, title].join(" ").toUpperCase();

      let score = 0;
     
     if (partNo === q) score += 1000;
     else if (partNo.startsWith(q)) score += 700;
     else if (partNo.includes(q)) score += 400;

     if (title.includes(q)) score += 120;
     if (brand.includes(q)) score += 80;

      // 🔥 RFQ BOOST
     if (isBestConvertingProduct(partNo)) score += 300;

      return {
        partNo,
        brand,
        category,
        title,
        isBestConverting: isBestConvertingProduct(partNo),
        score,
      };
    })
    .filter((item) => item.score > 0 && item.partNo)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.partNo.localeCompare(b.partNo);
    })
    .slice(0, 12)
    .map(({ score, ...item }) => item);

  return NextResponse.json({ items });
}