export type Product = {
  id: string;
  partNo: string;
  brand: string;

  category?: string;

  title?: string;
  shortDescription?: string;
  description?: string;
  spec?: string;

  specifications?: Array<{
    label: string;
    value: string | number;
  }>;

  imageUrl?: string;
  images?: string[];
  media?: string[];
  officialImageUrl?: string | null;

  refs?: string[];
  crossReferences?: string[];
  oemReferences?: string[];

  officialUrl?: string;

  application?: string[];
  applications?: string[];
  equipment?: string[];
  thread?: string;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];

  dataQuality?: "verified" | "draft" | "needs_review";
  stockStatus?: "in_stock" | "low_stock" | "request" | string;
  isFeatured?: boolean;
  sourceType?: "official" | "catalog" | "internal" | "mixed" | string;
  sourceNote?: string;

  type?: "cartridge" | "spin_on";
  od_mm?: number;
  id_mm?: number;
  length_mm?: number;
};
