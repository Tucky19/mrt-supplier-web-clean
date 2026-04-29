import type { Product } from "@/types/product";

export function normalizeProduct(p: any): Product {
  const refs = Array.isArray(p.refs)
    ? p.refs
    : Array.isArray(p.oemReferences)
    ? p.oemReferences
    : [];

  const crossReferences = Array.isArray(p.crossReferences)
    ? p.crossReferences
    : Array.isArray(p.refs)
    ? p.refs
    : [];

  return {
    id: String(p.id ?? p.partNo),
    partNo: String(p.partNo ?? ""),
    brand: String(p.brand ?? ""),
    category: String(p.category ?? ""),

    title: p.title ?? undefined,
    shortDescription: p.shortDescription ?? undefined,
    description: p.description ?? undefined,
    spec: p.spec ?? undefined,

    imageUrl: p.imageUrl ?? undefined,
    images: Array.isArray(p.images) ? p.images : undefined,
    media: Array.isArray(p.media) ? p.media : undefined,
    officialImageUrl: p.officialImageUrl ?? undefined,
    officialUrl: p.officialUrl ?? undefined,

    specifications: Array.isArray(p.specifications)
      ? p.specifications.map((s: any) => ({
          label: String(s.label),
          value: s.value,
        }))
      : undefined,

    refs,
    crossReferences,
    oemReferences: Array.isArray(p.oemReferences) ? p.oemReferences : undefined,
    application: Array.isArray(p.application) ? p.application : undefined,
    applications: Array.isArray(p.applications) ? p.applications : undefined,
    equipment: Array.isArray(p.equipment) ? p.equipment : undefined,
    thread: p.thread ?? undefined,

    seo: p.seo ?? undefined,

    dataQuality: p.dataQuality ?? "draft",

    stockStatus: p.stockStatus ?? "request",
    sourceType: p.sourceType ?? undefined,
    sourceNote: p.sourceNote ?? undefined,
    type: p.type ?? undefined,
    od_mm: p.od_mm ?? undefined,
    id_mm: p.id_mm ?? undefined,
    length_mm: p.length_mm ?? undefined,
  };
}

export function normalizeProducts(list: any[]): Product[] {
  return list.map(normalizeProduct);
}
