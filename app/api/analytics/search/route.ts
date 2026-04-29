import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function hashIP(ip: string | null) {
  if (!ip) return null;
  // lightweight hash (พอสำหรับ privacy)
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ??
      req.headers.get('x-real-ip') ??
      null;

    await prisma.searchEvent.create({
      data: {
        type: body.type,
        query: body.query ?? null,
        partNo: body.partNo ?? null,
        matchType: body.matchType ?? null,
        resultCount: body.resultCount ?? null,
        ipHash: hashIP(ip),
        userAgent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}