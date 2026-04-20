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

const QuoteWorkflowSchema = z.object({
  note: z.string().trim().max(5000).optional().or(z.literal("")),
  nextFollowUpAt: z.string().optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteWorkflowSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid quotation payload.",
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
        error: "This RFQ cannot be quoted.",
      });
    }

    const note = parsed.data.note?.trim() || "";
    const nextFollowUpAtRaw = parsed.data.nextFollowUpAt?.trim() || "";

    let followUpDueAt: Date | null = null;

    if (nextFollowUpAtRaw) {
      const dueAt = new Date(nextFollowUpAtRaw);

      if (Number.isNaN(dueAt.getTime())) {
        return errorJson({
          traceId,
          status: 400,
          error: "Invalid next follow-up date.",
        });
      }

      followUpDueAt = dueAt;
    }

    const operations: Promise<unknown>[] = [];

    operations.push(
      prisma.rfq.update({
        where: { id },
        data: {
          status: "quoted",
        },
      })
    );

    if (existing.status !== "quoted") {
      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "status_changed",
            payload: {
              from: existing.status,
              to: "quoted",
            },
          },
        })
      );
    }

    if (note) {
      operations.push(
        prisma.rfqNote.create({
          data: {
            rfqId: id,
            body: note,
          },
        })
      );

      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "note",
            payload: {
              body: note,
              source: "quotation_workflow",
            },
          },
        })
      );
    }

    if (followUpDueAt) {
      operations.push(
        prisma.followUp.create({
          data: {
            rfqId: id,
            dueAt: followUpDueAt,
            note: note || "Follow up after quotation",
          },
        })
      );

      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "follow_up",
            payload: {
              action: "created",
              dueAt: followUpDueAt.toISOString(),
              note: note || "Follow up after quotation",
              source: "quotation_workflow",
            },
          },
        })
      );
    }

    const result = await prisma.$transaction(operations);
    const sideEffectFailures: string[] = [];

    try {
      revalidatePath(`/admin/rfq/${id}`);
      revalidatePath("/admin/rfq");
    } catch (error) {
      sideEffectFailures.push("revalidate_admin_rfq");
      logApiEvent("error", "admin.rfq.quote_workflow.revalidate_failed", {
        traceId,
        route: "/api/admin/rfq/[id]/quote",
        rfqId: id,
        error: getErrorMessage(error, "Failed to revalidate admin quote pages."),
      });
    }

    logApiEvent("info", "admin.rfq.quote_workflow.completed", {
      traceId,
      route: "/api/admin/rfq/[id]/quote",
      rfqId: id,
      previousStatus: existing.status,
      noteAdded: Boolean(note),
      nextFollowUpAt: followUpDueAt?.toISOString() ?? null,
      partialFailure: sideEffectFailures.length > 0,
      sideEffectFailures,
    });

    return jsonWithTrace(
      {
        ok: true,
        result,
        partialFailure: sideEffectFailures.length > 0,
        sideEffectFailures,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.quote_workflow.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/quote",
      error: getErrorMessage(error, "Failed to process quotation workflow."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: getErrorMessage(error, "Failed to process quotation workflow."),
    });
  }
}
