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

const NoteSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteProps) {
  const traceId = getTraceId(req);

  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = NoteSchema.safeParse(json);

    if (!parsed.success) {
      return errorJson({
        traceId,
        status: 400,
        error: "Invalid note payload.",
      });
    }

    const existing = await prisma.rfq.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorJson({
        traceId,
        status: 404,
        error: "RFQ not found.",
      });
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

    logApiEvent("info", "admin.rfq.note.created", {
      traceId,
      route: "/api/admin/rfq/[id]/note",
      rfqId: id,
      noteId: note.id,
      bodyLength: note.body.length,
    });

    return jsonWithTrace(
      {
        ok: true,
        note,
      },
      undefined,
      traceId
    );
  } catch (error) {
    logApiEvent("error", "admin.rfq.note.failed", {
      traceId,
      route: "/api/admin/rfq/[id]/note",
      error: getErrorMessage(error, "Failed to create note."),
    });

    return errorJson({
      traceId,
      status: 500,
      error: "Failed to create note.",
    });
  }
}
