import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export async function GET() {
  try {
    const [r]=await prisma.$queryRaw<Array<{total:bigint;reviewed:bigint;qualified:bigint;seconds:number|null}>>`
      SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE qualification <> 'UNREVIEWED') AS reviewed,
        COUNT(*) FILTER (WHERE qualification = 'QUALIFIED') AS qualified,
        AVG(EXTRACT(EPOCH FROM ("qualifiedAt"-"createdAt"))) FILTER
          (WHERE qualification = 'QUALIFIED' AND "qualifiedAt" IS NOT NULL) AS seconds
      FROM "Rfq" WHERE status <> 'spam'`;
    const reviewed=Number(r.reviewed); const qualified=Number(r.qualified);
    return NextResponse.json({total:Number(r.total),reviewed,qualified,qualification_rate:reviewed ? qualified/reviewed : null,
      average_seconds_to_qualification:r.seconds===null ? null : Number(r.seconds),
      definition:"Current qualified / reviewed non-spam RFQs; all-time; manual qualification, not generate_lead"});
  } catch {return NextResponse.json({ok:false,error:"Qualification summary unavailable"},{status:503});}
}
