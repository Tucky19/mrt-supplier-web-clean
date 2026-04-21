"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/products/ProductCard";
import {
  useProductSearch,
  type ProductSearchItem,
} from "@/hooks/useProductSearch";

const LINE_URL = "https://lin.ee/R3vfZW0";

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
                {locale === "th" ? "เธเธณเธฅเธฑเธเธเนเธเธซเธฒ..." : "Searching..."}
              </span>
            ) : null}
          </div>

          {hasMoreResults ? (
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {locale === "th"
                ? `เนเธชเธ”เธเธเธฅ ${maxRenderedResults} เธฃเธฒเธขเธเธฒเธฃเนเธฃเธเธเธฒเธเธ—เธฑเนเธเธซเธกเธ” ${totalResults} เธฃเธฒเธขเธเธฒเธฃ`
                : `Showing the first ${maxRenderedResults} of ${totalResults} results`}
            </p>
          ) : null}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              เนเธกเนเธเธเธชเธดเธเธเนเธฒเธ—เธตเนเธเนเธเธซเธฒ
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              เธชเนเธ Part Number เธซเธฃเธทเธญเธฃเธฒเธขเธเธฒเธฃเธชเธดเธเธเนเธฒเธกเธฒเนเธซเนเธ—เธตเธกเธเธฒเธเธเนเธงเธขเธ•เธฃเธงเธเธชเธญเธเน€เธเธดเนเธกเน€เธ•เธดเธกเนเธ”เน
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                เนเธเธซเธเนเธฒเนเธเธเธญเธฃเธฒเธเธฒ (RFQ)
              </Link>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                เธชเนเธเธฃเธฒเธขเธเธฒเธฃเธ—เธฒเธ LINE
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                locale={locale}
                product={{
                  id: product.id,
                  partNo: product.partNo ?? "",
                  brand: product.brand ?? "",
                  category: product.category ?? "",
                  title: product.title ?? product.partNo ?? product.id,
                  spec: product.spec,
                  crossReferences: product.refs,
                  officialUrl: product.officialUrl,
                  stockStatus: product.stockStatus,
                }}
                variant="search"
                showOfficialLink
                showCrossReferences
                showEquipment
                showStockStatus
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
