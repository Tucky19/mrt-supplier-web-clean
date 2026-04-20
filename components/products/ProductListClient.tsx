"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import AddToQuoteButton from "@/components/quote/AddToQuoteButton";
import {
  useProductSearch,
  type ProductSearchItem,
} from "@/hooks/useProductSearch";

const LINE_URL = "https://lin.ee/R3vfZW0";

function getStockLabel(
  status: ProductSearchItem["stockStatus"],
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

function getStockClass(status: ProductSearchItem["stockStatus"]) {
  if (status === "in_stock") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (status === "low_stock") {
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

export default function ProductListClient({
  locale,
  products,
  initialQuery = "",
  initialBrand = "",
  initialMode = "all",
}: {
  locale: string;
  products: ProductSearchItem[];
  initialQuery?: string;
  initialBrand?: string;
  initialMode?: string;
}) {
  const t = useTranslations("productsPage");
  const {
    query,
    setQuery,
    brandFilter,
    setBrandFilter,
    brands,
    isSearching,
    totalResults,
    visibleProducts,
    hasMoreResults,
    maxRenderedResults,
  } = useProductSearch({
    products,
    initialQuery,
    initialBrand,
    initialMode,
  });

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                {t("searchLabel")}
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                {t("brandLabel")}
              </label>

              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              >
                <option value="all">{t("allBrands")}</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>
              {t("results")}{" "}
              <span className="font-semibold text-slate-900">{totalResults}</span>
            </span>
            {isSearching ? (
              <span className="inline-flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                {locale === "th" ? "กำลังค้นหา..." : "Searching..."}
              </span>
            ) : null}
          </div>

          {hasMoreResults ? (
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {locale === "th"
                ? `แสดงผล ${maxRenderedResults} รายการแรกจากทั้งหมด ${totalResults} รายการ`
                : `Showing the first ${maxRenderedResults} of ${totalResults} results`}
            </p>
          ) : null}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              ไม่พบสินค้าที่ค้นหา
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              ส่ง Part Number หรือรายการสินค้ามาให้ทีมงานช่วยตรวจสอบเพิ่มเติมได้
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                ไปหน้าใบขอราคา (RFQ)
              </Link>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                ส่งรายการทาง LINE
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              const title =
                product.title || product.partNo || product.id || "Product";
              const effectiveStock = product.stockStatus ?? "in_stock";
              const stockLabel = getStockLabel(effectiveStock, locale);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="border-b border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.brand ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                          {product.brand}
                        </span>
                      ) : null}

                      {product.category ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {product.category}
                        </span>
                      ) : null}

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

                    <h3 className="mt-4 min-h-[56px] text-lg font-semibold leading-7 text-slate-900">
                      {title}
                    </h3>

                    {product.partNo ? (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">
                          {t("partNoLabel")}:
                        </span>{" "}
                        {product.partNo}
                      </p>
                    ) : null}
                  </div>

                  <div className="p-5">
                    <p className="min-h-[72px] text-sm leading-6 text-slate-600">
                      {product.spec || t("noSpec")}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/${locale}/products/${product.id}`}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        {t("viewDetail")}
                      </Link>

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
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        {locale === "th" ? "ดูใบขอราคา" : "View Quote"}
                      </Link>

                      {product.officialUrl ? (
                        <a
                          href={product.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                        >
                          {locale === "th" ? "เว็บทางการ" : "Official"}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
