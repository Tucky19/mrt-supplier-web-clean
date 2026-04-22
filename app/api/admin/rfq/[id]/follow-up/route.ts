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

const FollowUpSchema = z.object({
  dueAt: z.string().min(1, "Due date is required"),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = FollowUpSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid follow-up payload.",
      });
    }

    const rfq = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!rfq) {
      return errorJson({
        traceId,
        status: 404,
        error: "RFQ not found.",
      });
    }

    const dueAt = new Date(parsed.data.dueAt);

    if (Number.isNaN(dueAt.getTime())) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid due date.",
      });
    }

    const noteValue = parsed.data.note?.trim() || null;

    const followUp = await prisma.followUp.create({
      data: {
        rfqId: id,
        dueAt,
        note: noteValue,
      },
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId: id,
        type: "follow_up",
        payload: {
          action: "created",
          followUpId: followUp.id,
          dueAt: followUp.dueAt.toISOString(),
          note: followUp.note,
        },
      },
    });

    revalidatePath(`/admin/rfq/${id}`);
    revalidatePath("/admin/rfq");

    logApiEvent("info", "admin.rfq.follow_up.created", {
      traceId,
      route: "/api/admin/rfq/[id]/follow-up",
      rfqId: id,
      followUpId: followUp.id,
      dueAt: followUp.dueAt.toISOString(),
    });

    return jsonWithTrace(
      {
        ok: true,
        followUp,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.follow_up.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/follow-up",
      error: getErrorMessage(error, "Failed to create follow-up."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to create follow-up.",
    });
  }
}
