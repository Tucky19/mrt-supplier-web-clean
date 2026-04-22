import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminRfqListItem = {
  id: string;
  requestId: string;
  createdAt: Date;
  status: string;
  company: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  lineId: string | null;
  _count?: {
    items?: number;
  };
};

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("pageSize"), 20);
    const status = (searchParams.get("status") || "").trim();
    const q = (searchParams.get("q") || "").trim();

    const take = Math.min(pageSize, 100);
    const skip = (page - 1) * take;

    const where = {
      ...(status && status !== "all" ? { status } : {}),
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

    const [total, itemsRaw] = await Promise.all([
      prisma.rfq.count({ where }),
      prisma.rfq.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
    ]);

    const items = itemsRaw as AdminRfqListItem[];

    return NextResponse.json(
      {
        ok: true,
        items: items.map((rfq: AdminRfqListItem) => ({
          id: rfq.id,
          requestId: rfq.requestId,
          createdAt: rfq.createdAt,
          status: rfq.status,
          company: rfq.company,
          name: rfq.name,
          email: rfq.email,
          phone: rfq.phone,
          lineId: rfq.lineId,
          itemCount: rfq._count?.items ?? 0,
        })),
        pagination: {
          page,
          pageSize: take,
          total,
          totalPages: Math.max(1, Math.ceil(total / take)),
        },
        filters: {
          status: status || "all",
          q,
        },
      },
      {
        headers: {
          "X-MRT-Deprecated": "true",
          "X-MRT-Deprecated-Use": "/admin/rfq",
        },
      }
    );
  } catch (error) {
    console.error("[admin-rfqs-list-get]", error);

    return NextResponse.json(
      { ok: false, error: "Failed to load RFQs" },
      {
        status: 500,
        headers: {
          "X-MRT-Deprecated": "true",
          "X-MRT-Deprecated-Use": "/admin/rfq",
        },
      }
    );
  }
}
