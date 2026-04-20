import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  errorJson,
  getErrorMessage,
  getTraceId,
  jsonWithTrace,
  logApiEvent,
} from "@/lib/api/observability";

const ALLOWED = ["new", "in_progress", "quoted", "closed", "spam"] as const;
type AllowedStatus = (typeof ALLOWED)[number];

function isAllowedStatus(value: string): value is AllowedStatus {
  return ALLOWED.includes(value as AllowedStatus);
}

export async function POST(req: Request) {
  const traceId = getTraceId(req);

  try {
    const json = (await req.json().catch(() => null)) as
      | {
          ids?: string[];
          nextStatus?: string;
        }
      | null;

    const ids = Array.isArray(json?.ids)
      ? json.ids.filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0
        )
      : [];

    const nextStatus =
      typeof json?.nextStatus === "string" ? json.nextStatus : "";

    if (ids.length === 0) {
      return errorJson({
        traceId,
        status: 400,
        error: "No RFQs selected.",
      });
    }

    if (!isAllowedStatus(nextStatus)) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid target status.",
      });
    }

    const existing = await prisma.rfq.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existing.length === 0) {
      return errorJson({
        traceId,
        status: 404,
        error: "No matching RFQs found.",
      });
    }

    const toUpdate = existing.filter(
      (rfq: (typeof existing)[number]) => rfq.status !== nextStatus
    );

    if (toUpdate.length === 0) {
      logApiEvent("info", "admin.rfq.bulk_status.noop", {
        traceId,
        route: "/api/admin/rfq/bulk-status",
        nextStatus,
        requestedCount: ids.length,
      });

      return jsonWithTrace(
        {
          ok: true,
          updatedCount: 0,
        },
        undefined,
        traceId
      );
    }

    await prisma.$transaction([
      prisma.rfq.updateMany({
        where: {
          id: {
            in: toUpdate.map((row: (typeof toUpdate)[number]) => row.id),
          },
        },
        data: {
          status: nextStatus,
        },
      }),
      ...toUpdate.map((row: (typeof toUpdate)[number]) =>
        prisma.rfqEvent.create({
          data: {
            rfqId: row.id,
            type: "status_changed",
            payload: {
              from: row.status,
              to: nextStatus,
              source: "bulk_actions_v1",
            },
          },
        })
      ),
    ]);

    revalidatePath("/admin/rfq");

    for (const row of toUpdate) {
      revalidatePath(`/admin/rfq/${row.id}`);
    }

    logApiEvent("info", "admin.rfq.bulk_status.updated", {
      traceId,
      route: "/api/admin/rfq/bulk-status",
      nextStatus,
      requestedCount: ids.length,
      updatedCount: toUpdate.length,
      rfqIds: toUpdate.map((row: (typeof toUpdate)[number]) => row.id),
    });

    return jsonWithTrace(
      {
        ok: true,
        updatedCount: toUpdate.length,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.bulk_status.failed", {
      traceId,
      route: "/api/admin/rfq/bulk-status",
      error: getErrorMessage(error, "Failed to update selected RFQs."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to update selected RFQs.",
    });
  }
}
