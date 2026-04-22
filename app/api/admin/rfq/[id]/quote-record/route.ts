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

export const dynamic = "force-dynamic";

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
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteRecordSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid quote record payload.",
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
        error: "This RFQ cannot be updated as quoted.",
      });
    }

    const quoteRef = parsed.data.quoteRef?.trim() || null;
    const quotedBy = parsed.data.quotedBy?.trim() || null;
    const quoteCurrency = parsed.data.quoteCurrency?.trim() || null;

    const quotedAt = parsed.data.quotedAt?.trim()
      ? new Date(parsed.data.quotedAt)
      : new Date();

    if (Number.isNaN(quotedAt.getTime())) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid quoted date.",
      });
    }

    const validUntil = parsed.data.validUntil?.trim()
      ? new Date(parsed.data.validUntil)
      : null;

    if (validUntil && Number.isNaN(validUntil.getTime())) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid valid-until date.",
      });
    }

    let quoteAmount: number | null = null;
    const rawAmount = parsed.data.quoteAmount?.trim() || "";

    if (rawAmount) {
      const normalized = rawAmount.replace(/,/g, "");
      const amountNumber = Number(normalized);

      if (!Number.isFinite(amountNumber) || amountNumber < 0) {
        return errorJson({
          traceId,
          status: 400,
          error: "Invalid quote amount.",
        });
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
    const sideEffectFailures: string[] = [];

    const recordSideEffectFailure = (name: string, error: unknown) => {
      sideEffectFailures.push(name);
      logApiEvent("error", "admin.rfq.quote_record.side_effect_failed", {
        traceId,
        route: "/api/admin/rfq/[id]/quote-record",
        rfqId: id,
        sideEffect: name,
        error: getErrorMessage(error, "Quote record side effect failed."),
      });
    };

    if (existing.status !== "quoted") {
      try {
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
      } catch (error) {
        recordSideEffectFailure("event_status_changed", error);
      }
    }

    try {
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
    } catch (error) {
      recordSideEffectFailure("event_quote_record", error);
    }

    try {
      revalidatePath(`/admin/rfq/${id}`);
      revalidatePath("/admin/rfq");
    } catch (error) {
      sideEffectFailures.push("revalidate_admin_rfq");
      logApiEvent("error", "admin.rfq.quote_record.revalidate_failed", {
        traceId,
        route: "/api/admin/rfq/[id]/quote-record",
        rfqId: id,
        error: getErrorMessage(error, "Failed to revalidate quote record pages."),
      });
    }

    logApiEvent("info", "admin.rfq.quote_record.saved", {
      traceId,
      route: "/api/admin/rfq/[id]/quote-record",
      rfqId: id,
      previousStatus: existing.status,
      quoteRef,
      quotedBy,
      hasQuoteAmount: quoteAmount !== null,
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
    logApiEvent("error", "admin.rfq.quote_record.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/quote-record",
      error: getErrorMessage(error, "Failed to save quote record."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: getErrorMessage(error, "Failed to save quote record."),
    });
  }
}
