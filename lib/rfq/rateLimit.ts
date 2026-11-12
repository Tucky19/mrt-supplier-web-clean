import { prisma } from "@/lib/db";

type RateLimitResult = {
  storageUnavailable?: boolean;
  ok: boolean;
  allowed: boolean;
  count: number;
  limit: number;
  remaining: number;
  retryAfterSec: number;
};

function floorToWindowStart(date: Date, windowMinutes: number) {
  const ms = date.getTime();
  const winMs = windowMinutes * 60 * 1000;

  return new Date(Math.floor(ms / winMs) * winMs);
}

export async function consumeRfqRateLimit(opts: {
  ipHash: string;
  limit?: number;
  windowMinutes?: number;
}): Promise<RateLimitResult> {
  // Keep the UI-only RFQ mock behind an explicit env flag so development can still exercise the real DB flow.
  if (
    process.env.NODE_ENV === "development" &&
    process.env.RFQ_DEV_MOCK_BYPASS === "true"
  ) {
  return {
  ok: true,
  allowed: true,
  count: 0,
  limit: 999,
  remaining: 999,
  retryAfterSec: 0,
};
  }

  const limit = Number(opts.limit ?? process.env.RFQ_RATE_LIMIT_MAX ?? 5);
  const windowMinutes = Number(
    opts.windowMinutes ?? process.env.RFQ_RATE_LIMIT_WINDOW_MIN ?? 60
  );

  const now = new Date();
  const windowStart = floorToWindowStart(now, windowMinutes);

  try {
    const row = await prisma.rfqRateLimit.upsert({
      where: {
        ipHash_windowStart: {
          ipHash: opts.ipHash,
          windowStart,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        ipHash: opts.ipHash,
        windowStart,
        count: 1,
      },
    });

   const allowed = row.count <= limit;

return {
  ok: allowed,
  allowed,
  count: row.count,
  limit,
  remaining: Math.max(0, limit - row.count),
  retryAfterSec: windowMinutes * 60,
};
  } catch (error) {
    console.error("[RFQ_RATE_LIMIT_ERROR]", error);

    // Fail closed before persistence or notifications when quota cannot be checked.
   return {
  storageUnavailable: true,
  ok: false,
  allowed: false,
  count: 0,
  limit,
  remaining: 0,
  retryAfterSec: 60,
};
  }
}
