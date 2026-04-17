import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const StatusSchema = z.object({
  status: z.enum(["new", "in_progress", "quoted", "closed", "spam"]),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = StatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid status payload.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "RFQ not found.",
        },
        { status: 404 }
      );
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

    return NextResponse.json({
      ok: true,
      rfq: updated,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_STATUS_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update status.",
      },
      { status: 500 }
    );
  }
}