import crypto from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRfqLineNotification } from "@/lib/line/sendRfqLineNotification";
import {
  sendAdminRfqEmail,
  sendCustomerRfqConfirmationEmail,
} from "@/lib/mail";
import {
  buildContactMethodPresenceSummary,
  getMissingProductRequestLabel,
} from "@/lib/rfq/missingProductRequest";

export const dynamic = "force-dynamic";
const NOTIFICATION_TIMEOUT_MS = 5000;

type Payload = {
  locale?: string;
  partNo?: string;
  filterType?: string;
  brand?: string;
  qty?: string | number;
  machineApplication?: string;
  note?: string;
  outerDiameter?: string;
  innerDiameter?: string;
  lengthHeight?: string;
  threadSize?: string;
  gasketOD?: string;
  gasketID?: string;
  contactName?: string;
  company?: string;
  phone?: string;
  email?: string;
  lineId?: string;
  searchQuery?: string;
  sourcePage?: string;
};

function safeStr(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function buildRequestId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `MPR-${y}${m}${d}-${rand}`;
}

function getRateLimitWindowStart(now: Date, windowMinutes: number) {
  const bucketMs = windowMinutes * 60 * 1000;
  return new Date(Math.floor(now.getTime() / bucketMs) * bucketMs);
}

async function checkRateLimit(ip: string) {
  const windowMinutes = 15;
  const limit = 5;
  const now = new Date();
  const windowStart = getRateLimitWindowStart(now, windowMinutes);
  const ipHash = hashIp(ip);

  const record = await prisma.rfqRateLimit.findUnique({
    where: {
      ipHash_windowStart: {
        ipHash,
        windowStart,
      },
    },
  });

  if (!record) {
    await prisma.rfqRateLimit.create({
      data: {
        ipHash,
        windowStart,
        count: 1,
      },
    });

    return { ok: true as const };
  }

  if (record.count >= limit) {
    return { ok: false as const, error: "Too many requests. Please try again later." };
  }

  await prisma.rfqRateLimit.update({
    where: { id: record.id },
    data: {
      count: { increment: 1 },
    },
  });

  return { ok: true as const };
}

function hasProductIdentifier(payload: ReturnType<typeof normalizePayload>) {
  return Boolean(
    payload.partNo ||
      payload.note ||
      payload.filterType ||
      payload.outerDiameter ||
      payload.innerDiameter ||
      payload.lengthHeight ||
      payload.threadSize ||
      payload.gasketOD ||
      payload.gasketID
  );
}

function hasContactMethod(payload: ReturnType<typeof normalizePayload>) {
  return Boolean(payload.phone || payload.email || payload.lineId);
}

function normalizePayload(body: Payload) {
  const qtyParsed = Number.parseInt(safeStr(body.qty), 10);

  return {
    partNo: safeStr(body.partNo),
    filterType: safeStr(body.filterType),
    brand: safeStr(body.brand),
    qty: Number.isFinite(qtyParsed) && qtyParsed > 0 ? qtyParsed : 1,
    machineApplication: safeStr(body.machineApplication),
    note: safeStr(body.note),
    outerDiameter: safeStr(body.outerDiameter),
    innerDiameter: safeStr(body.innerDiameter),
    lengthHeight: safeStr(body.lengthHeight),
    threadSize: safeStr(body.threadSize),
    gasketOD: safeStr(body.gasketOD),
    gasketID: safeStr(body.gasketID),
    contactName: safeStr(body.contactName),
    company: safeStr(body.company),
    phone: safeStr(body.phone),
    email: safeStr(body.email),
    lineId: safeStr(body.lineId),
    searchQuery: safeStr(body.searchQuery),
    sourcePage: safeStr(body.sourcePage),
    locale: safeStr(body.locale),
  };
}

function buildDimensionSummary(payload: ReturnType<typeof normalizePayload>) {
  const rows = [
    payload.outerDiameter ? `OD ${payload.outerDiameter}` : "",
    payload.innerDiameter ? `ID ${payload.innerDiameter}` : "",
    payload.lengthHeight ? `L/H ${payload.lengthHeight}` : "",
    payload.threadSize ? `Thread ${payload.threadSize}` : "",
    payload.gasketOD ? `Gasket OD ${payload.gasketOD}` : "",
    payload.gasketID ? `Gasket ID ${payload.gasketID}` : "",
  ].filter(Boolean);

  return rows.join(" | ");
}

