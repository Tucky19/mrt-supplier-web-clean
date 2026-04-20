import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  errorJson,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

const QuoteDocumentSchema = z.object({
  quoteDocumentUrl: z.string().trim().url().optional().or(z.literal("")),
  quoteSentAt: z.string().optional().or(z.literal("")),
  quoteSentNote: z.string().trim().max(5000).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteDocumentSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid quote document payload.",
      });
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return errorJson({
        traceId,
        status: 404,
        error: "RFQ not found.",
      });
    }

    if (existing.status === "closed" || existing.status === "spam") {
      return errorJson({
        traceId,
        status: 400,
        error: "This RFQ cannot be updated.",
      });
    }

    const quoteDocumentUrl = parsed.data.quoteDocumentUrl?.trim() || null;
    const quoteSentNote = parsed.data.quoteSentNote?.trim() || null;

    const quoteSentAt = parsed.data.quoteSentAt?.trim()
      ? new Date(parsed.data.quoteSentAt)
      : new Date();

    if (Number.isNaN(quoteSentAt.getTime())) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid quote sent date.",
      });
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
    const sideEffectFailures: string[] = [];

    try {
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
    } catch (error) {
      sideEffectFailures.push("event_quote_document");
      logApiEvent("error", "admin.rfq.quote_document.side_effect_failed", {
        traceId,
        route: "/api/admin/rfq/[id]/quote-document",
        rfqId: id,
        sideEffect: "event_quote_document",
        error: getErrorMessage(error, "Quote document side effect failed."),
      });
    }

    try {
      revalidatePath(`/admin/rfq/${id}`);
      revalidatePath("/admin/rfq");
    } catch (error) {
      sideEffectFailures.push("revalidate_admin_rfq");
      logApiEvent("error", "admin.rfq.quote_document.revalidate_failed", {
        traceId,
        route: "/api/admin/rfq/[id]/quote-document",
        rfqId: id,
        error: getErrorMessage(error, "Failed to revalidate quote document pages."),
      });
    }

    logApiEvent("info", "admin.rfq.quote_document.saved", {
      traceId,
      route: "/api/admin/rfq/[id]/quote-document",
      rfqId: id,
      hasDocumentUrl: Boolean(quoteDocumentUrl),
      quoteSentAt: quoteSentAt.toISOString(),
      partialFailure: sideEffectFailures.length > 0,
      sideEffectFailures,
    });

    return jsonWithTrace(
      {
        ok: true,
        rfq: updated,
        partialFailure: sideEffectFailures.length > 0,
        sideEffectFailures,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.quote_document.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/quote-document",
      error: getErrorMessage(error, "Failed to save quote document."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: getErrorMessage(error, "Failed to save quote document."),
    });
  }
}
