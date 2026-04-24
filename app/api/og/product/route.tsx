import { ImageResponse } from "next/og";
import { products as catalogProducts } from "@/data/products/index";
import { OgProduct } from "@/lib/og/buildOgProduct";
import { truncate } from "@/lib/og/shared";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  stockStatus?: "in_stock" | "low_stock" | "request";
  officialUrl?: string;
  imageUrl?: string;
  refs?: string[];
};

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function findProductByPartNo(partNo: string) {
  const decoded = decodeURIComponent(partNo);
  const normalized = normalizePartNo(decoded);

  return catalogProducts.find((product) => {
    const currentPartNo =
      typeof product.partNo === "string" ? product.partNo : "";

    return (
      currentPartNo === decoded ||
      normalizePartNo(currentPartNo) === normalized
    );
  }) as Product | undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const locale = searchParams.get("locale") ?? "en";
  const requestedTitle = searchParams.get("title") ?? "";
  const requestedBrand = searchParams.get("brand") ?? "";
  const requestedCategory = searchParams.get("category") ?? "";
  const requestedSubtitle = searchParams.get("subtitle") ?? "";

  const product =
    requestedTitle ? findProductByPartNo(requestedTitle) : undefined;

  const partNo = truncate(
    product?.partNo || requestedTitle || "MRT Supplier",
    48
  );

  const brand = truncate(
    product?.brand?.trim() || requestedBrand || "Industrial Parts",
    32
  );

  const category = truncate(
    product?.category?.trim() ||
      requestedCategory ||
      (locale === "th" ? "อะไหล่อุตสาหกรรม" : "Industrial Components"),
    28
  );

  const title = truncate(
    product?.title?.trim() ||
      product?.spec?.trim() ||
      requestedSubtitle ||
      (locale === "th"
        ? "ค้นหาสินค้าอุตสาหกรรมและส่งขอราคาได้รวดเร็ว"
        : "Industrial parts search and RFQ support"),
    90
  );

  return new ImageResponse(
    <OgProduct
      partNo={partNo}
      brand={brand}
      category={category}
      title={title}
      locale={locale}
    />,
    size
  );
}