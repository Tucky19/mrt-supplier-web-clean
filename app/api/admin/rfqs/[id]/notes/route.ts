import { POST as canonicalNotePost } from "@/app/api/admin/rfq/[id]/note/route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const forwardedReq = new Request(
    request.url.replace(`/api/admin/rgqs/${id}/notes`, `/api/admin/rfq/${id}/note`),
    {
      method: "POST",
      headers: request.headers,
      body: await request.text(),
    }
  );

  const response = await canonicalNotePost(forwardedReq, {
    params: Promise.resolve({ id }),
  });

  response.headers.set("X-MRT-Deprecated", "true");
  response.headers.set("X-MRT-Deprecated-Use", `/api/admin/rfq/${id}/note`);

  return response;
}
