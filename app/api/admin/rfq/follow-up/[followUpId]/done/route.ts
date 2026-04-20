import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  errorJson,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

type RouteProps = {
  params: Promise<{ followUpId: string }>;
};

export async function POST(_req: Request, { params }: RouteProps) {
  const traceId = getTraceId(_req);

  try {
    const { followUpId } = await params;

    const existing = await prisma.followUp.findUnique({
      where: { id: followUpId },
      select: {
        id: true,
        rfqId: true,
        doneAt: true,
      },
    });

    if (!existing) {
      return errorJson({
        traceId,
        status: 404,
        error: "Follow-up not found.",
      });
    }

    if (!existing.doneAt) {
      await prisma.followUp.update({
        where: { id: followUpId },
        data: {
          doneAt: new Date(),
        },
      });

      await prisma.rfqEvent.create({
        data: {
          rfqId: existing.rfqId,
          type: "follow_up",
          payload: {
            action: "done",
            followUpId: followUpId,
            doneAt: new Date().toISOString(),
          },
        },
      });
    }

    revalidatePath(`/admin/rfq/${existing.rfqId}`);
    revalidatePath("/admin/rfq");

    logApiEvent("info", "admin.rfq.follow_up.done", {
      traceId,
      route: "/api/admin/rfq/follow-up/[followUpId]/done",
      followUpId,
      rfqId: existing.rfqId,
      alreadyDone: Boolean(existing.doneAt),
    });

    return jsonWithTrace(
      {
        ok: true,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.follow_up.done_failed", {
      traceId,
      route: "/api/admin/rfq/follow-up/[followUpId]/done",
      error: getErrorMessage(error, "Failed to mark follow-up as done."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to mark follow-up as done.",
    });
  }
}
