import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import SearchEventTracker from "@/components/analytics/SearchEventTracker";
import SearchResultsDataLayer from "@/components/analytics/SearchResultsDataLayer";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
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
import { isPreliminaryRelation } from "@/lib/products/relations";
import {
  searchFocusedProducts,
  type SearchResult,
} from "@/lib/search/search";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; request?: string }>;
};

const DEFAULT_PRODUCT_LIMIT = 24;
const SEARCH_RESULT_LIMIT = 48;
const INITIAL_RENDER_COUNT = 12;
const LOCALES = ["th", "en"] as const;
const SITE_URL = "https://www.mrtsupplier.com";
const LINE_URL = "https://lin.ee/S676yYH";

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

function isReferenceMatchType(matchType: string | null) {
  return matchType === "Cross Ref" || matchType === "Same-brand Ref";
}

function isPreliminaryRelationResult(product: Product | SearchResult | undefined) {
  if (
    !product ||
    !("_matchedRelation" in product) ||
    !isReferenceMatchType(getResultMatchType(product))
  ) {
    return false;
  }

  return isPreliminaryRelation(product._matchedRelation);
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
      ]
    : [
        "Search by Part No.",
        "Search by Cross Reference",
      ];

  const visibleProducts: Array<Product | SearchResult> = hasQuery
    ? searchFocusedProducts(query, { limit: SEARCH_RESULT_LIMIT }).map((hit) =>
        hydrateSearchHit(hit, products),
      )
    : products.slice(0, DEFAULT_PRODUCT_LIMIT);
  const hasPreliminaryRelationResults =
    hasQuery &&
    visibleProducts.some((product) => isPreliminaryRelationResult(product));
  const showMissingProductRequest =
    requestMissingProduct || visibleProducts.length === 0;
  const initialVisibleCount = Math.min(
    INITIAL_RENDER_COUNT,
    visibleProducts.length,
  );
  const resultCountText = hasQuery
    ? isThai
      ? visibleProducts.length === SEARCH_RESULT_LIMIT
        ? `แสดงผลลัพธ์ที่ตรงที่สุด ${visibleProducts.length} รายการ โดยแสดง ${initialVisibleCount} รายการแรกด้านล่าง`
        : `พบ ${visibleProducts.length} รายการ โดยแสดง ${initialVisibleCount} รายการแรกด้านล่าง`
      : visibleProducts.length === SEARCH_RESULT_LIMIT
        ? `Showing the top ${visibleProducts.length} matches, with the first ${initialVisibleCount} below.`
        : `${visibleProducts.length} matches, with the first ${initialVisibleCount} below.`
    : isThai
      ? `รายการแนะนำ ${visibleProducts.length} รายการ โดยแสดง ${initialVisibleCount} รายการแรกด้านล่าง`
      : `${visibleProducts.length} recommended items, with the first ${initialVisibleCount} below.`;

  return (
    <div className="mrt-blueprint-shell min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 xl:px-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {isThai ? "ค้นหาสินค้า" : "Find Parts Fast"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
            {isThai
              ? "ค้นหาด้วยเบอร์สินค้า เบอร์เดิม หรือใช้ฟังก์ชันเทียบเบอร์"
              : "Search by product number, existing part number, or cross-reference."}
          </p>

          <div className="-mx-4 sticky top-[64px] z-40 mt-5 border-y border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 backdrop-blur md:static md:z-auto md:mx-0 md:border-y-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
            <SearchBar locale={locale} defaultValue={query} autoFocus={false} />
          </div>

          <MultiPartNumberSearch locale={locale} />

          <div className="mt-4 flex max-w-4xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {searchGuidance.map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]"
                >
                  {label}
                </span>
              ))}
              <a
                href={`/${locale}/products/dimensions`}
                className="inline-flex rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-text-inverse)]"
              >
                {isThai ? "ค้นหาด้วยขนาดไส้กรอง" : "Search filters by dimensions"}
              </a>
            </div>

            <a
              href={missingProductHref}
              className="inline-flex w-fit rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {isThai
                ? "ไม่มี Part Number? ส่งข้อมูลให้ทีมช่วยหาเทียบ"
                : "No part number? Send details for our team to identify"}
            </a>
          </div>

          {hasPreliminaryRelationResults ? (
            <div className="mt-4 max-w-4xl rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-3 text-sm shadow-[var(--shadow-sm)] sm:px-4">
              <div className="font-semibold text-[var(--color-text)]">
                {isThai ? "ข้อมูลอ้างอิง" : "Reference information"}
              </div>
              <p className="mt-1 leading-5 text-[var(--color-text-muted)]">
                {isThai
                  ? "ผลลัพธ์นี้ค้นพบจากเบอร์อ้างอิง กรุณาตรวจสอบรุ่นและสเปกก่อนสั่งซื้อ"
                  : "These results were found through reference data. Verify the model and specifications before ordering."}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="results"
        className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-6 sm:px-6 sm:py-8 xl:px-8"
      >
        <div className="mb-5 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[var(--shadow-sm)] sm:mb-6 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {hasQuery
                  ? isThai
                    ? "ผลการค้นหา"
                    : "Search Results"
                  : isThai
                    ? "รายการแนะนำ"
                    : "Recommended List"}
              </div>

              <div className="mt-1 text-sm font-medium leading-6 text-[var(--color-text)]">
                {hasQuery
                  ? isThai
                    ? `พบผลลัพธ์สำหรับ "${query}"`
                    : `Results for "${query}"`
                  : isThai
                    ? "รายการเริ่มต้นสำหรับค้นหาและขอใบเสนอราคาได้เร็วขึ้น"
                    : "A faster starting list for search and RFQ"}
              </div>

              <div className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                {resultCountText}
              </div>
            </div>

            {hasQuery && (
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {query}
                </span>
                <a
                  href={`/${locale}/products`}
                  className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
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
              <div className="mb-5 rounded-[var(--mrt-radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-6 text-center sm:mb-6">
                <p className="text-base font-medium text-[var(--color-text)]">
                  {isThai
                    ? "ยังไม่พบสินค้าที่ตรงกับคำค้นหา"
                    : "No matching product found"}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {isThai
                    ? "ส่ง Part Number, Cross Reference, รูปสินค้า หรือข้อมูลการใช้งานให้ทีม MRT ช่วยตรวจสอบได้"
                    : "Send the part number, cross reference, product photo, or application details for our team to check."}
                </p>
                <TrackedLineLink
                  href={LINE_URL}
                  source="search_no_results"
                  locale={locale}
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-[var(--color-success)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-success-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {isThai
                    ? "ให้ทีมช่วยค้นหาทาง LINE"
                    : "Ask our team to search on LINE"}
                </TrackedLineLink>
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

        {hasQuery ? (
          <SearchResultsDataLayer
            query={query}
            locale={locale}
            products={visibleProducts}
          />
        ) : null}

        {visibleProducts.length > 0 && (
          <ProductListClient
            products={visibleProducts}
            locale={locale}
            initialCount={INITIAL_RENDER_COUNT}
            incrementCount={12}
            searchQuery={hasQuery ? query : ""}
          />
        )}
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
