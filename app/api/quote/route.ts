import { randomUUID, createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

const QuoteItemSchema = z.object({
  productId: z.string().trim().min(1).max(200),
  partNo: z.string().trim().min(1).max(200),
  brand: z.string().trim().max(200).optional().default(""),
  category: z.string().trim().max(200).optional().default(""),
  title: z.string().trim().max(500).optional().default(""),
  spec: z.string().trim().max(1000).optional().default(""),
  qty: z.number().int().min(1).max(999),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const QuoteSchema = z
  .object({
    locale: z.string().default("th"),
    company: z.string().trim().max(200).optional().default(""),
    name: z.string().trim().min(1).max(200),
    phone: z.string().trim().max(100).optional().default(""),
    email: z.string().trim().email().optional().or(z.literal("")).default(""),
    lineId: z.string().trim().max(100).optional().default(""),
    note: z.string().trim().max(5000).optional().default(""),
    contactPref: z.string().trim().max(50).optional().default(""),
    source: z.string().trim().max(50).optional().default("web"),
    items: z.array(QuoteItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (!data.phone && !data.email && !data.lineId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one contact method is required.",
        path: ["phone"],
      });
    }
  });

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "";
}

function hashIp(ip: string): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}

function getUserAgent(req: Request): string | null {
  return req.headers.get("user-agent")?.trim() || null;
}

function buildMailBody(input: z.infer<typeof QuoteSchema>, requestId: string) {
  const itemLines = input.items.flatMap((item, index) => [
    `${index + 1}. ${item.partNo}`,
    `   Product ID: ${item.productId}`,
    `   Brand: ${item.brand || "-"}`,
    `   Category: ${item.category || "-"}`,
    `   Title: ${item.title || "-"}`,
    `   Spec: ${item.spec || "-"}`,
    `   Quantity: ${item.qty}`,
  ]);

  return [
    `Request ID: ${requestId}`,
    `Locale: ${input.locale}`,
    `Source: ${input.source || "web"}`,
    `Company: ${input.company || "-"}`,
    `Contact Name: ${input.name}`,
    `Phone: ${input.phone || "-"}`,
    `Email: ${input.email || "-"}`,
    `LINE ID: ${input.lineId || "-"}`,
    `Contact Preference: ${input.contactPref || "-"}`,
    "",
    "Requested Items:",
    ...itemLines,
    "",
    "Additional Notes:",
    input.note || "-",
  ].join("\n");
}

async function trySendEmail(
  input: z.infer<typeof QuoteSchema>,
  requestId: string
) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "true") === "true";
  const to = process.env.RFQ_TO_EMAIL || "rfq01@mrtsupplier.com";
  const from = process.env.RFQ_FROM_EMAIL || user || "rfq01@mrtsupplier.com";

  if (!host || !user || !pass) {
    console.log("[QUOTE_API_NO_SMTP]", {
      requestId,
      payload: input,
    });
    return { emailed: false as const, reason: "smtp_not_configured" as const };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject: `[RFQ] ${input.name} | ${input.company || "No Company"} | ${requestId}`,
      text: buildMailBody(input, requestId),
      replyTo: input.email || undefined,
    });

    return { emailed: true as const };
  } catch (error) {
    console.error("[QUOTE_EMAIL_ERROR]", error);
    return { emailed: false as const, reason: "smtp_send_failed" as const };
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = QuoteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message || "Invalid request payload.",
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const requestId = `RFQ-${randomUUID().slice(0, 8).toUpperCase()}`;

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);
    const userAgent = getUserAgent(req);

    const created = await prisma.rfq.create({
      data: {
        requestId,
        company: input.company || null,
        name: input.name || null,
        phone: input.phone || null,
        email: input.email || null,
        lineId: input.lineId || null,
        note: input.note || null,
        contactPref: input.contactPref || null,
        ipHash,
        userAgent,
        source: input.source || "web",
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            partNo: item.partNo,
            brand: item.brand || null,
            category: item.category || null,
            title: item.title || null,
            spec: item.spec || null,
            qty: item.qty,
            meta: item.meta ?? undefined,
          })),
        },
        events: {
          create: {
            type: "created",
          },
        },
      },
      include: {
        items: true,
      },
    });

    const emailResult = await trySendEmail(input, requestId);

    if (emailResult.emailed) {
      await prisma.rfqEvent.create({
        data: {
          rfqId: created.id,
          type: "emailed_admin",
        },
      });
    } else {
      await prisma.rfqEvent.create({
        data: {
          rfqId: created.id,
          type: "email_failed",
        },
      });
    }

    console.log("[QUOTE_REQUEST_ACCEPTED]", {
      requestId,
      rfqId: created.id,
      emailed: emailResult.emailed,
      items: created.items.length,
    });

    return NextResponse.json({
      ok: true,
      requestId,
      rfqId: created.id,
      emailed: emailResult.emailed,
    });
  } catch (error) {
    console.error("[QUOTE_API_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to submit request.",
      },
      { status: 500 }
    );
  }
}