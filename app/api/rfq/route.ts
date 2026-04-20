import { POST as submitRfqPost } from "@/app/api/rfq/submit/route";
import {
  errorJson,
  forwardTraceHeaders,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

type LegacyRfqBody = {
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  lineId?: string;
  note?: string;
  contactPref?: string;
  source?: string;
  items?: unknown[];
};

function mapLegacyRfqBody(body: LegacyRfqBody) {
  return {
    customer: {
      company: body.company,
      name: body.name,
      phone: body.phone,
      email: body.email,
      lineId: body.lineId,
      note: body.note,
      contactPref: body.contactPref,
    },
    source: body.source,
    items: Array.isArray(body.items) ? body.items : [],
  };
}

export async function POST(req: Request) {
  const traceId = getTraceId(req);
  const deprecatedHeaders = {
    "X-MRT-Deprecated": "true",
    "X-MRT-Deprecated-Use": "/api/rfq/submit",
  };

  try {
    const body = (await req.json()) as LegacyRfqBody;
    const mappedBody = mapLegacyRfqBody(body);

    logApiEvent("info", "rfq.legacy_wrapper.received", {
      traceId,
      route: "/api/rfq",
      itemCount: mappedBody.items.length,
      source: mappedBody.source ?? "legacy",
    });

    const forwardedReq = new Request(req.url.replace("/api/rfq", "/api/rfq/submit"), {
      method: "POST",
      headers: forwardTraceHeaders(req.headers, traceId),
      body: JSON.stringify(mappedBody),
    });

    const response = await submitRfqPost(forwardedReq);
    const payload = await response.json().catch(() => null);

    if (!payload) {
      logApiEvent("error", "rfq.legacy_wrapper.invalid_upstream", {
        traceId,
        route: "/api/rfq",
        upstreamStatus: response.status,
      });

      return errorJson({
        traceId,
        status: 502,
        error: "Failed to create RFQ",
        headers: deprecatedHeaders,
      });
    }

    logApiEvent("info", "rfq.legacy_wrapper.completed", {
      traceId,
      route: "/api/rfq",
      upstreamStatus: response.status,
      ok: Boolean(payload?.ok),
      requestId: payload?.requestId,
      rfqId: payload?.rfqId,
    });

    return jsonWithTrace(
      {
        ok: Boolean(payload?.ok),
        requestId: payload?.requestId,
        error: payload?.error,
        rfqId: payload?.rfqId,
        ...(typeof payload?.adminEmailOk === "boolean"
          ? { adminEmailOk: payload.adminEmailOk }
          : {}),
        ...(typeof payload?.customerEmailOk === "boolean"
          ? { customerEmailOk: payload.customerEmailOk }
          : {}),
        ...(typeof payload?.partialFailure === "boolean"
          ? { partialFailure: payload.partialFailure }
          : {}),
        ...(Array.isArray(payload?.sideEffectFailures)
          ? { sideEffectFailures: payload.sideEffectFailures }
          : {}),
        ...(payload?.traceId ? { traceId: payload.traceId } : {}),
        rfq: payload?.ok
          ? {
              id: payload?.rfqId,
              requestId: payload?.requestId,
              status: "new",
            }
          : undefined,
      },
      {
        status: response.status,
        headers: deprecatedHeaders,
      },
      traceId
    );
  } catch (error) {
    logApiEvent("error", "rfq.legacy_wrapper.failed", {
      traceId,
      route: "/api/rfq",
      error: getErrorMessage(error, "Failed to create RFQ"),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to create RFQ",
      headers: deprecatedHeaders,
    });
  }
}
