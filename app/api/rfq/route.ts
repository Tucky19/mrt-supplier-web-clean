import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RfqItemInput = {
  productId?: string | null;
  partNo: string;
  brand?: string | null;
  category?: string | null;
  title?: string | null;
  spec?: string | null;
  qty: number;
  meta?: Record<string, unknown> | null;
};

type RfqPayload = {
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  lineId?: string;
  note?: string;
  contactPref?: string;
  source?: string;
  items: RfqItemInput[];
};

function normalizePartNo(value: string): string {
  return value.trim().toUpperCase().replace(/[\s\-_]/g, '');
}

function makeRequestId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `RFQ-${yyyy}${mm}${dd}-${hh}${mi}${ss}-${rand}`;
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() ?? null;
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function pickContactPref(input: RfqPayload): string | null {
  if (input.contactPref?.trim()) return input.contactPref.trim();
  if (input.lineId?.trim()) return 'line';
  if (input.phone?.trim()) return 'phone';
  if (input.email?.trim()) return 'email';
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RfqPayload;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'At least one RFQ item is required' },
        { status: 400 }
      );
    }

    const cleanedItems = body.items
      .map((item) => ({
        productId: item.productId ?? null,
        partNo: item.partNo?.trim(),
        brand: item.brand?.trim() || null,
        category: item.category?.trim() || null,
        title: item.title?.trim() || null,
        spec: item.spec?.trim() || null,
        qty: Number(item.qty),
        meta: item.meta ?? null,
      }))
      .filter((item) => item.partNo && item.qty > 0);

    if (cleanedItems.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No valid RFQ items found' },
        { status: 400 }
      );
    }

    const requestId = makeRequestId();
    const source = body.source?.trim() || 'web';
    const userAgent = request.headers.get('user-agent') || null;

    const clientIp = getClientIp(request);
    const ipHash = clientIp ? await hashIp(clientIp) : null;

    let leadId: string | null = null;

    const hasLeadIdentity =
      Boolean(body.email?.trim()) ||
      Boolean(body.phone?.trim()) ||
      Boolean(body.lineId?.trim());

    if (hasLeadIdentity) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: [
            body.email?.trim() ? { email: body.email.trim() } : undefined,
            body.phone?.trim() ? { phone: body.phone.trim() } : undefined,
            body.lineId?.trim() ? { lineId: body.lineId.trim() } : undefined,
          ].filter(Boolean) as Array<
            | { email: string }
            | { phone: string }
            | { lineId: string }
          >,
        },
      });

      if (existingLead) {
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            company: body.company?.trim() || existingLead.company,
            name: body.name?.trim() || existingLead.name,
            note: body.note?.trim() || existingLead.note,
          },
        });

        leadId = updatedLead.id;
      } else {
        const newLead = await prisma.lead.create({
          data: {
            email: body.email?.trim() || null,
            phone: body.phone?.trim() || null,
            lineId: body.lineId?.trim() || null,
            company: body.company?.trim() || null,
            name: body.name?.trim() || null,
            note: body.note?.trim() || null,
          },
        });

        leadId = newLead.id;
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      const rfq = await tx.rfq.create({
        data: {
          requestId,
          company: body.company?.trim() || null,
          name: body.name?.trim() || null,
          phone: body.phone?.trim() || null,
          email: body.email?.trim() || null,
          lineId: body.lineId?.trim() || null,
          note: body.note?.trim() || null,
          contactPref: pickContactPref(body),
          ipHash,
          source,
          userAgent,
          leadId,
          status: 'new',
          items: {
            create: cleanedItems.map((item) => ({
              productId: item.productId,
              partNo: normalizePartNo(item.partNo!),
              brand: item.brand,
              category: item.category,
              title: item.title,
              spec: item.spec,
              qty: item.qty,
              meta: item.meta,
            })),
          },
          events: {
            create: {
              type: 'created',
              payload: {
                source,
                itemCount: cleanedItems.length,
                hasLeadIdentity,
              },
            },
          },
        },
        include: {
          items: true,
          events: {
            orderBy: { createdAt: 'asc' },
            take: 5,
          },
          lead: true,
        },
      });

      return rfq;
    });

    return NextResponse.json({
      ok: true,
      rfq: {
        id: created.id,
        requestId: created.requestId,
        status: created.status,
        company: created.company,
        name: created.name,
        email: created.email,
        phone: created.phone,
        lineId: created.lineId,
        source: created.source,
        createdAt: created.createdAt,
        items: created.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          partNo: item.partNo,
          brand: item.brand,
          category: item.category,
          title: item.title,
          qty: item.qty,
        })),
      },
    });
  } catch (error) {
    console.error('RFQ create error:', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to create RFQ',
      },
      { status: 500 }
    );
  }
}