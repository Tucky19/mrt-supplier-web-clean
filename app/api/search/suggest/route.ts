import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestionItems } from "@/lib/search/suggestions";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const items = getSearchSuggestionItems(q);

  return NextResponse.json({ items });
}
