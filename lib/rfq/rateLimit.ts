import { prisma } from "@/lib/db";

type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number; limit: number };

function floorToWindowStart(date: Date, windowMinutes: number) {
  const ms = date.getTime();
  const winMs = windowMinutes * 60 * 1000;
  return new Date(Math.floor(ms / winMs) * winMs);
}

export async function consumeRfqRateLimit(opts: {
  ipHash: string;
  limit?: number; // default 5
  windowMinutes?: number; // default 60
}): Promise<RateLimitResult> {
  const limit = Number(opts.limit ?? process.env.RFQ_RATE_LIMIT_MAX ?? 5);
  const windowMinutes = Number(
    opts.windowMinutes ?? process.env.RFQ_RATE_LIMIT_WINDOW_MIN ?? 60
  );

  const now = new Date();
  const windowStart = floorToWindowStart(now, windowMinutes);

  const row = await prisma.rfqRateLimit.upsert({
    where: { ipHash_windowStart: { ipHash: opts.ipHash, windowStart } },
    update: { count: { increment: 1 } },
    create: { ipHash: opts.ipHash, windowStart, count: 1 },
    select: { count: true, windowStart: true },
  });

  if (row.count > limit) {
    const windowEnd = new Date(row.windowStart.getTime() + windowMinutes * 60 * 1000);
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowEnd.getTime() - now.getTime()) / 1000)
    );
    return { ok: false, retryAfterSec, limit };
  }

  return { ok: true, remaining: Math.max(0, limit - row.count) };
}