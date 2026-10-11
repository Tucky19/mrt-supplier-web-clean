import { prisma } from "@/lib/prisma";
import { QualificationSchema } from "@/lib/rfq/qualification";
import type { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}) {
  if (req.headers.get("origin") && req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ok:false},{status:403});
  const parsed=QualificationSchema.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({ok:false,error:"Invalid qualification decision"},{status:400});
  const {id}=await params; const decision=parsed.data;
  try {
    const result=await prisma.$transaction(async (tx: PrismaClient)=>{
      const current=await tx.rfq.findUnique({where:{id}});
      if (!current) return {code:404};
      if (current.qualificationVersion !== decision.version) return {code:409};
      const reason=decision.qualification==="UNREVIEWED" ? null : decision.reason ?? null;
      if (current.qualification===decision.qualification && current.qualificationReason===reason) return {code:200,rfq:current};
      const at=new Date();
      const changed=await tx.rfq.updateMany({where:{id,qualificationVersion:decision.version},data:{
        qualification:decision.qualification,qualifiedAt:decision.qualification==="QUALIFIED" ? current.qualifiedAt ?? at : null,
        qualificationUpdatedAt:at,qualificationReason:reason,qualificationVersion:{increment:1}}});
      if (changed.count!==1) return {code:409};
      await tx.rfqEvent.create({data:{rfqId:id,type:"note",payload:{kind:"qualification_changed",body:`Qualification changed: ${current.qualification} → ${decision.qualification}`,
        from:current.qualification,to:decision.qualification,reason,version:decision.version+1,
        request_id:current.requestId,at:at.toISOString()}}});
      const rfq=await tx.rfq.findUnique({where:{id},select:{id:true,requestId:true,qualification:true,qualificationVersion:true,qualifiedAt:true,qualificationReason:true}});
      return {code:200,rfq};
    });
    // Do not return customer fields, even on a repeated/no-op decision.
    const r=result.rfq;
    return NextResponse.json({ok:result.code===200,rfq:r ? {id:r.id,requestId:r.requestId,qualification:r.qualification,
      qualificationVersion:r.qualificationVersion,qualifiedAt:r.qualifiedAt,qualificationReason:r.qualificationReason}:undefined}, {status:result.code});
  } catch {return NextResponse.json({ok:false,error:"Qualification could not be saved"},{status:500});}
}
