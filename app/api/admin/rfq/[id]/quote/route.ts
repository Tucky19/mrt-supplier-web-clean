import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const QuoteWorkflowSchema = z.object({
  note: z.string().trim().max(5000).optional().or(z.literal("")),
  nextFollowUpAt: z.string().optional().or(z.literal("")),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = QuoteWorkflowSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid quotation payload." },
        { status: 400 }
      );
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "RFQ not found." },
        { status: 404 }
      );
    }

    if (existing.status === "closed" || existing.status === "spam") {
      return NextResponse.json(
        { ok: false, error: "This RFQ cannot be quoted." },
        { status: 400 }
      );
    }

    const note = parsed.data.note?.trim() || "";
    const nextFollowUpAtRaw = parsed.data.nextFollowUpAt?.trim() || "";

    let followUpDueAt: Date | null = null;

    if (nextFollowUpAtRaw) {
      const dueAt = new Date(nextFollowUpAtRaw);

      if (Number.isNaN(dueAt.getTime())) {
        return NextResponse.json(
          { ok: false, error: "Invalid next follow-up date." },
          { status: 400 }
        );
      }

      followUpDueAt = dueAt;
    }

    const operations: Promise<unknown>[] = [];

    operations.push(
      prisma.rfq.update({
        where: { id },
        data: {
          status: "quoted",
        },
      })
    );

    if (existing.status !== "quoted") {
      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "status_changed",
            payload: {
              from: existing.status,
              to: "quoted",
            },
          },
        })
      );
    }

    if (note) {
      operations.push(
        prisma.rfqNote.create({
          data: {
            rfqId: id,
            body: note,
          },
        })
      );

      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "note",
            payload: {
              body: note,
              source: "quotation_workflow",
            },
          },
        })
      );
    }

    if (followUpDueAt) {
      operations.push(
        prisma.followUp.create({
          data: {
            rfqId: id,
            dueAt: followUpDueAt,
            note: note || "Follow up after quotation",
          },
        })
      );

      operations.push(
        prisma.rfqEvent.create({
          data: {
            rfqId: id,
            type: "follow_up",
            payload: {
              action: "created",
              dueAt: followUpDueAt.toISOString(),
              note: note || "Follow up after quotation",
              source: "quotation_workflow",
            },
          },
        })
      );
    }

    const result = await prisma.$transaction(operations);

    revalidatePath(`/admin/rfq/${id}`);
    revalidatePath("/admin/rfq");

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_QUOTE_WORKFLOW_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process quotation workflow.",
      },
      { status: 500 }
    );
  }
}