function buildStoredNote(payload: ReturnType<typeof normalizePayload>) {
  const lines = [
    payload.note ? `Details: ${payload.note}` : "",
    payload.filterType ? `Filter Type: ${payload.filterType}` : "",
    payload.brand ? `Brand: ${payload.brand}` : "",
    payload.machineApplication
      ? `Machine/Application: ${payload.machineApplication}`
      : "",
    buildDimensionSummary(payload)
      ? `Dimensions: ${buildDimensionSummary(payload)}`
      : "",
    payload.searchQuery ? `Search Query: ${payload.searchQuery}` : "",
    payload.sourcePage ? `Source Page: ${payload.sourcePage}` : "",
    payload.locale ? `Locale: ${payload.locale}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

function getNotificationEnvStatus() {
  return {
    has_SMTP_HOST: Boolean(process.env.SMTP_HOST?.trim()),
    has_SMTP_USER: Boolean(process.env.SMTP_USER?.trim()),
    has_SMTP_PASS: Boolean(process.env.SMTP_PASS?.trim()),
    has_RFQ_TO_EMAIL: Boolean(process.env.RFQ_TO_EMAIL?.trim()),
    has_LINE_CHANNEL_ACCESS_TOKEN: Boolean(
      process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim(),
    ),
    has_LINE_TARGET_USER_ID: Boolean(process.env.LINE_TARGET_USER_ID?.trim()),
  };
}

function getElapsedMs(startedAt: number) {
  return Date.now() - startedAt;
}

async function withTimeout<T>(
  label: string,
  job: () => Promise<T>,
  timeoutMs: number,
) {
  const startedAt = Date.now();
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  try {
    const result = await Promise.race<T>([
      job(),
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error(`${label} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);

    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    return {
      ok: true as const,
      result,
      durationMs: getElapsedMs(startedAt),
    };
  } catch (error) {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    const message =
      error instanceof Error ? error.message : `${label} failed`;

    return {
      ok: false as const,
      error: message,
      timedOut: message.includes("timed out"),
      durationMs: getElapsedMs(startedAt),
    };
  }
}

async function resolveLeadIdForMissingProductRequest(
  payload: ReturnType<typeof normalizePayload>,
) {
  const normalizedEmail = payload.email ? normalizeEmail(payload.email) : null;
  const hasEmail = Boolean(normalizedEmail);
  const hasPhone = Boolean(payload.phone);
  const hasLineId = Boolean(payload.lineId);

  console.info("[MISSING_PRODUCT_REQUEST] lead_lookup", {
    hasEmail,
    hasPhone,
    hasLineId,
  });

  if (!hasEmail && !hasPhone && !hasLineId) {
    return null;
  }

  const findExistingLead = async () => {
    if (normalizedEmail) {
      const byEmail = await prisma.lead.findUnique({
        where: { email: normalizedEmail },
      });
      if (byEmail) return byEmail;
    }

    if (payload.phone) {
      const byPhone = await prisma.lead.findUnique({
        where: { phone: payload.phone },
      });
      if (byPhone) return byPhone;
    }

    if (payload.lineId) {
      const byLineId = await prisma.lead.findUnique({
        where: { lineId: payload.lineId },
      });
      if (byLineId) return byLineId;
    }

    return null;
  };

  try {
    const existingLead = await findExistingLead();

    if (existingLead) {
      const emailOwner =
        normalizedEmail
          ? await prisma.lead.findUnique({
              where: { email: normalizedEmail },
            })
          : null;
      const phoneOwner = payload.phone
        ? await prisma.lead.findUnique({
            where: { phone: payload.phone },
          })
        : null;
      const lineOwner = payload.lineId
        ? await prisma.lead.findUnique({
            where: { lineId: payload.lineId },
          })
        : null;

      const canUseEmail = !emailOwner || emailOwner.id === existingLead.id;
      const canUsePhone = !phoneOwner || phoneOwner.id === existingLead.id;
      const canUseLineId = !lineOwner || lineOwner.id === existingLead.id;

      const updatedLead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name: payload.contactName || existingLead.name,
          company: payload.company || existingLead.company,
          email:
            normalizedEmail && canUseEmail
              ? normalizedEmail
              : existingLead.email,
          phone:
            payload.phone && canUsePhone ? payload.phone : existingLead.phone,
          lineId:
            payload.lineId && canUseLineId
              ? payload.lineId
              : existingLead.lineId,
          note: payload.note || existingLead.note,
        },
      });

      console.info("[MISSING_PRODUCT_REQUEST] lead_update", {
        success: true,
        reusedExistingLead: true,
        usedEmailMatch: Boolean(emailOwner && emailOwner.id === existingLead.id),
        skippedEmailConflict: Boolean(normalizedEmail && !canUseEmail),
        skippedPhoneConflict: Boolean(payload.phone && !canUsePhone),
        skippedLineConflict: Boolean(payload.lineId && !canUseLineId),
      });

      return updatedLead.id;
    }

    const createdLead = await prisma.lead.create({
      data: {
        name: payload.contactName || null,
        company: payload.company || null,
        email: normalizedEmail,
        phone: payload.phone || null,
        lineId: payload.lineId || null,
        note: payload.note || null,
      },
    });

    console.info("[MISSING_PRODUCT_REQUEST] lead_create", {
      success: true,
      hasEmail,
      hasPhone,
      hasLineId,
    });

    return createdLead.id;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lead create/update failed";

    console.error("[MISSING_PRODUCT_REQUEST] lead_save", {
      success: false,
      hasEmail,
      hasPhone,
      hasLineId,
      error: message,
    });

    try {
      const fallbackLead = await findExistingLead();
      if (fallbackLead) {
        console.info("[MISSING_PRODUCT_REQUEST] lead_fallback_reuse", {
          success: true,
          hasEmail,
          hasPhone,
          hasLineId,
        });
        return fallbackLead.id;
      }
    } catch (fallbackError) {
      console.error("[MISSING_PRODUCT_REQUEST] lead_fallback_reuse", {
        success: false,
        error:
          fallbackError instanceof Error
            ? fallbackError.message
            : "Lead fallback lookup failed",
      });
    }

    return null;
  }
}

