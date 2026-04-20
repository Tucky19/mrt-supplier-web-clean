import { getTraceId, jsonWithTrace, logApiEvent } from "@/lib/api/observability";

export async function GET(req: Request) {
  const traceId = getTraceId(req);

  logApiEvent("warn", "rfq.detail_public_deprecated", {
    traceId,
    route: "/api/rfq/[rid]",
  });

  return jsonWithTrace(
    {
      ok: false,
      error:
        "Deprecated endpoint. RFQ detail lookup is not exposed on this public route.",
      traceId,
    },
    {
      status: 410,
      headers: {
        "X-MRT-Deprecated": "true",
      },
    },
    traceId
  );
}
