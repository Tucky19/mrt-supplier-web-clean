import { GET as canonicalSuggestGet } from "@/app/api/search/suggest/route";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const forwardedReq = new Request(
    req.url.replace("/api/search-suggest", "/api/search/suggest"),
    {
      method: "GET",
      headers: req.headers,
    }
  );

  const response = await canonicalSuggestGet(forwardedReq as any);
  response.headers.set("X-MRT-Deprecated", "true");
  response.headers.set(
    "X-MRT-Deprecated-Use",
    "/api/search/suggest"
  );

  return response;
}
