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

const AssignSchema = z.object({
  assignedTo: z.string().trim().max(100).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = AssignSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid assignment payload.",
      });
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        assignedTo: true,
      },
    });

    if (!existing) {
      return errorJson({
        traceId,
        status: 404,
        error: "RFQ not found.",
      });
    }

    const assignedTo = parsed.data.assignedTo?.trim() || null;
    const assignedAt = assignedTo ? new Date() : null;

    const updated = await prisma.rfq.update({
      where: { id },
      data: {
        assignedTo,
        assignedAt,
      },
    });

    if (existing.assignedTo !== assignedTo) {
      await prisma.rfqEvent.create({
        data: {
          rfqId: id,
          type: "owner_assigned",
          payload: {
            from: existing.assignedTo,
            to: assignedTo,
            assignedAt: assignedAt ? assignedAt.toISOString() : null,
          },
        },
      });
    }

    revalidatePath(`/admin/rfq/${id}`);
    revalidatePath("/admin/rfq");

    logApiEvent("info", "admin.rfq.assign.updated", {
      traceId,
      route: "/api/admin/rfq/[id]/assign",
      rfqId: id,
      from: existing.assignedTo,
      to: assignedTo,
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
    logApiEvent("error", "admin.rfq.assign.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/assign",
      error: getErrorMessage(error, "Failed to assign owner."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: getErrorMessage(error, "Failed to assign owner."),
    });
  }
}
