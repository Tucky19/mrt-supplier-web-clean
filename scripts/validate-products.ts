import { z } from "zod";

const ProductRelationSchema = z.union([
  z.string(),
  z.object({
    partNumber: z.unknown().optional(),
    partNo: z.unknown().optional(),
    brand: z.unknown().optional(),
    relationType: z.unknown().optional(),
    verificationStatus: z.unknown().optional(),
    evidence: z.unknown().optional(),
    source: z.unknown().optional(),
    evidenceUrl: z.unknown().optional(),
    evidenceNote: z.unknown().optional(),
    approvedBy: z.unknown().optional(),
    approvedAt: z.unknown().optional(),
    note: z.unknown().optional(),
  }),
]);

export const ProductSchema = z.object({
  id: z.string().min(3),
  partNo: z.string().min(3),
  brand: z.string().min(2),
  category: z.string(),

  description: z.string().optional(),
  type: z.enum(["cartridge", "spin_on"]).optional(),

  od_mm: z.number().optional(),
  id_mm: z.number().optional(),
  length_mm: z.number().optional(),

  imageUrl: z.string().optional(),
  refs: z.array(ProductRelationSchema).optional(),
});
