import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseDays(sp: URLSearchParams) {
  const d = Number(sp.get("days") ?? "7");
  if (Number.isNaN(d) || d <= 0 || d > 90) return 7;
  return d;
}

type PartRow = {
  partNo: string | null;
  _count: {
    _all: number;
  };
};

type SearchRow = {
  query: string | null;
  _count: {
    _all: number;
  };
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseDays(searchParams);

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [clickRows, rfqRows, searchRows] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["partNo"],
      where: {
        type: "click",
        createdAt: { gte: since },
        partNo: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 50,
    }),

    prisma.analyticsEvent.groupBy({
      by: ["partNo"],
      where: {
        type: "rfq",
        createdAt: { gte: since },
        partNo: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 50,
    }),

    prisma.analyticsEvent.groupBy({
      by: ["query"],
      where: {
        type: "search",
        createdAt: { gte: since },
        query: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 50,
    }),
  ]);

  const clicks = (clickRows as PartRow[]).map((row) => ({
    partNo: row.partNo ?? "-",
    clicks: row._count._all,
  }));

  const rfqs = (rfqRows as PartRow[]).map((row) => ({
    partNo: row.partNo ?? "-",
    rfqs: row._count._all,
  }));

  const rfqMap = new Map(rfqs.map((row) => [row.partNo, row.rfqs]));

  const productConversion = clicks.map((row) => {
    const rfqCount = rfqMap.get(row.partNo) ?? 0;

    return {
      partNo: row.partNo,
      clicks: row.clicks,
      rfqs: rfqCount,
      conversionRate:
        row.clicks > 0 ? Number((rfqCount / row.clicks).toFixed(4)) : 0,
    };
  });

  const clickedPartNos = new Set(clicks.map((row) => row.partNo.toLowerCase()));

  const deadSearch = (searchRows as SearchRow[])
    .map((row) => ({
      query: row.query ?? "-",
      searches: row._count._all,
    }))
    .filter((row) => !clickedPartNos.has(row.query.toLowerCase()))
    .slice(0, 20);

  return NextResponse.json({
    windowDays: days,
    productConversion,
    deadSearch,
  });
}