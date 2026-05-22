import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRfqLineNotification } from "@/lib/line/sendRfqLineNotification";
import {
  sendAdminRfqEmail,
  sendCustomerRfqConfirmationEmail,
} from "@/lib/mail";

export const dynamic = "force-dynamic";

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
  const envStatus = getNotificationEnvStatus();

  console.info("[MISSING_PRODUCT_REQUEST] notification_env", envStatus);

  try {
    await sendAdminRfqEmail(emailPayload);
    console.info("[MISSING_PRODUCT_REQUEST] admin_email", {
      requestId: emailPayload.requestId,
      success: true,
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId,
        type: "emailed_admin",
        payload: {
          requestType: "missing_product_request",
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin email failed";
    console.error("[MISSING_PRODUCT_REQUEST] admin_email", {
      requestId: emailPayload.requestId,
      success: false,
      error: message,
    });

    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type: "email_failed",
          payload: {
            step: "admin",
            requestType: "missing_product_request",
            error: message,
          },
        },
      });
    } catch {}
  }

  if (!customerEmail) return;

  try {
    await sendCustomerRfqConfirmationEmail(emailPayload);
    console.info("[MISSING_PRODUCT_REQUEST] customer_email", {
      requestId: emailPayload.requestId,
      success: true,
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId,
        type: "emailed_customer",
        payload: {
          requestType: "missing_product_request",
          to: normalizeEmail(customerEmail),
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Customer email failed";
    console.error("[MISSING_PRODUCT_REQUEST] customer_email", {
      requestId: emailPayload.requestId,
      success: false,
      error: message,
    });

    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type: "email_failed",
          payload: {
            step: "customer",
            requestType: "missing_product_request",
            error: message,
          },
        },
      });
      } catch {}
  }

  try {
    await sendRfqLineNotification({
      requestId: linePayload.requestId,
      company: linePayload.company,
      name: linePayload.name,
      phone: linePayload.phone,
      email: linePayload.email,
      itemCount: 1,
      extraLines: [
        `Part No: ${linePayload.partNo}`,
        `Filter Type: ${linePayload.filterType || "-"}`,
        `Brand: ${linePayload.brand || "-"}`,
        `Qty: ${linePayload.qty}`,
        `Machine/Application: ${linePayload.machineApplication || "-"}`,
        `Dimensions: ${linePayload.dimensionSummary || "-"}`,
        `LINE ID: ${linePayload.lineId || "-"}`,
        `Note: ${linePayload.note || "-"}`,
        `Search Query: ${linePayload.searchQuery || "-"}`,
        `Source Page: ${linePayload.sourcePage || "-"}`,
        `Locale: ${linePayload.locale || "-"}`,
      ],
    });

    console.info("[MISSING_PRODUCT_REQUEST] line_notify", {
      requestId: linePayload.requestId,
      success: true,
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId,
        type: "line_sent",
        payload: {
          requestType: "missing_product_request",
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LINE notification failed";
    console.error("[MISSING_PRODUCT_REQUEST] line_notify", {
      requestId: linePayload.requestId,
      success: false,
      error: message,
    });

    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type: "line_failed",
          payload: {
            requestType: "missing_product_request",
            error: message,
          },
        },
      });
    } catch {}
  }
}

export async function POST(req: NextRequest) {
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

    let leadId: string | null = null;

    const leadWhere = [
      payload.email ? { email: normalizeEmail(payload.email) } : null,
      payload.phone ? { phone: payload.phone } : null,
      payload.lineId ? { lineId: payload.lineId } : null,
    ].filter(Boolean) as Array<
      | { email: string }
      | { phone: string }
      | { lineId: string }
    >;

    if (leadWhere.length > 0) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: leadWhere,
        },
      });

      if (existingLead) {
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            name: payload.contactName || existingLead.name,
            company: payload.company || existingLead.company,
            email: payload.email ? normalizeEmail(payload.email) : existingLead.email,
            phone: payload.phone || existingLead.phone,
            lineId: payload.lineId || existingLead.lineId,
            note: payload.note || existingLead.note,
          },
        });
        leadId = updatedLead.id;
      } else {
        const createdLead = await prisma.lead.create({
          data: {
            name: payload.contactName || null,
            company: payload.company || null,
            email: payload.email ? normalizeEmail(payload.email) : null,
            phone: payload.phone || null,
            lineId: payload.lineId || null,
            note: payload.note || null,
          },
        });
        leadId = createdLead.id;
      }
    }

    const requestId = buildRequestId();
    const storedNote = buildStoredNote(payload);
    const dimensionSummary = buildDimensionSummary(payload);

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
        },
      ],
    };

    void runNotificationJobs({
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
