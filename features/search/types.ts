import type { Product } from "@/data/types";

export type SearchMode = "part" | "spec" | "all";

export type SearchProductInput = {
  q: string;
  mode?: SearchMode;
  limit?: number;
};

export type SearchReason =
  | "exact_part"
  | "prefix_part"
  | "contains_part"
  | "xref_exact"
  | "xref_prefix"
  | "token_match"
  | "brand_match"
  | "category_match"
  | "title_match"
  | "spec_match"
  | "data_quality";

export type SearchHit = {
  product: Product;
  score: number;
  reasons: SearchReason[];
};

export type SearchProductResult = {
  q: string;
  total: number;
  hits: SearchHit[];
};