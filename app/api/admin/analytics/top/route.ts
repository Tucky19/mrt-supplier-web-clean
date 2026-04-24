import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseDays(sp: URLSearchParams) {
  const d = Number(sp.get("days") ?? "7");
  if (Number.isNaN(d) || d <= 0 || d > 90) return 7;
  return d;
}

function parseLimit(sp: URLSearchParams) {
  const l = Number(sp.get("limit") ?? "10");
  if (Number.isNaN(l) || l <= 0 || l > 50) return 10;
  return l;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseDays(searchParams);
  const limit = parseLimit(searchParams);

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // TOP SEARCH (by query)
  const topSearch = await prisma.analyticsEvent.groupBy({
    by: ["query"],
    where: {
      type: "search",
      createdAt: { gte: since },
      query: { not: null },
    },
    _count: { _all: true },
    orderBy: { _count: { _all: "desc" } },
    take: limit,
  });

  // TOP CLICK (by partNo)
  const topClick = await prisma.analyticsEvent.groupBy({
    by: ["partNo"],
    where: {
      type: "click",
      createdAt: { gte: since },
      partNo: { not: null },
    },
    _count: { _all: true },
    orderBy: { _count: { _all: "desc" } },
    take: limit,
  });

  // TOP RFQ (by partNo)
  const topRfq = await prisma.analyticsEvent.groupBy({
    by: ["partNo"],
    where: {
      type: "rfq",
      createdAt: { gte: since },
      partNo: { not: null },
    },
    _count: { _all: true },
    orderBy: { _count: { _all: "desc" } },
    take: limit,
  });

type TopSearchRow = {
  query: string | null;
  _count: {
    _all: number;
  };
};

type TopPartRow = {
  partNo: string | null;
  _count: {
    _all: number;
  };
};

return NextResponse.json({
  windowDays: days,
  topSearch: (topSearch as TopSearchRow[]).map((r) => ({
    query: r.query,
    count: r._count._all,
  })),
  topClick: (topClick as TopPartRow[]).map((r) => ({
    partNo: r.partNo,
    count: r._count._all,
  })),
  topRfq: (topRfq as TopPartRow[]).map((r) => ({
    partNo: r.partNo,
    count: r._count._all,
  })),
});
}