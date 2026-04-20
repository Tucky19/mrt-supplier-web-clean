import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import * as productSource from "@/data/products";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProductListClient from "@/components/products/ProductListClient";

type Product = {
  id: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  image?: string;
  officialUrl?: string;
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; brand?: string; mode?: string }>;
};

function resolveProducts(): Product[] {
  const source = productSource as Record<string, unknown>;

  if (Array.isArray(source.default)) {
    return source.default as Product[];
  }

  if (Array.isArray(source.products)) {
    return source.products as Product[];
  }

  if (Array.isArray(source.allProducts)) {
    return source.allProducts as Product[];
  }

  if (Array.isArray(source.featuredProducts)) {
    return source.featuredProducts as Product[];
  }

  return [];
}

const products = resolveProducts();

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "th"
        ? "สินค้าของเรา | MRT Supplier"
        : "Our Products | MRT Supplier",
    description:
      locale === "th"
        ? "รวมสินค้าอะไหล่อุตสาหกรรมจากแบรนด์ที่เชื่อถือได้ พร้อมข้อมูลพื้นฐานเพื่อช่วยให้ค้นหาและส่งขอราคาได้รวดเร็วขึ้น"
        : "Browse industrial spare parts from trusted brands with essential information to help you search and request quotations more efficiently.",
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { q = "", brand = "", mode } = await searchParams;

  const t = await getTranslations({
    locale,
    namespace: "productsPage",
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              MRT Supplier
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {t("title")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <ProductListClient
        locale={locale}
        products={products}
        initialQuery={q}
        initialBrand={brand}
        initialMode={mode}
      />

      <SiteFooter />
    </main>
  );
}
