import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { RfqStatus } from "@prisma/client";

type GroupedStatusCount = {
  status: RfqStatus;
  _count: {
    _all: number;
  };
};

function safeStatus(value: string | null) {
  const v = String(value ?? "").trim().toLowerCase();

  if (
    v === "new" ||
    v === "in_progress" ||
    v === "quoted" ||
    v === "closed" ||
    v === "spam"
  ) {
    return v as RfqStatus;
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = safeStatus(searchParams.get("status"));
    const q = String(searchParams.get("q") ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { requestId: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
              { lineId: { contains: q, mode: "insensitive" as const } },
              {
                items: {
                  some: {
                    OR: [
                      { partNo: { contains: q, mode: "insensitive" as const } },
                      { brand: { contains: q, mode: "insensitive" as const } },
                      { title: { contains: q, mode: "insensitive" as const } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [rows, total, byStatus] = await Promise.all([
      prisma.rfq.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          items: {
            select: {
              id: true,
              partNo: true,
              brand: true,
              qty: true,
            },
          },
          _count: {
            select: {
              items: true,
              events: true,
              followUps: true,
            },
          },
        },
      }),
      prisma.rfq.count({ where }),
      prisma.rfq.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const grouped = byStatus as GroupedStatusCount[];

    const stats = {
      totalAll: grouped.reduce(
        (sum: number, row: GroupedStatusCount) => sum + row._count._all,
        0
      ),
      new: grouped.find((x: GroupedStatusCount) => x.status === "new")?._count._all ?? 0,
      in_progress:
        grouped.find((x: GroupedStatusCount) => x.status === "in_progress")?._count._all ?? 0,
      quoted: grouped.find((x: GroupedStatusCount) => x.status === "quoted")?._count._all ?? 0,
      closed: grouped.find((x: GroupedStatusCount) => x.status === "closed")?._count._all ?? 0,
      spam: grouped.find((x: GroupedStatusCount) => x.status === "spam")?._count._all ?? 0,
    };

    return NextResponse.json({
      ok: true,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats,
      rows,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load RFQ list";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}