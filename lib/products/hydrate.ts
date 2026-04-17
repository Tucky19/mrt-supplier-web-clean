import productsJson from "@/data/products.json";

type StockStatus = "in_stock" | "low_stock" | "request";

type Product = {
  id: string;
  partNo: string;
  brand: string;
  title?: string;
  category?: string;
  spec?: string;
  image?: string;
  stockStatus?: StockStatus;
};

function safeStr(v: any) {
  return String(v ?? "").trim();
}

function toArrayProducts(src: any): Product[] {
  if (!src) return [];
  if (Array.isArray(src)) return src as Product[];
  if (typeof src === "object") return Object.values(src) as Product[];
  return [];
}

const master = toArrayProducts(productsJson).map((p) => ({
  ...p,
  id: safeStr((p as any).id),
  partNo: safeStr((p as any).partNo || (p as any).part_no),
  brand: safeStr((p as any).brand),
  title: safeStr((p as any).title || (p as any).nameTh || (p as any).name_th),
  category: safeStr((p as any).category),
  spec: safeStr((p as any).spec),
  image: safeStr((p as any).image),
  stockStatus: ((p as any).stockStatus || (p as any).stock || "request") as StockStatus,
}));

const byId = new Map(master.filter((x) => x.id).map((x) => [x.id, x]));
const byPart = new Map(master.filter((x) => x.partNo).map((x) => [x.partNo.toLowerCase(), x]));

export function hydrateFromProducts<T extends { id?: string; partNo?: string; part_no?: string }>(
  item: T
) {
  const id = safeStr((item as any).id);
  const partNo = safeStr((item as any).partNo || (item as any).part_no);
  const p =
    (id && byId.get(id)) ||
    (partNo && byPart.get(partNo.toLowerCase()));

  if (!p) return item;

  return {
    ...item,
    id: id || p.id,
    partNo: partNo || p.partNo,
    brand: safeStr((item as any).brand) || p.brand,
    title: safeStr((item as any).title) || p.title,
    category: safeStr((item as any).category) || p.category,
    spec: safeStr((item as any).spec) || p.spec,
    image: safeStr((item as any).image) || p.image,
    stockStatus: ((item as any).stockStatus || p.stockStatus || "request") as StockStatus,
  };
}