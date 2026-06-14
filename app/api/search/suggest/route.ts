import { NextRequest, NextResponse } from "next/server";
import { isBestConvertingProduct } from "@/data/merchandising/productHighlights";
import { searchProducts } from "@/lib/search/search";

export function getSearchSuggestionItems(q: string) {
  return searchProducts(q, { limit: 12 }).map((product) => {
    const partNo = String(product.partNo ?? "");
    const matchType = product._matchType;

    return {
      partNo,
      brand: String(product.brand ?? ""),
      category: String(product.category ?? ""),
      title: String(product.title ?? ""),
      matchType,
      _matchType: matchType,
      isBestConverting: isBestConvertingProduct(partNo),
    };
  });
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const items = getSearchSuggestionItems(q);

  return NextResponse.json({ items });
}
