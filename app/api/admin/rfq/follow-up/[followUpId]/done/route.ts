import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ followUpId: string }>;
};

export async function POST(_req: Request, { params }: RouteProps) {
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
      return NextResponse.json(
        { ok: false, error: "Follow-up not found." },
        { status: 404 }
      );
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

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_FOLLOWUP_DONE_ERROR]", error);

    return NextResponse.json(
      { ok: false, error: "Failed to mark follow-up as done." },
      { status: 500 }
    );
  }
}