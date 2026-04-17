import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "RFQ detail route is not configured yet",
    },
    { status: 501 }
  );
}