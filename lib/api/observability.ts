import crypto from "crypto";
import { NextResponse } from "next/server";

const TRACE_HEADER = "x-mrt-trace-id";

type LogLevel = "info" | "warn" | "error";
type LogFields = Record<string, unknown>;

type ErrorJsonOptions = {
  traceId: string;
  status: number;
  error: string;
  code?: string;
  extra?: Record<string, unknown>;
  headers?: HeadersInit;
};

//
// ✅ 1. SANITIZE traceId (กัน input แปลก / log injection)
//
function sanitizeTraceId(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "") // allow only safe chars
    .slice(0, 128);
}

//
// ✅ getTraceId (reuse → fallback → generate)
//
export function getTraceId(req?: Request) {
  const fromHeader =
    req?.headers.get(TRACE_HEADER) ?? req?.headers.get("x-request-id");

  if (fromHeader) {
    const cleaned = sanitizeTraceId(fromHeader);
    if (cleaned) return cleaned;
  }

  return crypto.randomUUID();
}

//
// headers helper
//
export function withTraceHeaders(
  headers: HeadersInit | undefined,
  traceId: string
) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set("X-MRT-Trace-Id", traceId);
  return nextHeaders;
}

export function forwardTraceHeaders(
  headers: HeadersInit | undefined,
  traceId: string
) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set(TRACE_HEADER, traceId);
  return nextHeaders;
}

//
// ✅ 2. jsonWithTrace ใส่ traceId ลง BODY อัตโนมัติ
//
export function jsonWithTrace<T>(
  body: T,
  init: ResponseInit | undefined,
  traceId: string
) {
  const normalizedBody =
    body && typeof body === "object" && !Array.isArray(body)
      ? ({ ...body, traceId } as T)
      : body;

  return NextResponse.json(normalizedBody, {
    ...init,
    headers: withTraceHeaders(init?.headers, traceId),
  });
}

//
// ✅ errorJson (กัน overwrite field สำคัญ)
//
export function errorJson({
  traceId,
  status,
  error,
  code,
  extra,
  headers,
}: ErrorJsonOptions) {
  return jsonWithTrace(
    {
      ...(extra ?? {}), // extra มาก่อน
      ok: false,
      error,
      traceId,
      ...(code ? { code } : {}),
    },
    { status, headers },
    traceId
  );
}

//
// helper สำหรับ error message
//
export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

//
// ✅ 3. logApiEvent กัน JSON.stringify พัง
//
export function logApiEvent(
  level: LogLevel,
  event: string,
  fields: LogFields = {}
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...fields,
  };

  let line: string;

  try {
    line = JSON.stringify(payload);
  } catch {
    // fallback ถ้ามี circular structure
    line = JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      event: "log.serialize_failed",
      originalEvent: event,
    });
  }

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}