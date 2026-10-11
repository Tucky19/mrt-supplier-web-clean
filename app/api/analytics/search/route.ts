import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeGrowthContext, safeId } from '@/lib/analytics/contract';

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
    if (!["search","click_result","add_to_quote"].includes(body.type)) return NextResponse.json({ok:false},{status:400});
    const safe = safeGrowthContext({ search_term:body.query,part_number:body.partNo,match_type:body.matchType,
      locale:body.locale,event_source:body.eventSource,session_id:body.sessionId,search_event_id:body.searchEventId });

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ??
      req.headers.get('x-real-ip') ??
      null;

    await prisma.searchEvent.create({
      data: {
        type: body.type,
        query: safe.search_term ?? null,
        partNo: safe.part_number ?? null, matchType: safe.match_type ?? null,
        resultCount: Number.isInteger(body.resultCount) && body.resultCount>=0 ? body.resultCount : null,
        eventId:safeId(body.eventId),locale:safe.locale,eventSource:safe.event_source,
        sessionId:safe.session_id,searchEventId:safe.search_event_id,
        ipHash: hashIP(ip),
        userAgent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") return NextResponse.json({ok:true,deduped:true});
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}