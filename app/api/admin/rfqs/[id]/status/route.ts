import { POST as canonicalStatusPost } from "@/app/api/admin/rfq/[id]/status/route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
export const dynamic = "force-dynamic";
export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const forwardedReq = new Request(
    request.url.replace(`/api/admin/rfqs/${id}/status`, `/api/admin/rfq/${id}/status`),
    {
      method: "POST",
      headers: request.headers,
      body: await request.text(),
    }
  );

  const response = await canonicalStatusPost(forwardedReq, {
    params: Promise.resolve({ id }),
  });

  response.headers.set("X-MRT-Deprecated", "true");
  response.headers.set("X-MRT-Deprecated-Use", `/api/admin/rfq/${id}/status`);

  return response;
}
