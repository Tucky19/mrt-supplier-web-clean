import crypto from "crypto";
import { prisma } from "@/lib/db";
import { genRequestId } from "@/lib/rfq/id";
import { validateRfqPayload } from "@/lib/rfq/validate";
import { logRfqEvent } from "@/lib/rfq/events";
import { consumeRfqRateLimit } from "@/lib/rfq/rateLimit";
import { sendRfqLineNotification } from "@/lib/line/sendRfqLineNotification";
import {
  sendAdminRfqEmail,
  sendCustomerRfqConfirmationEmail,
} from "@/lib/mail";
import {
  errorJson,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

export const dynamic = "force-dynamic";

function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SECRET || "rfq";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function isSameRfqLite(a: any, b: any) {
  const aC = a?.customer ?? {};
  const bC = b?.customer ?? {};

  const sameContact =
    (aC.phone || "") === (bC.phone || "") &&
    (aC.email || "") === (bC.email || "") &&
    (aC.lineId || "") === (bC.lineId || "");

  const aItems = Array.isArray(a?.items) ? a.items : [];
  const bItems = Array.isArray(b?.items) ? b.items : [];
  if (aItems.length !== bItems.length) return false;

  const norm = (xs: any[]) =>
    xs
      .map((x) => ({
        partNo: String(x?.partNo ?? "").trim(),
        qty: Number(x?.qty ?? 0),
      }))
      .sort((p, q) => (p.partNo + p.qty).localeCompare(q.partNo + q.qty));

  const A = norm(aItems);
  const B = norm(bItems);

  for (let i = 0; i < A.length; i++) {
    if (A[i].partNo !== B[i].partNo || A[i].qty !== B[i].qty) return false;
  }

  return sameContact;
}

export async function POST(req: Request) {
  const traceId = getTraceId(req);
  let requestId: string | undefined;

  try {
    const body = await req.json();

    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get("user-agent") || undefined;
    const itemCount = Array.isArray(body?.items) ? body.items.length : 0;

    logApiEvent("info", "rfq.submit.received", {
      traceId,
      route: "/api/rfq/submit",
      itemCount,
      hasEmail: Boolean(body?.customer?.email),
      hasPhone: Boolean(body?.customer?.phone),
      ipHash,
    });

    // 0) Honeypot
    const hpField = process.env.RFQ_HONEYPOT_FIELD || "website";
    const hpValue = String(body?.customer?.[hpField] ?? "").trim();
    if (hpValue) {
      logApiEvent("warn", "rfq.submit.honeypot_blocked", {
        traceId,
        route: "/api/rfq/submit",
        hpField,
        ipHash,
      });

      return jsonWithTrace({ ok: true, requestId: "OK" }, undefined, traceId);
    }

    // 1) Rate limit
    const rl = await consumeRfqRateLimit({ ipHash });
    if (!rl.ok) {
      logApiEvent("warn", "rfq.submit.rate_limited", {
        traceId,
        route: "/api/rfq/submit",
        ipHash,
        retryAfterSec: rl.retryAfterSec,
        limit: rl.limit,
      });

      return errorJson({
        traceId,
        status: 429,
        error: `ส่งคำขอถี่เกินไป (limit ${rl.limit}/window) กรุณารอแล้วลองใหม่`,
        extra: { retryAfterSec: rl.retryAfterSec },
        headers: { "Retry-After": String(rl.retryAfterSec) },
      });
    }

    // 2) Validate payload
    const v = validateRfqPayload(body);
    if (!v.ok) {
      logApiEvent("warn", "rfq.submit.validation_failed", {
        traceId,
        route: "/api/rfq/submit",
        itemCount,
        error: v.error,
      });

      return errorJson({
        traceId,
        status: 400,
        error: v.error,
      });
    }

    // 3) Duplicate guard (2 นาที)
    const since = new Date(Date.now() - 2 * 60 * 1000);
    const last = await prisma.rfq.findFirst({
      where: { ipHash, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    if (last) {
      const candidate = {
        customer: {
          phone: last.phone ?? "",
          email: last.email ?? "",
          lineId: last.lineId ?? "",
        },
        items: last.items.map((x: any) => ({
          partNo: x.partNo,
          qty: x.qty,
        })),
      };

      const incoming = {
        customer: {
          phone: v.data.customer.phone ?? "",
          email: v.data.customer.email ?? "",
          lineId: v.data.customer.lineId ?? "",
        },
        items: v.data.items.map((x) => ({
          partNo: x.partNo,
          qty: x.qty,
        })),
      };

      if (isSameRfqLite(candidate, incoming)) {
        logApiEvent("info", "rfq.submit.deduped", {
          traceId,
          route: "/api/rfq/submit",
          requestId: last.requestId,
          rfqId: last.id,
          itemCount: incoming.items.length,
        });

        return jsonWithTrace(
          {
            ok: true,
            requestId: last.requestId,
            rfqId: last.id,
            deduped: true,
          },
          undefined,
          traceId
        );
      }
    }

    // 4) Save DB
    requestId = genRequestId();

    const rfq = await prisma.rfq.create({
      data: {
        requestId,
        status: "new",
        source: "web",
        company: v.data.customer.company,
        name: v.data.customer.name,
        phone: v.data.customer.phone,
        email: v.data.customer.email,
        lineId: v.data.customer.lineId,
        note: v.data.customer.note,
        contactPref: v.data.customer.contactPref,
        ipHash,
        userAgent,
        items: {
          create: v.data.items.map((it: any) => ({
            productId: it.productId,
            partNo: it.partNo,
            brand: it.brand,
            title: it.title,
            category: it.category,
            spec: it.spec,
            qty: it.qty,
            meta: it.meta ?? undefined,
          })),
        },
      },
      include: { items: true },
    });

    const sideEffectFailures: string[] = [];
    let customerEmailOk: boolean | null = null;

    const recordSideEffectFailure = (name: string, error: unknown) => {
      sideEffectFailures.push(name);
      logApiEvent("error", "rfq.submit.side_effect_failed", {
        traceId,
        route: "/api/rfq/submit",
        requestId: rfq.requestId,
        rfqId: rfq.id,
        sideEffect: name,
        error: String(error instanceof Error ? error.message : error),
      });
    };

    const safeLogRfqEvent = async (
      type: Parameters<typeof logRfqEvent>[1],
      payload: Parameters<typeof logRfqEvent>[2],
      failureName: string
    ) => {
      try {
        await logRfqEvent(rfq.id, type, payload);
      } catch (error) {
        recordSideEffectFailure(failureName, error);
      }
    };

    await safeLogRfqEvent("created", { requestId: rfq.requestId }, "event_created");
    logApiEvent("info", "rfq.submit.created", {
      traceId,
      route: "/api/rfq/submit",
      requestId: rfq.requestId,
      rfqId: rfq.id,
      itemCount: rfq.items.length,
      ipHash,
    });

    const mailCustomer = {
      company: rfq.company ?? undefined,
      name: rfq.name ?? undefined,
      phone: rfq.phone ?? undefined,
      email: rfq.email ?? undefined,
      lineId: rfq.lineId ?? undefined,
      note: rfq.note ?? undefined,
      contactPref: rfq.contactPref ?? undefined,
    };

    const mailItems = rfq.items.map((x: any) => ({
      productId: x.productId,
      partNo: x.partNo,
      brand: x.brand ?? undefined,
      category: x.category ?? undefined,
      title: x.title ?? undefined,
      spec: x.spec ?? undefined,
      qty: x.qty,
    }));

    // 5) Email admin
    let adminEmailOk = false;

    try {
      await sendAdminRfqEmail({
        requestId: rfq.requestId,
        customer: mailCustomer,
        items: mailItems,
      });

      adminEmailOk = true;
      await safeLogRfqEvent("emailed_admin", {
        to: process.env.EMAIL_TO_ADMIN,
      }, "event_emailed_admin");
      logApiEvent("info", "rfq.submit.admin_email_sent", {
        traceId,
        route: "/api/rfq/submit",
        requestId: rfq.requestId,
        rfqId: rfq.id,
      });
    } catch (e: any) {
      await safeLogRfqEvent("email_failed", {
        target: "admin",
        message: String(e?.message ?? e),
      }, "event_admin_email_failed");
      recordSideEffectFailure("email_admin", e);
    }

    // 6) Email customer
    if (rfq.email) {
      try {
        await sendCustomerRfqConfirmationEmail({
          requestId: rfq.requestId,
          customer: mailCustomer,
          items: mailItems,
        });

        customerEmailOk = true;
        await safeLogRfqEvent("emailed_customer", {
          to: rfq.email,
        }, "event_emailed_customer");
        logApiEvent("info", "rfq.submit.customer_email_sent", {
          traceId,
          route: "/api/rfq/submit",
          requestId: rfq.requestId,
          rfqId: rfq.id,
        });
      } catch (e: any) {
        customerEmailOk = false;
        await safeLogRfqEvent("email_failed", {
          target: "customer",
          message: String(e?.message ?? e),
        }, "event_customer_email_failed");
        recordSideEffectFailure("email_customer", e);
      }
    }
let lineNotifyOk = false;

try {
  await sendRfqLineNotification({
    requestId: rfq.requestId,
    company: rfq.company ?? null,
    name: rfq.name ?? null,
    phone: rfq.phone ?? null,
    email: rfq.email ?? null,
    itemCount: rfq.items.length,
  });

  lineNotifyOk = true;

  logApiEvent("info", "rfq.submit.line_sent", {
    traceId,
    route: "/api/rfq/submit",
    requestId: rfq.requestId,
    rfqId: rfq.id,
  });
} catch (e) {
  recordSideEffectFailure("line_notify", e);
}
    const partialFailure = sideEffectFailures.length > 0;

    logApiEvent("info", "rfq.submit.completed", {
      traceId,
      route: "/api/rfq/submit",
      requestId: rfq.requestId,
      rfqId: rfq.id,
      adminEmailOk,
      customerEmailOk,
      partialFailure,
      sideEffectFailures,
      remainingInWindow: rl.remaining,
    });

    return jsonWithTrace(
      {
        ok: true,
        requestId: rfq.requestId,
        rfqId: rfq.id,
        adminEmailOk,
        customerEmailOk,
        partialFailure,
        sideEffectFailures,
        remainingInWindow: rl.remaining,
      },
      undefined,
      traceId
    );
  } catch (e: any) {
    logApiEvent("error", "rfq.submit.failed", {
      traceId,
      route: "/api/rfq/submit",
      requestId,
      error: getErrorMessage(e, "Failed to submit RFQ."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: getErrorMessage(e, "Failed to submit RFQ."),
      extra: requestId ? { requestId } : undefined,
    });
  }
}
