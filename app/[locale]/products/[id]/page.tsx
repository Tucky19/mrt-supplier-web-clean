import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import * as productSource from "@/data/products";
import AddToQuoteButton from "@/components/quote/AddToQuoteButton";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ProductApplicationBlock from "@/components/products/detail/ProductApplicationBlock";
import ProductCrossRefBlock from "@/components/products/detail/ProductCrossRefBlock";
import ProductHero from "@/components/products/detail/ProductHero";
import ProductOfficialReference from "@/components/products/detail/ProductOfficialReference";
import ProductRfqCTA from "@/components/products/detail/ProductRfqCTA";
import ProductSpecTable from "@/components/products/detail/ProductSpecTable";

type ProductSpecification = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  spec?: string;
  specifications?: ProductSpecification[];
  crossReferences?: string[];
  oemReferences?: string[];
  equipment?: string[];
  applications?: string[];
  officialUrl?: string;
  officialImageUrl?: string | null;
  stockStatus?: "in_stock" | "low_stock" | "request";
};

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function normalize(value: string | undefined | null) {
  return String(value ?? "").trim().toLowerCase();
}

function hasContent(value: string | undefined | null) {
  return String(value ?? "").trim().length > 0;
}

function nonEmptyList(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function nonEmptySpecifications(values?: ProductSpecification[]) {
  return (values ?? []).filter(
    (item) => hasContent(item?.label) && hasContent(item?.value)
  );
}

function resolveProducts(): Product[] {
  const source = productSource as Record<string, unknown>;

  if (Array.isArray(source.default)) return source.default as Product[];
  if (Array.isArray(source.products)) return source.products as Product[];
  if (Array.isArray(source.allProducts)) return source.allProducts as Product[];
  if (Array.isArray(source.featuredProducts)) {
    return source.featuredProducts as Product[];
  }

  return [];
}

const products = resolveProducts();

function findProductById(id: string): Product | undefined {
  const needle = normalize(id);

  return products.find((product) => {
    return normalize(product.id) === needle || normalize(product.partNo) === needle;
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
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "low_stock") {
    return "border border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border border-slate-200 bg-slate-100 text-slate-700";
}

function getCategoryLabel(category: string | undefined, locale: string) {
  if (!hasContent(category)) return null;

  const raw = String(category).trim();

  if (locale === "th") {
    const categoryMap: Record<string, string> = {
      air_filter: "ไส้กรองอากาศ",
      fuel_filter: "ไส้กรองเชื้อเพลิง",
      oil_filter: "ไส้กรองน้ำมัน",
      hydraulic_filter: "ไส้กรองไฮดรอลิก",
      air_cleaner: "ชุดกรองอากาศ",
      air_dryer: "ไส้กรองลม",
      air_oil_separator: "แยกลม/น้ำมัน",
      accessory: "อุปกรณ์เสริม",
      hardware: "ฮาร์ดแวร์",
    };

    return categoryMap[raw] ?? raw;
  }

  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  const description =
    product.shortDescription ||
    product.description ||
    product.spec ||
    `Industrial spare parts detail for ${title} from MRT Supplier.`;

  return {
    title: `${title} | MRT Supplier`,
    description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = findProductById(id);

  if (!product) {
    notFound();
  }

  const title = product.title || product.partNo || product.id;
  const brand = product.brand?.trim() || "Industrial Product";
  const categoryLabel = getCategoryLabel(product.category, locale);
  const effectiveStock = product.stockStatus ?? "request";
  const stockLabel = getStockLabel(effectiveStock, locale);
  const summaryText =
    product.shortDescription?.trim() || product.description?.trim() || "";

  const specifications = nonEmptySpecifications(product.specifications);
  const crossReferences = nonEmptyList(product.crossReferences);
  const oemReferences = nonEmptyList(product.oemReferences);
  const equipment = nonEmptyList(product.equipment);
  const applications = nonEmptyList(product.applications);

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href={`/${locale}`} className="transition hover:text-slate-900">
              {locale === "th" ? "หน้าแรก" : "Home"}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/products`}
              className="transition hover:text-slate-900"
            >
              {locale === "th" ? "สินค้า" : "Products"}
            </Link>
            {categoryLabel ? (
              <>
                <span>/</span>
                <span>{categoryLabel}</span>
              </>
            ) : null}
            <span>/</span>
            <span className="font-medium text-slate-700">
              {product.partNo || title}
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
            <ProductHero
              locale={locale}
              brand={brand}
              categoryLabel={categoryLabel}
              stockLabel={stockLabel}
              stockClassName={getStockClass(effectiveStock)}
              title={title}
              partNo={product.partNo}
              summaryText={summaryText}
              officialUrl={product.officialUrl}
              quoteHref={`/${locale}/quote`}
              product={{
                id: product.id,
                partNo: product.partNo ?? "",
                brand: product.brand,
                title: product.title,
              }}
            />

            <aside className="space-y-5 lg:space-y-6">
              {product.spec ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {locale === "th" ? "Quick Spec" : "Quick Spec"}
                  </p>
                  <p className="mt-3 text-base font-medium leading-7 text-slate-900">
                    {product.spec}
                  </p>
                </div>
              ) : null}

              <ProductOfficialReference
                locale={locale}
                officialUrl={product.officialUrl}
              />

              <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {locale === "th" ? "RFQ" : "RFQ"}
                </p>
                <h2 className="mt-2 text-lg font-semibold">
                  {locale === "th"
                    ? "พร้อมส่งใบขอราคาแล้ว?"
                    : "Ready to request a quote?"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {locale === "th"
                    ? "เพิ่มสินค้านี้ลงในใบขอราคา แล้วส่ง RFQ ให้ทีมช่วยตรวจสอบและติดต่อกลับ"
                    : "Add this item to your quote list and send an RFQ for team follow-up."}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <AddToQuoteButton
                    product={{
                      id: product.id,
                      partNo: product.partNo ?? "",
                      brand: product.brand,
                      title: product.title,
                    }}
                  />
                  <Link
                    href={`/${locale}/quote`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-3 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    {locale === "th" ? "ส่ง RFQ" : "Send RFQ"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 space-y-6 lg:space-y-8">
            <ProductSpecTable
              locale={locale}
              specifications={specifications}
            />

            <ProductCrossRefBlock
              locale={locale}
              crossReferences={crossReferences}
              oemReferences={oemReferences}
            />

            <ProductApplicationBlock
              locale={locale}
              equipment={equipment}
              applications={applications}
            />
          </div>

          <ProductRfqCTA
            locale={locale}
            quoteHref={`/${locale}/quote`}
            product={{
              id: product.id,
              partNo: product.partNo ?? "",
              brand: product.brand,
              title: product.title,
            }}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
