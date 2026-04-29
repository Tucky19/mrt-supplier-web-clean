import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductListClient from "@/components/products/ProductListClient";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SearchBar from "@/components/search/SearchBar";
import { products } from "@/data/products/index";
import { searchProducts } from "@/lib/search/search";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string }>;
};

const DEFAULT_PRODUCT_LIMIT = 24;
const SEARCH_RESULT_LIMIT = 48;

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai ? "ค้นหาสินค้า | MRT Supplier" : "Products | MRT Supplier",
    description: isThai
      ? "ค้นหาสินค้าอุตสาหกรรมด้วย Part Number หรือ Cross Reference และส่ง RFQ ได้ทันที"
      : "Search industrial parts by part number or cross reference and request a quotation quickly.",
    alternates: {
      canonical: `/${locale}/products`,
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  await getTranslations({ locale });

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const hasQuery = query.length >= 2;
  const isThai = locale === "th";

  const visibleProducts: Product[] = hasQuery
    ? searchProducts(query, { limit: SEARCH_RESULT_LIMIT }).map((hit) => {
        const normalizedHit = normalizePartNo(hit.partNo);

        return (
          products.find(
            (product) =>
              product.id === hit.id ||
              normalizePartNo(product.partNo) === normalizedHit
          ) ?? hit
        );
      })
    : products.slice(0, DEFAULT_PRODUCT_LIMIT);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader locale={locale} />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {isThai ? "ค้นหาสินค้า" : "Find Parts Fast"}
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            {isThai
              ? "ค้นหาด้วย Part Number หรือ Cross Reference แล้วเพิ่มรายการเพื่อขอใบเสนอราคาได้ทันที"
              : "Search by part number or cross reference, then add matching items to your quote request."}
          </p>

          <div className="-mx-4 sticky top-[72px] z-40 mt-6 border-y bg-white/95 px-4 py-3 backdrop-blur md:static md:z-auto md:mx-0 md:border-y-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
            <SearchBar defaultValue={query} />
          </div>
        </div>
      </section>

      <section
        id="results"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8"
      >
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {hasQuery
                  ? isThai
                    ? "ผลการค้นหา"
                    : "Search Results"
                  : isThai
                    ? "รายการแนะนำ"
                    : "Recommended List"}
              </div>

              <div className="mt-1 text-sm font-medium text-slate-800">
                {hasQuery
                  ? isThai
                    ? `พบผลลัพธ์สำหรับ "${query}"`
                    : `Results for "${query}"`
                  : isThai
                    ? "รายการเริ่มต้นสำหรับค้นหาและขอราคาได้เร็วขึ้น"
                    : "A faster starting list for search and RFQ"}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {hasQuery
                  ? isThai
                    ? `${visibleProducts.length} รายการ`
                    : `${visibleProducts.length} items`
                  : isThai
                    ? `แสดง ${visibleProducts.length} รายการแรก เพื่อให้ไล่ดูได้เร็วขึ้น`
                    : `Showing the first ${visibleProducts.length} items to keep scanning fast.`}
              </div>
            </div>

            {hasQuery && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {query}
                </span>
                <a
                  href={`/${locale}/products`}
                  className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {isThai ? "ล้างคำค้น" : "Clear search"}
                </a>
              </div>
            )}
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-900">
              {isThai
                ? "ส่ง Part Number มาให้เรา เดี๋ยวเราช่วยตรวจสอบให้"
                : "Send us your part number, we will check for you"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {isThai
                ? "หากยังไม่พบสินค้าที่ต้องการ คุณสามารถขอใบเสนอราคา หรือกลับไปเริ่มค้นหาใหม่จากหน้าแรกได้"
                : "If you do not see the part you need yet, request a quote or go back home to start a new search."}
            </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a
                  href={
                    hasQuery
                      ? `/${locale}/quote?partNo=${encodeURIComponent(query)}`
                      : `/${locale}/quote`
                  }
                  className="inline-flex rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
              </a>

              <a
                href={`/${locale}`}
                className="inline-flex rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {isThai ? "กลับหน้าแรก" : "Back to Home"}
              </a>
            </div>
          </div>
        ) : (
          <ProductListClient
            products={visibleProducts}
            locale={locale}
            initialCount={12}
            incrementCount={12}
          />
        )}
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
