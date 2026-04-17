// lib/product-contract.ts
// MRT Supplier — Product Contract (Single Source of Truth)

export type StockStatus =
  | "in_stock"   // พร้อมส่ง
  | "low_stock"  // สต็อกน้อย
  | "request";   // สั่งเข้า / RFQ only

export type ProductCategory =
  | "filter"
  | "bearing"
  | "hydraulic"
  | "oil_filter"
  | "air_filter"
  | "fuel_filter"
  | "other";

export type ProductSpec = {
  label: string;
  value: string;
  unit?: string;
};

export type Product = {
  // Core identity (required)
  id: string;        // internal unique id (donaldson-p550388)
  partNo: string;    // main part number (P550388)
  brand: string;     // Donaldson, NTN, MANN, etc.

  // Basic info
  title?: string;    // Spin-On Lube Filter
  category?: ProductCategory;
  spec?: string;     // short summary: OD 93mm × L 173mm × 1-12 UN

  // Detailed specs
  specifications?: ProductSpec[];

  // Stock system
  stockStatus?: StockStatus;
  stockQty?: number;

  // Search optimization
  searchTokens?: string[];

  // Cross reference
  substitutePartNos?: string[];

  // Media
  image?: string;
  datasheet?: string;

  // SEO
  slug?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
};

export type MiniProduct = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  spec?: string;

  stockStatus?: StockStatus;
  stockQty?: number;
};

export type QuoteItem = {
  id: string;

  productId?: string;

  partNo: string;
  brand?: string;
  category?: string;
  spec?: string;

  qty: number;

  note?: string;
};

export type RFQRequest = {
  customer: {
    company?: string;
    name?: string;
    phone?: string;
    email?: string;
    note?: string;
  };

  items: QuoteItem[];
};

export type RFQResponse = {
  ok: boolean;
  requestId?: string;
  error?: string;
};

export function normalizePartNo(partNo: string): string {
  return partNo
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

export function compactAlphaNum(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function productSearchText(p: Product): string {
  return [
    p.partNo,
    p.brand,
    p.title,
    p.category,
    p.spec,
    ...(p.searchTokens ?? []),
  ]
    .join(" ")
    .toLowerCase();
}
