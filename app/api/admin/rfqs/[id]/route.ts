import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RfqItemShape = {
  id: string;
  productId: string | null;
  partNo: string;
  brand: string | null;
  category: string | null;
  title: string | null;
  spec: string | null;
  qty: number;
  createdAt: Date;
};

type RfqEventShape = {
  id: string;
  type: string;
  statusFrom: string | null;
  statusTo: string | null;
  note: string | null;
  meta: unknown;
  createdAt: Date;
};

type FollowUpShape = {
  id: string;
  title: string;
  note: string | null;
  dueAt: Date;
  doneAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type LeadShape = {
  id: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  lineId: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

type RfqDetailShape = {
  id: string;
  requestId: string;
  status: string;
  source: string | null;
  company: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  lineId: string | null;
  note: string | null;
  contactPref: string | null;
  createdAt: Date;
  updatedAt: Date;
  lead: LeadShape;
  items: RfqItemShape[];
  events: RfqEventShape[];
  followUps: FollowUpShape[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rfq = (await prisma.rfq.findUnique({
      where: { id },
      include: {
        items: true,
        lead: true,
        events: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        followUps: {
          orderBy: { dueAt: "asc" },
        },
      },
    })) as RfqDetailShape | null;

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      rfq: {
        id: rfq.id,
        requestId: rfq.requestId,
        status: rfq.status,
        source: rfq.source,
        company: rfq.company,
        name: rfq.name,
        phone: rfq.phone,
        email: rfq.email,
        lineId: rfq.lineId,
        note: rfq.note,
        contactPref: rfq.contactPref,
        createdAt: rfq.createdAt,
        updatedAt: rfq.updatedAt,

        lead: rfq.lead
          ? {
              id: rfq.lead.id,
              name: rfq.lead.name,
              company: rfq.lead.company,
              email: rfq.lead.email,
              phone: rfq.lead.phone,
              lineId: rfq.lead.lineId,
              createdAt: rfq.lead.createdAt,
              updatedAt: rfq.lead.updatedAt,
            }
          : null,

        items: rfq.items.map((item: RfqItemShape) => ({
          id: item.id,
          productId: item.productId,
          partNo: item.partNo,
          brand: item.brand,
          category: item.category,
          title: item.title,
          spec: item.spec,
          qty: item.qty,
          createdAt: item.createdAt,
        })),

        events: rfq.events.map((event: RfqEventShape) => ({
          id: event.id,
          type: event.type,
          statusFrom: event.statusFrom,
          statusTo: event.statusTo,
          note: event.note,
          meta: event.meta,
          createdAt: event.createdAt,
        })),

        followUps: rfq.followUps.map((followUp: FollowUpShape) => ({
          id: followUp.id,
          title: followUp.title,
          note: followUp.note,
          dueAt: followUp.dueAt,
          doneAt: followUp.doneAt,
          createdAt: followUp.createdAt,
          updatedAt: followUp.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error("[admin-rfq-detail-get]", error);

    return NextResponse.json(
      { error: "Failed to load RFQ detail" },
      { status: 500 }
    );
  }
}
