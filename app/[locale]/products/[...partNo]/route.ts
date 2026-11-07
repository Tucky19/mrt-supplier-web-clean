import { products } from "@/data/products/index";

type RouteContext = {
  params: Promise<{ locale: string; partNo: string[] }>;
};

// Keep the existing single-segment product page and its metadata authoritative.
// Next.js has already decoded each segment; do not decode percent escapes again.
export async function GET(request: Request, { params }: RouteContext) {
  const { locale, partNo } = await params;
  const candidate = partNo.join("/");
  const product = (locale === "th" || locale === "en") &&
    partNo.length > 1 && partNo.every(Boolean)
    ? products.find((item) => item.partNo.includes("/") && item.partNo === candidate)
    : undefined;

  if (!product) {
    return new Response("Product not found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex" },
    });
  }

  const search = new URL(request.url).search;
  return new Response(null, {
    status: 308,
    headers: {
      Location: `/${locale}/products/${encodeURIComponent(product.partNo)}${search}`,
    },
  });
}
