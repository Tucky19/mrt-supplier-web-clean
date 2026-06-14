import { NextResponse } from "next/server";
import { getSearchSuggestionItems } from "@/app/api/search/suggest/route";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  const response = NextResponse.json({
    items: q.length < 2 ? [] : getSearchSuggestionItems(q),
  });

  response.headers.set("X-MRT-Deprecated", "true");
  response.headers.set(
    "X-MRT-Deprecated-Use",
    "/api/search/suggest"
  );

  return response;
}
