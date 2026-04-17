import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SITE_URL: process.env.SITE_URL ?? null,
    HAS_RESEND: Boolean(process.env.RESEND_API_KEY),
    HAS_ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
    HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL),
    RFQ_ADMIN_NOTIFY_EMAILS: process.env.RFQ_ADMIN_NOTIFY_EMAILS ?? null,
  });
}