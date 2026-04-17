import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const base = process.env.RFQ_SHEETS_READ_URL;
  const t = process.env.ADMIN_TOKEN;

  if (!base) {
    return NextResponse.json({ ok: false, error: "missing RFQ_SHEETS_READ_URL" }, { status: 500 });
  }

  const url = `${base}?token=${encodeURIComponent(t ?? "")}`;

  const r = await fetch(url, { cache: "no-store" });
  const text = await r.text();

  // บางที Apps Script ส่ง text/json มา เรา parse แบบปลอดภัย
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: r.ok ? 200 : 500 });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json from sheets", raw: text }, { status: 500 });
  }
}
