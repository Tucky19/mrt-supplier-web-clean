import { NextResponse } from "next/server";
import { getMailDiagnostics, verifyMailTransport } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const diagnostics = getMailDiagnostics();

    console.log("[MAILTEST] env_check", diagnostics);

    const verified = await verifyMailTransport();

    return NextResponse.json({
      ok: true,
      msg: "SMTP verify OK",
      env: verified,
    });
  } catch (err: any) {
    console.error("[MAILTEST] ERROR:", {
      error: err?.message || String(err),
      code: err?.code,
      ...getMailDiagnostics(),
    });

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(err),
        code: err?.code,
      },
      { status: 500 }
    );
  }
}
