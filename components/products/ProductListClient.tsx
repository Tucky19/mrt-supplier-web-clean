"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";

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

type ProductListClientProps = {
  locale: string;
  products: Product[];
  initialQuery: string;
  initialBrand: string;
  initialMode?: string;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

export default function ProductListClient({
  locale,
  products,
  initialQuery,
  initialBrand,
  initialMode,
}: ProductListClientProps) {
  const safeProducts = Array.isArray(products) ? products : [];

  const [query, setQuery] = useState(initialQuery ?? "");
  const [brand, setBrand] = useState(initialBrand ?? "");
  const [mode, setMode] = useState(initialMode ?? "all");

  const labels = {
    title: locale === "th" ? "สินค้าทั้งหมด" : "All Products",
    subtitle:
      locale === "th"
        ? "ค้นหาและกรองสินค้าเพื่อดูรายละเอียดหรือเพิ่มลงในใบขอราคา"
        : "Search and filter products to view details or add them to your RFQ.",
    searchPlaceholder:
      locale === "th" ? "ค้นหาด้วยรหัสสินค้า ชื่อ หรือสเปก" : "Search by part number, title, or spec",
    brandPlaceholder: locale === "th" ? "ทุกแบรนด์" : "All brands",
    modePlaceholder: locale === "th" ? "ทุกประเภท" : "All types",
    allModes: locale === "th" ? "ทั้งหมด" : "All",
    exactMode: locale === "th" ? "รหัสสินค้า" : "Part Number",
    generalMode: locale === "th" ? "ทั่วไป" : "General",
    found:
      locale === "th"
        ? "รายการที่พบ"
        : "Results",
    emptyTitle:
      locale === "th" ? "ไม่พบสินค้าที่ตรงเงื่อนไข" : "No matching products found",
    emptyDesc:
      locale === "th"
        ? "ลองเปลี่ยนคำค้นหา แบรนด์ หรือประเภทการค้นหา"
        : "Try adjusting your keyword, brand, or search mode.",
    clear: locale === "th" ? "ล้างตัวกรอง" : "Clear filters",
  };

  const brandOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        safeProducts
          .map((product) => product.brand?.trim())
          .filter((value): value is string => Boolean(value))
      )
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [safeProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    const normalizedBrand = brand.trim().toLowerCase();

    return safeProducts.filter((product) => {
      const matchesBrand =
        !normalizedBrand ||
        product.brand?.trim().toLowerCase() === normalizedBrand;

      if (!matchesBrand) return false;

      if (!normalizedQuery) return true;

      const partNo = product.partNo ?? "";
      const title = product.title ?? "";
      const spec = product.spec ?? "";
      const category = product.category ?? "";
      const refs = Array.isArray(product.refs) ? product.refs.join(" ") : "";

      const searchableText = normalizeText(
        [partNo, title, spec, category, refs, product.brand ?? ""].join(" ")
      );

      const normalizedPartNo = normalizeText(partNo);

      if (mode === "part") {
        return (
          normalizedPartNo === normalizedQuery ||
          normalizedPartNo.startsWith(normalizedQuery) ||
          searchableText.includes(normalizedQuery)
        );
      }

      return searchableText.includes(normalizedQuery);
    });
  }, [safeProducts, query, brand, mode]);

  const handleClearFilters = () => {
    setQuery("");
    setBrand("");
    setMode("all");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {labels.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            {labels.subtitle}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {locale === "th" ? "ค้นหา" : "Search"}
            </label>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {locale === "th" ? "แบรนด์" : "Brand"}
            </label>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              <option value="">{labels.brandPlaceholder}</option>
              {brandOptions.map((brandOption) => (
                <option key={brandOption} value={brandOption}>
                  {brandOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {locale === "th" ? "โหมด" : "Mode"}
            </label>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              <option value="all">{labels.allModes}</option>
              <option value="part">{labels.exactMode}</option>
              <option value="general">{labels.generalMode}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            {labels.found}:{" "}
            <span className="font-semibold text-slate-950">
              {filteredProducts.length}
            </span>
          </p>

          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            {labels.clear}
          </button>
        </div>
      </section>

      {filteredProducts.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.partNo}
              locale={locale}
              product={product}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            {labels.emptyTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {labels.emptyDesc}
          </p>
        </section>
      )}
    </div>
  );
}