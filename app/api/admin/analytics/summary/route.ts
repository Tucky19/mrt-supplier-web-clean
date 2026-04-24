import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseDays(sp: URLSearchParams) {
  const d = Number(sp.get("days") ?? "7");
  if (Number.isNaN(d) || d <= 0 || d > 90) return 7;
  return d;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseDays(searchParams);

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // counts
  const [searchCount, clickCount, rfqCount] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "search", createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { type: "click", createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { type: "rfq", createdAt: { gte: since } },
    }),
  ]);

  const conversion =
    searchCount > 0 ? Number((rfqCount / searchCount).toFixed(4)) : 0;

  return NextResponse.json({
    windowDays: days,
    totals: {
      search: searchCount,
      click: clickCount,
      rfq: rfqCount,
      conversion, // RFQ / search
    },
  });
}