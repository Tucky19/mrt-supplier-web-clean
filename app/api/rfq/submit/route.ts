import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { genRequestId } from "@/lib/rfq/id";
import { validateRfqPayload } from "@/lib/rfq/validate";
import { logRfqEvent } from "@/lib/rfq/events";
import { consumeRfqRateLimit } from "@/lib/rfq/rateLimit";
import {
  sendAdminRfqEmail,
  sendCustomerRfqConfirmationEmail,
} from "@/lib/mail";

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
  try {
    const body = await req.json();

    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get("user-agent") || undefined;

    // 0) Honeypot
    const hpField = process.env.RFQ_HONEYPOT_FIELD || "website";
    const hpValue = String(body?.customer?.[hpField] ?? "").trim();
    if (hpValue) {
      return NextResponse.json({ ok: true, requestId: "OK" });
    }

    // 1) Rate limit
    const rl = await consumeRfqRateLimit({ ipHash });
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `ส่งคำขอถี่เกินไป (limit ${rl.limit}/window) กรุณารอแล้วลองใหม่`,
          retryAfterSec: rl.retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        }
      );
    }

    // 2) Validate payload
    const v = validateRfqPayload(body);
    if (!v.ok) {
      return NextResponse.json(
        { ok: false, error: v.error },
        { status: 400 }
      );
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
        return NextResponse.json({
          ok: true,
          requestId: last.requestId,
          rfqId: last.id,
          deduped: true,
        });
      }
    }

    // 4) Save DB
    const requestId = genRequestId();

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

    await logRfqEvent(rfq.id, "created", { requestId: rfq.requestId });

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
      await logRfqEvent(rfq.id, "emailed_admin", {
        to: process.env.EMAIL_TO_ADMIN,
      });
    } catch (e: any) {
      await logRfqEvent(rfq.id, "email_failed", {
        target: "admin",
        message: String(e?.message ?? e),
      });
    }

    // 6) Email customer
    if (rfq.email) {
      try {
        await sendCustomerRfqConfirmationEmail({
          requestId: rfq.requestId,
          customer: mailCustomer,
          items: mailItems,
        });

        await logRfqEvent(rfq.id, "emailed_customer", {
          to: rfq.email,
        });
      } catch (e: any) {
        await logRfqEvent(rfq.id, "email_failed", {
          target: "customer",
          message: String(e?.message ?? e),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      requestId: rfq.requestId,
      rfqId: rfq.id,
      adminEmailOk,
      remainingInWindow: rl.remaining,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}