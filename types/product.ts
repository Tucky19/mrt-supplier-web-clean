export type StockStatus = "in_stock" | "low_stock" | "request";

export type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  stockStatus?: StockStatus;
  officialUrl?: string;
  imageUrl?: string;
  refs?: string[];
};