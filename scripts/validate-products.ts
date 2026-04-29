import { z } from "zod";

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
  refs: z.array(z.string()).optional(),
});