import { NextRequest, NextResponse } from "next/server";
import { autocompleteProducts } from "@/data/search/autocomplete";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (!q || q.trim().length < 2) {
    return NextResponse.json({
      items: [],
    });
  }

  const items = autocompleteProducts(q, 8);

  return NextResponse.json({
    items,
  });
}