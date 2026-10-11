import { z } from "zod";
export const QualificationSchema = z.object({
  qualification:z.enum(["UNREVIEWED","QUALIFIED","UNQUALIFIED"]),
  version:z.number().int().nonnegative(),
  reason:z.enum(["TECHNICAL_REQUIREMENTS_CONFIRMED","ACTIONABLE_RFQ","NOT_ACTIONABLE","DUPLICATE","SPAM"]).optional(),
}).strict();
export function qualificationSummary(rows: Array<{qualification:string;createdAt:Date;qualifiedAt:Date|null}>) {
  const qualified = rows.filter(r=>r.qualification==="QUALIFIED");
  const reviewed = rows.filter(r=>r.qualification!=="UNREVIEWED").length;
  const times = qualified.flatMap(r=>r.qualifiedAt ? [Math.max(0,(r.qualifiedAt.getTime()-r.createdAt.getTime())/1000)] : []);
  return {total:rows.length,qualified:qualified.length,reviewed,
    qualification_rate:reviewed ? qualified.length/reviewed : null,
    average_seconds_to_qualification:times.length ? times.reduce((a,b)=>a+b,0)/times.length : null};
}