async function runNotificationJobs(params: {
  rfqId: string;
  emailPayload: {
    requestId: string;
    customer: {
      name: string;
      company: string | null;
      email: string | null;
      phone: string | null;
      lineId: string | null;
      note: string | null;
      contactPref: string | null;
    };
    items: Array<{
      productId: string;
      partNo: string;
      brand?: string | null;
      title?: string | null;
      qty: number;
      category?: string | null;
      spec?: string | null;
      meta?: unknown;
    }>;
  };
  customerEmail: string | null;
  linePayload: {
    requestId: string;
    company: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    lineId: string | null;
    partNo: string;
    filterType: string | null;
    brand: string | null;
    qty: number;
    machineApplication: string | null;
    dimensionSummary: string | null;
    note: string | null;
    searchQuery: string | null;
    sourcePage: string | null;
    locale: string | null;
  };
}) {
  const { rfqId, emailPayload, customerEmail, linePayload } = params;
  const notificationStartedAt = Date.now();
  const envStatus = getNotificationEnvStatus();

  console.info("[MISSING_PRODUCT_REQUEST] notification_env", envStatus);
  console.info("[MISSING_PRODUCT_REQUEST] notification_started", {
    requestId: emailPayload.requestId,
    hasCustomerEmail: Boolean(customerEmail),
    hasLineId: Boolean(linePayload.lineId),
    hasPhone: Boolean(linePayload.phone),
  });

  const recordRfqEvent = async (type: string, payload: Record<string, unknown>) => {
    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type,
          payload,
        },
      });
    } catch {}
  };

  const emailStartedAt = Date.now();
  const adminEmailPromise = withTimeout(
    "admin_email",
    () => sendAdminRfqEmail(emailPayload),
    NOTIFICATION_TIMEOUT_MS,
  );
  const customerEmailPromise = customerEmail
    ? withTimeout(
        "customer_email",
        () => sendCustomerRfqConfirmationEmail(emailPayload),
        NOTIFICATION_TIMEOUT_MS,
      )
    : Promise.resolve(null);

  const [adminEmailResult, customerEmailResult] = await Promise.all([
    adminEmailPromise,
    customerEmailPromise,
  ]);
  const emailNotifyMs = getElapsedMs(emailStartedAt);

  if (adminEmailResult.ok) {
    console.info("[MISSING_PRODUCT_REQUEST] admin_email", {
      requestId: emailPayload.requestId,
      success: true,
      emailNotifyMs: adminEmailResult.durationMs,
    });

    await recordRfqEvent("emailed_admin", {
      requestType: "missing_product_request",
    });
  } else {
    console.error("[MISSING_PRODUCT_REQUEST] admin_email", {
      requestId: emailPayload.requestId,
      success: false,
      timedOut: adminEmailResult.timedOut,
      emailNotifyMs: adminEmailResult.durationMs,
      error: adminEmailResult.error,
    });

    await recordRfqEvent("email_failed", {
      step: "admin",
      requestType: "missing_product_request",
      timedOut: adminEmailResult.timedOut,
      error: adminEmailResult.error,
    });
  }

  if (!customerEmailResult) {
    console.info("[MISSING_PRODUCT_REQUEST] customer_email", {
      requestId: emailPayload.requestId,
      success: false,
      skipped: true,
      reason: "no_customer_email",
    });
  } else if (customerEmailResult.ok) {
    console.info("[MISSING_PRODUCT_REQUEST] customer_email", {
      requestId: emailPayload.requestId,
      success: true,
      emailNotifyMs: customerEmailResult.durationMs,
    });

    await recordRfqEvent("emailed_customer", {
      requestType: "missing_product_request",
      hasCustomerEmail: true,
    });
  } else {
    console.error("[MISSING_PRODUCT_REQUEST] customer_email", {
      requestId: emailPayload.requestId,
      success: false,
      timedOut: customerEmailResult.timedOut,
      emailNotifyMs: customerEmailResult.durationMs,
      error: customerEmailResult.error,
    });

    await recordRfqEvent("email_failed", {
      step: "customer",
      requestType: "missing_product_request",
      timedOut: customerEmailResult.timedOut,
      error: customerEmailResult.error,
    });
  }

  const lineStartedAt = Date.now();
  const lineResult = await withTimeout(
    "line_notify",
    () =>
      sendRfqLineNotification({
        requestId: linePayload.requestId,
        company: linePayload.company,
        name: linePayload.name,
        itemCount: 1,
        requestTypeLabel: getMissingProductRequestLabel(),
        includeContactDetails: false,
        extraLines: [
          `Item: ${linePayload.partNo || linePayload.filterType || "Missing Product"}`,
          linePayload.filterType ? `Filter Type: ${linePayload.filterType}` : null,
          `Qty: ${linePayload.qty}`,
          linePayload.dimensionSummary
            ? `Dimensions: ${linePayload.dimensionSummary}`
            : null,
          linePayload.machineApplication
            ? `Machine/Application: ${linePayload.machineApplication}`
            : null,
          `Contact: ${buildContactMethodPresenceSummary({
            phone: linePayload.phone,
            email: linePayload.email,
            lineId: linePayload.lineId,
          })}`,
        ],
      }),
    NOTIFICATION_TIMEOUT_MS,
  );
  const lineNotifyMs = getElapsedMs(lineStartedAt);

  if (lineResult.ok) {
    console.info("[MISSING_PRODUCT_REQUEST] line_notify", {
      requestId: linePayload.requestId,
      success: true,
      lineNotifyMs: lineResult.durationMs,
    });

    await recordRfqEvent("line_sent", {
      requestType: "missing_product_request",
    });
  } else {
    console.error("[MISSING_PRODUCT_REQUEST] line_notify", {
      requestId: linePayload.requestId,
      success: false,
      timedOut: lineResult.timedOut,
      lineNotifyMs: lineResult.durationMs,
      error: lineResult.error,
    });

    await recordRfqEvent("line_failed", {
      requestType: "missing_product_request",
      timedOut: lineResult.timedOut,
      error: lineResult.error,
    });
  }

  console.info("[MISSING_PRODUCT_REQUEST] notification_completed", {
    requestId: emailPayload.requestId,
    emailNotifyMs,
    lineNotifyMs,
    totalMs: getElapsedMs(notificationStartedAt),
  });
}

