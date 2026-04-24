import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      type,
      query,
      partNo,
      productId,
      sessionId,
    } = body;

    if (!type || !sessionId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        type,
        query,
        partNo,
        productId,
        sessionId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}