import crypto from "crypto";

const SALT = process.env.RFQ_HMAC_SALT || "dev_salt_change_me";

export function hmac(value: string) {
  return crypto.createHmac("sha256", SALT).update(value).digest("hex");
}

export function cleanText(s: string | undefined, max = 2000) {
  if (!s) return "";
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

export function pickClientIp(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "";
  const xrip = headers.get("x-real-ip");
  return xrip?.trim() || "";
}
