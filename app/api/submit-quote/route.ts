import { POST as canonicalSubmitPost } from "@/app/api/rfq/submit/route";
import {
  errorJson,
  forwardTraceHeaders,
  getErrorMessage,
  getTraceId,
  logApiEvent,
} from "@/lib/api/observability";

export async function POST(req: Request) {
  const traceId = getTraceId(req);

  try {
    logApiEvent("info", "rfq.submit_quote_alias.received", {
      traceId,
      route: "/api/submit-quote",
    });

    const forwardedReq = new Request(req, {
      headers: forwardTraceHeaders(req.headers, traceId),
    });

    const response = await canonicalSubmitPost(forwardedReq);
    response.headers.set("X-MRT-Deprecated", "true");
    response.headers.set("X-MRT-Deprecated-Use", "/api/rfq/submit");

    const payload = await response.clone().json().catch(() => null);
    logApiEvent("info", "rfq.submit_quote_alias.completed", {
      traceId,
      route: "/api/submit-quote",
      upstreamStatus: response.status,
      ok: payload?.ok,
      requestId: payload?.requestId,
      rfqId: payload?.rfqId,
    });

    return response;
  } catch (error) {
    logApiEvent("error", "rfq.submit_quote_alias.failed", {
      traceId,
      route: "/api/submit-quote",
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
