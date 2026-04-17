import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const NoteSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = NoteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid note payload.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true },
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

    const note = await prisma.rfqNote.create({
      data: {
        rfqId: id,
        body: parsed.data.body,
      },
    });

    await prisma.rfqEvent.create({
      data: {
        rfqId: id,
        type: "note",
        payload: {
          noteId: note.id,
          body: note.body,
        },
      },
    });

    revalidatePath(`/admin/rfq/${id}`);
    revalidatePath("/admin/rfq");

    return NextResponse.json({
      ok: true,
      note,
    });
  } catch (error) {
    console.error("[ADMIN_RFQ_NOTE_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to create note.",
      },
      { status: 500 }
    );
  }
}