import { POST as canonicalSubmitPost } from "@/app/api/rfq/submit/route";
import {
  errorJson,
  forwardTraceHeaders,
  getErrorMessage,
  getTraceId,
  logApiEvent,
} from "@/lib/api/observability";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const traceId = getTraceId(req);

  try {
    logApiEvent("info", "rfq.submit_alias.received", {
      traceId,
      route: "/api/submit-rfq",
    });

    const forwardedReq = new Request(req, {
      headers: forwardTraceHeaders(req.headers, traceId),
    });

    const response = await canonicalSubmitPost(forwardedReq);
    response.headers.set("X-MRT-Deprecated", "true");
    response.headers.set("X-MRT-Deprecated-Use", "/api/rfq/submit");

    const payload = await response.clone().json().catch(() => null);
    logApiEvent("info", "rfq.submit_alias.completed", {
      traceId,
      route: "/api/submit-rfq",
      upstreamStatus: response.status,
      ok: payload?.ok,
      requestId: payload?.requestId,
      rfqId: payload?.rfqId,
    });

    return response;
  } catch (error) {
    logApiEvent("error", "rfq.submit_alias.failed", {
      traceId,
      route: "/api/submit-rfq",
      error: getErrorMessage(error, "Failed to submit RFQ."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to submit RFQ.",
      headers: {
        "X-MRT-Deprecated": "true",
        "X-MRT-Deprecated-Use": "/api/rfq/submit",
      },
    });
  }
}
