import { POST as canonicalFollowUpPost } from "@/app/api/admin/rfq/[id]/follow-up/route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const forwardedReq = new Request(
    request.url.replace(
      `/api/admin/rgqs/${id}/follow-ups`,
      `/api/admin/rfq/${id}/follow-up`
    ),
    {
      method: "POST",
      headers: request.headers,
      body: await request.text(),
    }
  );

  const response = await canonicalFollowUpPost(forwardedReq, {
    params: Promise.resolve({ id }),
  });

  response.headers.set("X-MRT-Deprecated", "true");
  response.headers.set("X-MRT-Deprecated-Use", `/api/admin/rfq/${id}/follow-up`);

  return response;
}
