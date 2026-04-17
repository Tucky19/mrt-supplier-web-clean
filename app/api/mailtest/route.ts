import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const host = process.env.SMTP_HOST || "";
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";

    // แสดงว่า env ถูกโหลดจริงไหม (ไม่โชว์ pass เต็ม)
    console.log("[MAILTEST] host:", host);
    console.log("[MAILTEST] port:", port);
    console.log("[MAILTEST] user:", user);
    console.log("[MAILTEST] pass_len:", pass.length);

    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

    // เช็คว่า login ผ่านไหม
    await transporter.verify();

    return NextResponse.json({ ok: true, msg: "SMTP verify OK" });
  } catch (err: any) {
    console.error("[MAILTEST] ERROR:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
