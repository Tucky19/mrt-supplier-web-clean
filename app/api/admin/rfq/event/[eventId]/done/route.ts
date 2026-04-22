import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use /api/admin/rfq/follow-up/[followUpId]/done." },
    { status: 410 }
  );
}