export async function POST(req: NextRequest) {
  const requestStartedAt = Date.now();
  try {
    const body = (await req.json()) as Payload;
    const payload = normalizePayload(body);

    if (!hasProductIdentifier(payload)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please provide at least one of: part number, filter type, product details, or a measured dimension.",
        },
        { status: 400 }
      );
    }

    if (!hasContactMethod(payload)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide at least one contact method: phone, email, or LINE.",
        },
        { status: 400 }
      );
    }

    if (payload.qty < 1) {
      return NextResponse.json(
        { ok: false, error: "Quantity must be at least 1." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || null;
    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.ok) {
      return NextResponse.json(
        { ok: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const leadId = await resolveLeadIdForMissingProductRequest(payload);

    const requestId = buildRequestId();
    const storedNote = buildStoredNote(payload);
    const dimensionSummary = buildDimensionSummary(payload);

    const dbSaveStartedAt = Date.now();
    const createdRfq = await prisma.rfq.create({
      data: {
        requestId,
        source: "missing_product_request",
        status: "new",
        leadId,
        company: payload.company || null,
        name: payload.contactName || "Missing Product Request",
        email: payload.email ? normalizeEmail(payload.email) : null,
        phone: payload.phone || null,
        lineId: payload.lineId || null,
        note: storedNote || null,
        userAgent,
        items: {
          create: {
            partNo: payload.partNo || "MISSING-PRODUCT",
            brand: payload.brand || null,
            title: "Missing Product Request",
            category: payload.filterType || null,
            spec: dimensionSummary || null,
            qty: payload.qty,
            meta: {
              requestType: "missing_product_request",
              filterType: payload.filterType || null,
              machineApplication: payload.machineApplication || null,
              details: payload.note || null,
              searchQuery: payload.searchQuery || null,
              sourcePage: payload.sourcePage || null,
              locale: payload.locale || null,
              dimensions: {
                outerDiameter: payload.outerDiameter || null,
                innerDiameter: payload.innerDiameter || null,
                lengthHeight: payload.lengthHeight || null,
                threadSize: payload.threadSize || null,
                gasketOD: payload.gasketOD || null,
                gasketID: payload.gasketID || null,
              },
              contact: {
                contactName: payload.contactName || null,
                company: payload.company || null,
                phone: payload.phone || null,
                email: payload.email || null,
                lineId: payload.lineId || null,
              },
            },
          },
        },
        events: {
          create: {
            type: "created",
            payload: {
              source: "missing_product_request",
              hasPartNo: Boolean(payload.partNo),
            },
          },
        },
      },
      include: {
        items: true,
      },
    });
    const dbSaveMs = getElapsedMs(dbSaveStartedAt);

    const emailPayload = {
      requestId: createdRfq.requestId,
      customer: {
        name: payload.contactName || "Missing Product Request",
        company: payload.company || null,
        email: payload.email || null,
        phone: payload.phone || null,
        lineId: payload.lineId || null,
        note: storedNote || null,
        contactPref: null,
      },
      items: [
        {
          productId: "missing-product-request",
          partNo: payload.partNo || "MISSING-PRODUCT",
          brand: payload.brand || null,
          title: "Missing Product Request",
          qty: payload.qty,
          category: payload.filterType || null,
          spec: dimensionSummary || null,
          meta: {
            requestType: "missing_product_request",
            filterType: payload.filterType || null,
            machineApplication: payload.machineApplication || null,
            details: payload.note || null,
            searchQuery: payload.searchQuery || null,
            sourcePage: payload.sourcePage || null,
            locale: payload.locale || null,
            dimensions: {
              outerDiameter: payload.outerDiameter || null,
              innerDiameter: payload.innerDiameter || null,
              lengthHeight: payload.lengthHeight || null,
              threadSize: payload.threadSize || null,
              gasketOD: payload.gasketOD || null,
              gasketID: payload.gasketID || null,
            },
          },
        },
      ],
    };

    const notificationJob = {
      rfqId: createdRfq.id,
      emailPayload,
      customerEmail: payload.email || null,
      linePayload: {
        requestId: createdRfq.requestId,
        company: payload.company || null,
        name: payload.contactName || "Missing Product Request",
        phone: payload.phone || null,
        email: payload.email || null,
        lineId: payload.lineId || null,
        partNo: payload.partNo || "MISSING-PRODUCT",
        filterType: payload.filterType || null,
        brand: payload.brand || null,
        qty: payload.qty,
        machineApplication: payload.machineApplication || null,
        dimensionSummary: dimensionSummary || null,
        note: payload.note || null,
        searchQuery: payload.searchQuery || null,
        sourcePage: payload.sourcePage || null,
        locale: payload.locale || null,
      },
    };

    console.info("[MISSING_PRODUCT_REQUEST] response_ready", {
      requestId: createdRfq.requestId,
      dbSaveMs,
      totalMs: getElapsedMs(requestStartedAt),
      hasCustomerEmail: Boolean(payload.email),
      hasLineId: Boolean(payload.lineId),
      hasPhone: Boolean(payload.phone),
    });

    after(async () => {
      await runNotificationJobs(notificationJob);
    });

    return NextResponse.json({
      ok: true,
      requestId: createdRfq.requestId,
      savedAs: "rfq",
      source: "missing_product_request",
      customerEmailQueued: Boolean(payload.email),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit request";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
