import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/search/search";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = String(searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({
      ok: true,
      items: [],
    });
  }

  const hits = searchProducts(products, q, "all", 8);

  const items = hits.map((hit) => ({
    id: hit.product.id,
    partNo: hit.product.partNo,
    brand: hit.product.brand,
    category: hit.product.category,
    title: hit.product.title,
    spec: hit.product.spec,
    refs: hit.product.refs ?? [],
    score: hit.score,
    reasons: hit.reasons,
  }));

  return NextResponse.json({
    ok: true,
    items,
  });
}
