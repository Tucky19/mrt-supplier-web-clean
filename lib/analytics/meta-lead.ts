import { createHmac, timingSafeEqual } from "node:crypto";

// Server-only receipt. Never expose request ID, token, customer data, or raw GA event ID to Meta.
export function issueMetaLeadReceipt(requestId: string, secret = process.env.META_CONVERSIONS_API_TOKEN, now = Date.now()): string | undefined {
  if (!secret || !/^RFQ-\d{8}-[A-Z0-9]+$/.test(requestId) || /TEST|MOCK|SYNTHETIC/.test(requestId)) return undefined;
  const id = `meta_lead:${createHmac("sha256", secret).update(`mrt-meta-lead-id:${requestId}`).digest("hex")}`;
  const expires = Math.floor(now / 1000) + 300;
  const signature = createHmac("sha256", secret).update(`mrt-meta-receipt:${id}.${expires}`).digest("hex");
  return `${id}.${expires}.${signature}`;
}
export function verifyMetaLeadReceipt(receipt: string, eventId: string, secret: string, now = Date.now()) {
  if (!/^meta_lead:[a-f0-9]{64}\.\d{10}\.[a-f0-9]{64}$/.test(receipt)) return false;
  const [id, expiry, signature] = receipt.split(".");
  if (id !== eventId || Number(expiry) < now / 1000 || Number(expiry) > now / 1000 + 301) return false;
  const expected = createHmac("sha256", secret).update(`mrt-meta-receipt:${id}.${expiry}`).digest();
  return timingSafeEqual(Buffer.from(signature, "hex"), expected);
}
