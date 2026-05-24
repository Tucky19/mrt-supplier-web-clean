import type { Metadata } from "next";
import SearchEventTracker from "@/components/analytics/SearchEventTracker";
import { getTranslations } from "next-intl/server";
import SearchNoResultsTracker from "@/components/analytics/SearchNoResultsTracker";
import MissingProductRequestForm from "@/components/products/MissingProductRequestForm";
import ProductListClient from "@/components/products/ProductListClient";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SearchBar from "@/components/search/SearchBar";
import { products } from "@/data/products/index";
import { searchProducts, type SearchResult } from "@/lib/search/search";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; request?: string }>;
};

const DEFAULT_PRODUCT_LIMIT = 24;
const SEARCH_RESULT_LIMIT = 48;

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function hydrateSearchHit(hit: Product, catalog: Product[]) {
  const normalizedHit = normalizePartNo(hit.partNo);
  const activeProduct =
    catalog.find((product) => product.id === hit.id) ??
    catalog.find((product) => normalizePartNo(product.partNo) === normalizedHit);

  if (!activeProduct) return hit;

  return {
    ...hit,
    ...activeProduct,
    imageUrl: activeProduct.imageUrl ?? hit.imageUrl,
    spec: activeProduct.spec ?? hit.spec,
    specifications: activeProduct.specifications ?? hit.specifications,
    refs: activeProduct.refs ?? hit.refs ?? [],
    crossReferences:
      activeProduct.crossReferences ?? hit.crossReferences ?? [],
  };
}

function getResultMatchType(product: Product | SearchResult | undefined) {
  if (!product || !("_matchType" in product)) {
    return null;
  }

  return product._matchType;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai ? "ค้นหาสินค้า | MRT Supplier" : "Products | MRT Supplier",
    description: isThai
      ? "ค้นหาสินค้าด้วย Part Number, Cross Reference หรือชื่อสินค้า แล้วส่ง RFQ ได้ทันที"
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
  const requestMissingProduct = resolvedSearchParams?.request === "1";
  const hasQuery = query.length >= 2;
  const isThai = locale === "th";

  const visibleProducts: Array<Product | SearchResult> = hasQuery
    ? searchProducts(query, { limit: SEARCH_RESULT_LIMIT }).map((hit) =>
        hydrateSearchHit(hit, products),
      )
    : products.slice(0, DEFAULT_PRODUCT_LIMIT);
  const showMissingProductRequest =
    requestMissingProduct || visibleProducts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader locale={locale} />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 xl:px-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {isThai ? "ค้นหาสินค้า" : "Find Parts Fast"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            {isThai
              ? "ค้นหาด้วย Part Number, Cross Reference หรือชื่อสินค้า แล้วเพิ่มรายการเพื่อขอใบเสนอราคาได้ทันที"
              : "Search by part number or cross reference, then add matching items to your quote request."}
          </p>

          <div className="-mx-4 sticky top-[64px] z-40 mt-5 border-y bg-white/95 px-4 py-2.5 backdrop-blur md:static md:z-auto md:mx-0 md:border-y-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
            <SearchBar locale={locale} defaultValue={query} />
          </div>
        </div>
      </section>

      <section
        id="results"
        className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-6 sm:px-6 sm:py-8 xl:px-8"
      >
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:mb-6 sm:px-5 sm:py-4">
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

              <div className="mt-1 text-sm font-medium leading-6 text-slate-800">
                {hasQuery
                  ? isThai
                    ? `พบผลลัพธ์สำหรับ "${query}"`
                    : `Results for "${query}"`
                  : isThai
                    ? "รายการเริ่มต้นสำหรับค้นหาและขอใบเสนอราคาได้เร็วขึ้น"
                    : "A faster starting list for search and RFQ"}
              </div>

              <div className="mt-1 text-xs leading-5 text-slate-500">
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
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
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

        {showMissingProductRequest && (
          <div className={visibleProducts.length === 0 ? "" : "mb-6"}>
            {hasQuery ? (
              <SearchEventTracker
                query={query}
                locale={locale}
                resultCount={visibleProducts.length}
                matchType={getResultMatchType(visibleProducts[0])}
              />
            ) : null}

            {hasQuery && visibleProducts.length === 0 ? (
              <SearchNoResultsTracker
                searchTerm={query}
                locale={locale}
                source="products_page"
              />
            ) : null}

            {visibleProducts.length === 0 && (
              <div className="mb-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-6 text-center sm:mb-6">
                <p className="text-base font-medium text-slate-900">
                  {isThai
                    ? "ยังไม่พบสินค้าที่ค้นหา"
                    : "We couldn't find that product yet"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {isThai
                    ? "หากยังไม่มีเบอร์หรือยังไม่เจอสินค้าที่ตรง ส่งรายละเอียดให้ทีมช่วยหาเทียบได้ทันที"
                    : "If you do not have a part number or the result is still missing, send the details and our team can help identify it."}
                </p>
              </div>
            )}

            <MissingProductRequestForm
              locale={locale}
              defaultPartNo=""
              searchQuery={hasQuery && visibleProducts.length === 0 ? query : ""}
              compactIntro={visibleProducts.length === 0}
            />
          </div>
        )}

        {hasQuery && !showMissingProductRequest ? (
          <SearchEventTracker
            query={query}
            locale={locale}
            resultCount={visibleProducts.length}
            matchType={getResultMatchType(visibleProducts[0])}
          />
        ) : null}

        {visibleProducts.length > 0 && (
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
