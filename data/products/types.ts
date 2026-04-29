import type { Product as AppProduct } from "@/types/product";

export type ProductSpecification = NonNullable<AppProduct["specifications"]>[number];
export type ProductSeo = NonNullable<AppProduct["seo"]>;
export type Product = AppProduct;
