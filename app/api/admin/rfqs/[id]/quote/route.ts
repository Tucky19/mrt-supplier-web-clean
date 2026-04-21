import { POST as canonicalQuoteRecordPost } from "@/app/api/admin/rfq/[id]/quote-record/route";
import { POST as canonicalQuoteDocumentPost } from "@/app/api/admin/rfq/[id]/quote-document/route";
import {
  errorJson,
  forwardTraceHeaders,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const traceId = getTraceId(request);
  let id = "";

  try {
    ({ id } = await context.params);
    const bodyText = await request.text();
    const body = JSON.parse(bodyText || "{}");

    logApiEvent("info", "admin.rfqs.quote_wrapper.received", {
      traceId,
      route: "/api/admin/rfqs/[id]/quote",
      rfqId: id,
    });

    const recordReq = new Request(
      request.url.replace(`/api/admin/rfqs/${id}/quote`, `/api/admin/rfq/${id}/quote-record`),
      {
        method: "POST",
        headers: forwardTraceHeaders(request.headers, traceId),
        body: JSON.stringify({
          quoteRef: body.quoteRef,
          quotedBy: body.quotedBy,
          quoteAmount: body.quoteAmount,
          quoteCurrency: body.quoteCurrency,
          validUntil: body.validUntil,
          quotedAt: body.quotedAt,
        }),
      }
    );

    const recordRes = await canonicalQuoteRecordPost(recordReq, {
      params: Promise.resolve({ id }),
    });

    const recordPayload = await recordRes.json().catch(() => null);
    if (!recordRes.ok || !recordPayload?.ok) {
      logApiEvent("warn", "admin.rfqs.quote_wrapper.record_failed", {
        traceId,
        route: "/api/admin/rfqs/[id]/quote",
        rfqId: id,
        upstreamStatus: recordRes.status,
        error: recordPayload?.error,
      });

      return jsonWithTrace(
        {
          ...(recordPayload ?? {
            ok: false,
            error: "Failed to update quote record.",
          }),
          traceId,
        },
        {
          status: recordRes.status,
          headers: {
            "X-MRT-Deprecated": "true",
            "X-MRT-Deprecated-Use": `/api/admin/rfq/${id}/quote-record`,
          },
        },
        traceId
      );
    }

    const documentReq = new Request(
      request.url.replace(`/api/admin/rfqs/${id}/quote`, `/api/admin/rfq/${id}/quote-document`),
      {
        method: "POST",
        headers: forwardTraceHeaders(request.headers, traceId),
        body: JSON.stringify({
          quoteDocumentUrl: body.quoteDocumentUrl,
          quoteSentAt: body.quoteSentAt,
          quoteSentNote: body.quoteSentNote,
        }),
      }
    );

    const documentRes = await canonicalQuoteDocumentPost(documentReq, {
      params: Promise.resolve({ id }),
    });

    const documentPayload = await documentRes.json().catch(() => null);
    if (!documentRes.ok || !documentPayload?.ok) {
      logApiEvent("error", "admin.rfqs.quote_wrapper.partial_failure", {
        traceId,
        route: "/api/admin/rfqs/[id]/quote",
        rfqId: id,
        recordSaved: true,
        documentSaved: false,
        upstreamStatus: documentRes.status,
        error: documentPayload?.error,
      });

      return jsonWithTrace(
        {
          ...(documentPayload ?? {
            ok: false,
            error: "Failed to update quote document.",
          }),
          partialFailure: true,
          partial: {
            quoteRecordSaved: true,
            quoteDocumentSaved: false,
          },
          rfq: recordPayload?.rfq,
          traceId,
        },
        {
          status: documentRes.status,
          headers: {
            "X-MRT-Deprecated": "true",
            "X-MRT-Deprecated-Use": `/api/admin/rfq/${id}/quote-document`,
          },
        },
        traceId
      );
    }

    logApiEvent("info", "admin.rfqs.quote_wrapper.completed", {
      traceId,
      route: "/api/admin/rfqs/[id]/quote",
      rfqId: id,
    });

    return jsonWithTrace(
      {
        ok: true,
        rfq: {
          ...(recordPayload?.rfq ?? {}),
          quoteDocumentUrl: documentPayload?.rfq?.quoteDocumentUrl ?? null,
          quoteSentAt: documentPayload?.rfq?.quoteSentAt ?? null,
          quoteSentNote: documentPayload?.rfq?.quoteSentNote ?? null,
        },
      },
      {
        headers: {
          "X-MRT-Deprecated": "true",
          "X-MRT-Deprecated-Use": `/api/admin/rfq/${id}/quote-record,/api/admin/rfq/${id}/quote-document`,
        },
      },
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfqs.quote_wrapper.failed", {
      traceId,
      route: "/api/admin/rfqs/[id]/quote",
      rfqId: id || undefined,
      error: getErrorMessage(error, "Failed to update quote info"),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to update quote info",
      headers: {
        "X-MRT-Deprecated": "true",
        "X-MRT-Deprecated-Use": `/api/admin/rfq/${id || "[id]"}/quote-record,/api/admin/rfq/${id || "[id]"}/quote-document`,
      },
    });
  }
}
