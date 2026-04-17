import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const QuoteDocumentSchema = z.object({
  quoteDocumentUrl: z.string().trim().url().optional().or(z.literal("")),
  quoteSentAt: z.string().optional().or(z.literal("")),
  quoteSentNote: z.string().trim().max(5000).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteDocumentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid quote document payload." },
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
        { ok: false, error: "This RFQ cannot be updated." },
        { status: 400 }
      );
    }

    const quoteDocumentUrl = parsed.data.quoteDocumentUrl?.trim() || null;
    const quoteSentNote = parsed.data.quoteSentNote?.trim() || null;

    const quoteSentAt = parsed.data.quoteSentAt?.trim()
      ? new Date(parsed.data.quoteSentAt)
      : new Date();

    if (Number.isNaN(quoteSentAt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid quote sent date." },
        { status: 400 }
      );
    }

    const updated = await prisma.rfq.update({
      where: { id },
      data: {
        status: "quoted",
        quoteDocumentUrl,
        quoteSentAt,
        quoteSentNote,
      },
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId: id,
        type: "quote_document",
        payload: {
          quoteDocumentUrl,
          quoteSentAt: quoteSentAt.toISOString(),
          quoteSentNote,
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
    console.error("[ADMIN_RFQ_QUOTE_DOCUMENT_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save quote document.",
      },
      { status: 500 }
    );
  }
}