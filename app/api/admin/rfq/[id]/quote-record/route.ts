import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const QuoteRecordSchema = z.object({
  quoteRef: z.string().trim().max(100).optional().or(z.literal("")),
  quotedBy: z.string().trim().max(100).optional().or(z.literal("")),
  quoteAmount: z.string().trim().optional().or(z.literal("")),
  quoteCurrency: z.string().trim().max(10).optional().or(z.literal("")),
  validUntil: z.string().optional().or(z.literal("")),
  quotedAt: z.string().optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteRecordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid quote record payload." },
        { status: 400 }
      );
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "RFQ not found." },
        { status: 404 }
      );
    }

    if (existing.status === "closed" || existing.status === "spam") {
      return NextResponse.json(
        { ok: false, error: "This RFQ cannot be updated as quoted." },
        { status: 400 }
      );
    }

    const quoteRef = parsed.data.quoteRef?.trim() || null;
    const quotedBy = parsed.data.quotedBy?.trim() || null;
    const quoteCurrency = parsed.data.quoteCurrency?.trim() || null;

    const quotedAt = parsed.data.quotedAt?.trim()
      ? new Date(parsed.data.quotedAt)
      : new Date();

    if (Number.isNaN(quotedAt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid quoted date." },
        { status: 400 }
      );
    }

    const validUntil = parsed.data.validUntil?.trim()
      ? new Date(parsed.data.validUntil)
      : null;

    if (validUntil && Number.isNaN(validUntil.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid valid-until date." },
        { status: 400 }
      );
    }

    let quoteAmount: number | null = null;
    const rawAmount = parsed.data.quoteAmount?.trim() || "";

    if (rawAmount) {
      const normalized = rawAmount.replace(/,/g, "");
      const amountNumber = Number(normalized);

      if (!Number.isFinite(amountNumber) || amountNumber < 0) {
        return NextResponse.json(
          { ok: false, error: "Invalid quote amount." },
          { status: 400 }
        );
      }

      quoteAmount = amountNumber;
    }

    const updated = await prisma.rfq.update({
      where: { id },
      data: {
        status: "quoted",
        quotedAt,
        quoteRef,
        quotedBy,
        quoteAmount,
        quoteCurrency,
        validUntil,
      },
    });

    if (existing.status !== "quoted") {
      await prisma.rfqEvent.create({
        data: {
          rfqId: id,
          type: "status_changed",
          payload: {
            from: existing.status,
            to: "quoted",
            source: "quote_record_v1",
          },
        },
      });
    }

    await prisma.rfqEvent.create({
      data: {
        rfqId: id,
        type: "quote_record",
        payload: {
          quoteRef,
          quotedBy,
          quoteAmount: quoteAmount !== null ? String(quoteAmount) : null,
          quoteCurrency,
          quotedAt: quotedAt.toISOString(),
          validUntil: validUntil ? validUntil.toISOString() : null,
        },
      },
    });

    revalidatePath(`/admin/rfq/${id}`);
    revalidatePath("/admin/rfq");

    return NextResponse.json({
      ok: true,
      rfq: updated,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_QUOTE_RECORD_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save quote record.",
      },
      { status: 500 }
    );
  }
}