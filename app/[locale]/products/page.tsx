import type { Metadata } from "next";
import SearchEventTracker from "@/components/analytics/SearchEventTracker";
import { getTranslations } from "next-intl/server";
import SearchNoResultsTracker from "@/components/analytics/SearchNoResultsTracker";
import MissingProductRequestForm from "@/components/products/MissingProductRequestForm";
import ProductListClient from "@/components/products/ProductListClient";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MultiPartNumberSearch from "@/components/search/MultiPartNumberSearch";
import SearchBar from "@/components/search/SearchBar";
import JsonLd from "@/components/seo/JsonLd";
import { products } from "@/data/products/index";
import { searchProducts, type SearchResult } from "@/lib/search/search";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; request?: string }>;
};

const DEFAULT_PRODUCT_LIMIT = 24;
const SEARCH_RESULT_LIMIT = 48;
const LOCALES = ["th", "en"] as const;
const SITE_URL = "https://mrtsupplier.com";

function getLocalizedAlternates(path: string) {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );
}

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
  const title = isThai
    ? "ค้นหาอะไหล่อุตสาหกรรมและฟิลเตอร์ | MRT Supplier"
    : "Search Industrial Parts and Filters | MRT Supplier";
  const description = isThai
    ? "ค้นหาสินค้าด้วย Part No., Cross Reference, ขนาด OD / ID / Length / Thread Size หรือส่งข้อมูลให้ทีม MRT Supplier ช่วยหาเทียบและเสนอราคา"
    : "Search products by part number, cross reference, OD, ID, length, or thread size. Send missing product details for MRT Supplier to help identify and quote.";
  const canonical = `${SITE_URL}/${locale}/products`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...getLocalizedAlternates("/products"),
        "x-default": `${SITE_URL}/th/products`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MRT Supplier",
      type: "website",
      locale: isThai ? "th_TH" : "en_US",
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isThai ? "หน้าแรก" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isThai ? "สินค้า" : "Products",
        item: `${SITE_URL}/${locale}/products`,
      },
    ],
  };
  const missingProductHref = `/${locale}/products${
    query
      ? `?q=${encodeURIComponent(query)}&request=1`
      : "?request=1"
  }#missing-product-request`;
  const searchGuidance = isThai
    ? [
        "ค้นหาด้วย Part No.",
        "ค้นหาด้วย Cross Reference",
        "ค้นหาด้วย OD / ID / Length / Thread Size",
      ]
    : [
        "Search by Part No.",
        "Search by Cross Reference",
        "Search by OD / ID / Length / Thread Size",
      ];

  const visibleProducts: Array<Product | SearchResult> = hasQuery
    ? searchProducts(query, { limit: SEARCH_RESULT_LIMIT }).map((hit) =>
        hydrateSearchHit(hit, products),
      )
    : products.slice(0, DEFAULT_PRODUCT_LIMIT);
  const hasExactPartNumberResult = hasQuery
    ? visibleProducts.some((product) => getResultMatchType(product) === "Exact")
    : false;
  const crossReferenceResults = hasQuery
    ? visibleProducts.filter(
        (product) => getResultMatchType(product) === "Cross Ref",
      )
    : [];
  const hasCrossReferenceResults =
    !hasExactPartNumberResult && crossReferenceResults.length > 0;
  const showMissingProductRequest =
    requestMissingProduct || visibleProducts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 xl:px-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {isThai ? "ค้นหาสินค้า" : "Find Parts Fast"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            {isThai
              ? "ค้นหาด้วย Part Number, Cross Reference หรือขนาดสินค้า แล้วเพิ่มรายการเพื่อขอใบเสนอราคาได้ทันที"
              : "Search by part number, cross reference, or dimensions, then add matching items to your quote request."}
          </p>

          <div className="-mx-4 sticky top-[64px] z-40 mt-5 border-y bg-white/95 px-4 py-2.5 backdrop-blur md:static md:z-auto md:mx-0 md:border-y-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
            <SearchBar locale={locale} defaultValue={query} />
          </div>

          <MultiPartNumberSearch locale={locale} />

          <div className="mt-4 flex max-w-4xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {searchGuidance.map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>

            <a
              href={missingProductHref}
              className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:border-blue-300 hover:bg-blue-100"
            >
              {isThai
                ? "ไม่มี Part Number? ส่งข้อมูลให้ทีมช่วยหาเทียบ"
                : "No part number? Send details for our team to identify"}
            </a>
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

        {hasCrossReferenceResults && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-sm sm:mb-6 sm:px-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.2a1 1 0 01-1.41 0L3.296 9.19a1 1 0 111.408-1.42l4.04 4.01 6.552-6.49a1 1 0 011.408 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-950">
                  {isThai ? "พบเบอร์เทียบแล้ว!" : "Reference matches found!"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {isThai
                    ? `พบสินค้าอ้างอิงจาก “${query}” จำนวน ${crossReferenceResults.length} รายการ`
                    : `Found ${crossReferenceResults.length} reference products for “${query}”`}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {isThai
                    ? "กรุณาตรวจสอบสเปคและการใช้งานก่อนสั่งซื้อ"
                    : "Please confirm specifications and application before ordering."}
                </p>
              </div>
            </div>
          </div>
        )}

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
                    ? "ยังไม่พบเบอร์เทียบในระบบ"
                    : "No reference match found in the system"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {isThai
                    ? "ส่ง Part Number ให้ทีม MRT ช่วยตรวจสอบเพิ่มเติมได้"
                    : "Send the part number to MRT for further checking."}
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
            searchQuery={hasCrossReferenceResults ? query : ""}
          />
        )}
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
