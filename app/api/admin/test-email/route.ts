import { NextResponse } from "next/server";
import { sendAdminRfqEmail } from "@/lib/mail";

export async function GET() {
  try {
    await sendAdminRfqEmail({
      requestId: `TEST-${Date.now()}`,
      customer: { name: "SMTP Test" },
      items: [{ productId: "test-product", partNo: "TEST-PART", qty: 1 }],
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}