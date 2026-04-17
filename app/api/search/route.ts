import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/search/search";

type SearchMode = "part" | "spec" | "all";

function safeMode(value: string | null): SearchMode {
  if (value === "part" || value === "spec" || value === "all") {
    return value;
  }

  return "all";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = String(searchParams.get("q") ?? "").trim();
    const mode = safeMode(searchParams.get("mode"));
    const limitRaw = Number(searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitRaw)
      ? Math.max(1, Math.min(100, Math.floor(limitRaw)))
      : 20;

    if (!q) {
      return NextResponse.json({
        ok: true,
        q: "",
        total: 0,
        hits: [],
      });
    }

    const hits = searchProducts(products, q, mode, limit);

    return NextResponse.json({
      ok: true,
      q,
      total: hits.length,
      hits,
    });
  } catch (error) {
    console.error("[API_SEARCH_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to search products.",
      },
      { status: 500 }
    );
  }
}