import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  sendAdminRfqEmail,
  sendCustomerRfqConfirmationEmail,
  type EmailRfqItem,
} from "@/lib/email/sendRfqEmails";

export const dynamic = "force-dynamic";

type SubmitItem = {
  productId?: string;
  partNo?: string;
  brand?: string;
  title?: string;
  category?: string;
  spec?: string;
  qty?: number;
};

type SubmitCustomer = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  lineId?: string;
  note?: string;
  contactPref?: string;
};

type SubmitPayload = {
  customer?: SubmitCustomer;
  items?: SubmitItem[];
};

type CreatedRfqItem = {
  partNo: string;
  brand: string | null;
  title: string | null;
  qty: number;
  category: string | null;
  spec: string | null;
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
  return `RFQ-${y}${m}${d}-${rand}`;
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
    return {
      ok: false as const,
      error: `ส่งคำขอถี่เกินไป (limit ${limit}/window) กรุณารอแล้วลองใหม่`,
    };
  }

  await prisma.rfqRateLimit.update({
    where: { id: record.id },
    data: {
      count: { increment: 1 },
    },
  });

  return { ok: true as const };
}

async function runEmailJobs(params: {
  rfqId: string;
  emailPayload: {
    requestId: string;
    createdAt: Date;
    customer: {
      name: string;
      company: string | null;
      email: string | null;
      phone: string | null;
      lineId: string | null;
      note: string | null;
      contactPref: string | null;
    };
    items: EmailRfqItem[];
  };
  customerEmail: string | null;
}) {
  const { rfqId, emailPayload, customerEmail } = params;

  try {
    await sendAdminRfqEmail(emailPayload);

    await prisma.rfqEvent.create({
      data: {
        rfqId,
        type: "emailed_admin",
        payload: {
          to: process.env.RFQ_TO_EMAIL || null,
          cc: process.env.RFQ_CC_EMAIL || null,
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin email failed";

    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type: "email_failed",
          payload: {
            step: "admin",
            error: message,
          },
        },
      });
    } catch {
      // intentionally ignored
    }
  }

  if (!customerEmail) return;

  try {
    await sendCustomerRfqConfirmationEmail(emailPayload);

    await prisma.rfqEvent.create({
      data: {
        rfqId,
        type: "emailed_customer",
        payload: {
          to: normalizeEmail(customerEmail),
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Customer email failed";

    try {
      await prisma.rfqEvent.create({
        data: {
          rfqId,
          type: "email_failed",
          payload: {
            step: "customer",
            error: message,
          },
        },
      });
    } catch {
      // intentionally ignored
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitPayload;

    const customer = body.customer;
    const items = Array.isArray(body.items) ? body.items : [];

    const name = safeStr(customer?.name);
    const company = safeStr(customer?.company);
    const email = safeStr(customer?.email);
    const phone = safeStr(customer?.phone);
    const lineId = safeStr(customer?.lineId);
    const note = safeStr(customer?.note);
    const contactPref = safeStr(customer?.contactPref);

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "กรุณากรอกชื่อผู้ติดต่อ" },
        { status: 400 }
      );
    }

    if (!email && !phone && !lineId) {
      return NextResponse.json(
        { ok: false, error: "กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่อง" },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { ok: false, error: "กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ" },
        { status: 400 }
      );
    }

    const normalizedItems = items
      .map((item: SubmitItem) => ({
        productId: safeStr(item.productId) || null,
        partNo: safeStr(item.partNo),
        brand: safeStr(item.brand) || null,
        title: safeStr(item.title) || null,
        category: safeStr(item.category) || null,
        spec: safeStr(item.spec) || null,
        qty: Math.max(1, Number(item.qty || 1)),
      }))
      .filter((item) => item.partNo);

    if (!normalizedItems.length) {
      return NextResponse.json(
        { ok: false, error: "รายการสินค้าไม่ถูกต้อง" },
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

    if (email || phone || lineId) {
      const leadWhere = [
        email ? { email: normalizeEmail(email) } : null,
        phone ? { phone } : null,
        lineId ? { lineId } : null,
      ].filter(Boolean) as Array<
        | { email: string }
        | { phone: string }
        | { lineId: string }
      >;

      const existingLead =
        leadWhere.length > 0
          ? await prisma.lead.findFirst({
              where: {
                OR: leadWhere,
              },
            })
          : null;

      if (existingLead) {
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            name: name || existingLead.name,
            company: company || existingLead.company,
            email: email ? normalizeEmail(email) : existingLead.email,
            phone: phone || existingLead.phone,
            lineId: lineId || existingLead.lineId,
            note: note || existingLead.note,
          },
        });
        leadId = updatedLead.id;
      } else {
        const createdLead = await prisma.lead.create({
          data: {
            name,
            company: company || null,
            email: email ? normalizeEmail(email) : null,
            phone: phone || null,
            lineId: lineId || null,
            note: note || null,
          },
        });
        leadId = createdLead.id;
      }
    }

    const requestId = buildRequestId();

    const createdRfq = await prisma.rfq.create({
      data: {
        requestId,
        status: "new",
        source: "website",
        leadId,
        company: company || null,
        name,
        email: email ? normalizeEmail(email) : null,
        phone: phone || null,
        lineId: lineId || null,
        note: note || null,
        contactPref: contactPref || null,
        userAgent,
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.productId ?? "",
            partNo: item.partNo,
            brand: item.brand,
            category: item.category,
            title: item.title,
            spec: item.spec,
            qty: item.qty,
          })),
        },
        events: {
          create: {
            type: "created",
            payload: {
              source: "website",
              itemCount: normalizedItems.length,
            },
          },
        },
      },
      include: {
        items: true,
      },
    });

    const rfqItems = createdRfq.items as CreatedRfqItem[];

    const emailPayload = {
      requestId: createdRfq.requestId,
      createdAt: createdRfq.createdAt,
      customer: {
        name,
        company: company || null,
        email: email || null,
        phone: phone || null,
        lineId: lineId || null,
        note: note || null,
        contactPref: contactPref || null,
      },
      items: rfqItems.map(
        (item: CreatedRfqItem): EmailRfqItem => ({
          partNo: item.partNo,
          brand: item.brand,
          title: item.title,
          qty: item.qty,
          category: item.category,
          spec: item.spec,
        })
      ),
    };

    void runEmailJobs({
      rfqId: createdRfq.id,
      emailPayload,
      customerEmail: email || null,
    });

    return NextResponse.json({
      ok: true,
      requestId: createdRfq.requestId,
      adminEmailQueued: true,
      customerEmailQueued: Boolean(email),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit RFQ";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
