import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const FollowUpSchema = z.object({
  dueAt: z.string().min(1, "Due date is required"),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = FollowUpSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid follow-up payload." },
        { status: 400 }
      );
    }

    const rfq = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!rfq) {
      return NextResponse.json(
        { ok: false, error: "RFQ not found." },
        { status: 404 }
      );
    }

    const dueAt = new Date(parsed.data.dueAt);

    if (Number.isNaN(dueAt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid due date." },
        { status: 400 }
      );
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

    return NextResponse.json({
      ok: true,
      followUp,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_FOLLOWUP_CREATE_ERROR]", error);

    return NextResponse.json(
      { ok: false, error: "Failed to create follow-up." },
      { status: 500 }
    );
  }
}