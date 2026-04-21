export type Product = {
  // Core identity
  id: string;
  partNo: string;
  brand: string;
  category: string;

  // Main display
  title: string;
  shortDescription?: string;
  description?: string;

  // Search + trust
  crossReferences?: string[];
  oemReferences?: string[];
  keywords?: string[];

  // Technical information
  spec?: string;
  specifications?: {
    label: string;
    value: string;
  }[];

  // Equipment / application
  equipment?: string[];
  applications?: string[];

  // Official reference
  officialUrl?: string;
  officialImageUrl?: string | null;

  // Commercial support
  stockStatus?: "in_stock" | "low_stock" | "request";
  isFeatured?: boolean;

  // Metadata / source traceability
  sourceType?: "official" | "catalog" | "internal" | "mixed";
  sourceNote?: string;

  // Search helpers
  refs?: string[]; // backward-compatible alias / legacy support
};