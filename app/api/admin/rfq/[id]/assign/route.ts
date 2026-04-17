import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const AssignSchema = z.object({
  assignedTo: z.string().trim().max(100).optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = AssignSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid assignment payload." },
        { status: 400 }
      );
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        assignedTo: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "RFQ not found." },
        { status: 404 }
      );
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

    return NextResponse.json({
      ok: true,
      rfq: updated,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_ASSIGN_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to assign owner.",
      },
      { status: 500 }
    );
  }
}