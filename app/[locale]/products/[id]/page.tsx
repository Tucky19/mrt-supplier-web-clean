import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as productSource from "@/data/products";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AddToQuoteButton from "@/components/quote/AddToQuoteButton";

type Product = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
  stockStatus?: "in_stock" | "low_stock" | "request";
};

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function normalize(value: string | undefined | null) {
  return String(value ?? "").trim().toLowerCase();
}

function resolveProducts(): Product[] {
  const source = productSource as Record<string, unknown>;

  if (Array.isArray(source.default)) return source.default as Product[];
  if (Array.isArray(source.products)) return source.products as Product[];
  if (Array.isArray(source.allProducts)) return source.allProducts as Product[];
  if (Array.isArray(source.featuredProducts)) return source.featuredProducts as Product[];

  return [];
}

const products = resolveProducts();

function findProductById(id: string): Product | undefined {
  const needle = normalize(id);

  return products.find((product) => {
    return (
      normalize(product.id) === needle ||
      normalize(product.partNo) === needle
    );
  });
}

function getStockLabel(
  status: Product["stockStatus"],
  locale: string
): string | null {
  if (!status) return null;

  if (locale === "th") {
    if (status === "in_stock") return "พร้อมส่ง";
    if (status === "low_stock") return "สต็อกต่ำ";
    return "สอบถามสินค้า";
  }

  if (status === "in_stock") return "In Stock";
  if (status === "low_stock") return "Low Stock";
  return "Request";
}

function getStockClass(status: Product["stockStatus"]) {
  if (status === "in_stock") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (status === "low_stock") {
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  const locales = ["th", "en"];

  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      id: product.id,
    }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = findProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | MRT Supplier",
      description: "The requested product could not be found.",
    };
  }

  const title = product.title || product.partNo || product.id || "Product Detail";

  return {
    title: `${title} | MRT Supplier`,
    description:
      product.spec ||
      `Industrial spare parts detail for ${title} from MRT Supplier.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = findProductById(id);

  if (!product) {
    notFound();
  }

  const title = product.title || product.partNo || product.id;
  const brand = product.brand || "Industrial Product";
  const effectiveStock = product.stockStatus ?? "in_stock";
  const stockLabel = getStockLabel(effectiveStock, locale);

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
          <Link
            href={`/${locale}/products`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← {locale === "th" ? "กลับหน้าสินค้า" : "Back to Products"}
          </Link>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {brand}
                  </p>

                  {stockLabel ? (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStockClass(
                        effectiveStock
                      )}`}
                    >
                      {stockLabel}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {locale === "th"
                    ? "หน้านี้แสดงข้อมูลสินค้าในรูปแบบที่เน้นรหัสสินค้า สเปค และลิงก์อ้างอิงจากผู้ผลิต เพื่อความน่าเชื่อถือและง่ายต่อการตรวจสอบ"
                    : "This page focuses on part number, specification, and official manufacturer reference for better trust and easier verification."}
                </p>

                {product.officialUrl ? (
                  <a
                    href={product.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    {locale === "th" ? "ดูข้อมูลทางการ" : "Official Reference"}
                  </a>
                ) : (
                  <div className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                    {locale === "th"
                      ? "ยังไม่มีลิงก์อ้างอิงทางการสำหรับรายการนี้"
                      : "No official reference link is available for this item yet."}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {brand}
                </p>

                {stockLabel ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStockClass(
                      effectiveStock
                    )}`}
                  >
                    {stockLabel}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>

              {product.partNo ? (
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Part No:</span>{" "}
                  {product.partNo}
                </p>
              ) : null}

              {product.category ? (
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Category:</span>{" "}
                  {product.category}
                </p>
              ) : null}

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {locale === "th" ? "ข้อมูลสินค้า" : "Product Information"}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.spec ||
                    (locale === "th"
                      ? "กรุณาติดต่อทีมงานเพื่อขอรายละเอียดสินค้าเพิ่มเติม"
                      : "Please contact our team for detailed specifications and quotation support.")}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <AddToQuoteButton
                  locale={locale}
                  label={locale === "th" ? "เพิ่มในใบขอราคา" : "Add to Quote"}
                  product={{
                    id: product.id,
                    partNo: product.partNo,
                    brand: product.brand,
                    title,
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                />

                <Link
                  href={`/quote`}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {locale === "th" ? "ดูใบขอราคา" : "View Quote"}
                </Link>

                <Link
                  href={`/${locale}/products`}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {locale === "th" ? "ดูสินค้าต่อ" : "View More Products"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}