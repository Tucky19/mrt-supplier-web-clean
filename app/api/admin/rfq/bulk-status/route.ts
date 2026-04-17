import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const ALLOWED = ["new", "in_progress", "quoted", "closed", "spam"] as const;
type AllowedStatus = (typeof ALLOWED)[number];

function isAllowedStatus(value: string): value is AllowedStatus {
  return ALLOWED.includes(value as AllowedStatus);
}

export async function POST(req: Request) {
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
      return NextResponse.json(
        { ok: false, error: "No RFQs selected." },
        { status: 400 }
      );
    }

    if (!isAllowedStatus(nextStatus)) {
      return NextResponse.json(
        { ok: false, error: "Invalid target status." },
        { status: 400 }
      );
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
      return NextResponse.json(
        { ok: false, error: "No matching RFQs found." },
        { status: 404 }
      );
    }

    const toUpdate = existing.filter(
      (rfq: (typeof existing)[number]) => rfq.status !== nextStatus
    );

    if (toUpdate.length === 0) {
      return NextResponse.json({
        ok: true,
        updatedCount: 0,
      });
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

    return NextResponse.json({
      ok: true,
      updatedCount: toUpdate.length,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_BULK_STATUS_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update selected RFQs.",
      },
      { status: 500 }
    );
  }
}