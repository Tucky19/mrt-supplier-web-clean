import { NextResponse } from "next/server";
import { searchProductsPRO } from "@/data/search/search";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = String(searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ ok: true, q, items: [], matchType: "none" });
  }

  const res = searchProductsPRO(q, { limit: 50 });

  const items = res.items.map((p) => ({
    id: p.id,
    partNo: p.partNo,
    brand: p.brand,
    category: p.category ?? "",
    spec: p.spec ?? "",
    stockStatus: p.stockStatus ?? "request",
    image: p.image,
    matchType: p.matchType,
    matchLabel: p.matchLabel,
  }));

  return NextResponse.json({
    ok: true,
    q,
    items,
  });
}
