import {
  getTraceId,
  errorJson,
  jsonWithTrace,
  forwardTraceHeaders,
  logApiEvent,
  getErrorMessage,
} from "@/lib/api/observability";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const traceId = getTraceId(req);

  let body: any;

  try {
    // ✅ safe JSON parse
    try {
      body = await req.json();
    } catch {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid JSON body.",
      });
    }

    // ✅ log wrapper entry
    logApiEvent("info", "rfq.wrapper.forward", {
      traceId,
      route: "/api/quote",
      target: "/api/rfq/submit",
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/rfq/submit`,
      {
        method: "POST",
        headers: forwardTraceHeaders(
          { "Content-Type": "application/json" },
          traceId
        ),
        body: JSON.stringify(body),
      }
    );

    const contentType = res.headers.get("content-type") || "";

    // 🔴 handle non-JSON
    if (!contentType.includes("application/json")) {
      const text = await res.text();

      logApiEvent("error", "rfq.wrapper.non_json", {
        traceId,
        status: res.status,
        bodyPreview: text.slice(0, 200),
      });

      return errorJson({
        traceId,
        status: 502,
        error: "Upstream returned invalid response.",
      });
    }

    const data = await res.json();

    // 🔴 log upstream error
    if (!res.ok) {
      logApiEvent("warn", "rfq.wrapper.upstream_error", {
        traceId,
        status: res.status,
        error: data?.error,
      });
    }

    return jsonWithTrace(data, { status: res.status }, traceId);
  } catch (e) {
    logApiEvent("error", "rfq.wrapper.failed", {
      traceId,
      error: getErrorMessage(e, "Wrapper failed"),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to process request.",
    });
  }
}
