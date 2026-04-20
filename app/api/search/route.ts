import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("query") ?? "").trim();

  return NextResponse.json(
    {
      ok: false,
      error:
        "Deprecated endpoint. Use /api/search/suggest for lightweight suggestions or /{locale}/products?q=... for public product search.",
      query,
    },
    {
      status: 410,
      headers: {
        "X-MRT-Deprecated": "true",
        "X-MRT-Deprecated-Use": "/api/search/suggest",
      },
    }
  );
}
