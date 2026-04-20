import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  errorJson,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

const StatusSchema = z.object({
  status: z.enum(["new", "in_progress", "quoted", "closed", "spam"]),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = StatusSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid status payload.",
      });
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      return errorJson({
        traceId,
        status: 404,
        error: "RFQ not found.",
      });
    }

    const nextStatus = parsed.data.status;

    const updated = await prisma.rfq.update({
      where: { id },
      data: {
        status: nextStatus,
      },
      select: {
        id: true,
        requestId: true,
        status: true,
        updatedAt: true,
      },
    });

    if (existing.status !== nextStatus) {
      await prisma.rfqEvent.create({
        data: {
          rfqId: id,
          type: "status_changed",
        },
      });
    }

    logApiEvent("info", "admin.rfq.status.updated", {
      traceId,
      route: "/api/admin/rfq/[id]/status",
      rfqId: id,
      from: existing.status,
      to: nextStatus,
      requestId: updated.requestId,
    });

    return jsonWithTrace(
      {
        ok: true,
        rfq: updated,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.status.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/status",
      error: getErrorMessage(error, "Failed to update status."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to update status.",
    });
  }
}
