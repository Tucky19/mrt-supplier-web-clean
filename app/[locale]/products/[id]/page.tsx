import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { products as catalogProducts } from "@/data/products/index";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function findProductById(id: string) {
  const decodedId = decodeURIComponent(id);
  const normalizedId = normalizePartNo(decodedId);
  const products = Array.isArray(catalogProducts) ? catalogProducts : [];

  return products.find((product: Product) => {
    const partNo = product.partNo ?? "";

    return (
      product.id === decodedId ||
      partNo.toLowerCase() === decodedId.toLowerCase() ||
      normalizePartNo(partNo) === normalizedId
    );
  });
}

function hasIndexableProductSignals(product: Product) {
  const hasSpec = Boolean(product.spec?.trim());
  const hasRefs = Boolean(
    [...(product.refs ?? []), ...(product.crossReferences ?? [])]
      .map((value) => value.trim())
      .filter(Boolean).length
  );

  return hasSpec || hasRefs;
}

export function generateStaticParams() {
  const products = Array.isArray(catalogProducts) ? catalogProducts : [];

  return products.map((product) => ({
    id: product.partNo,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = findProductById(id);
  const isThai = locale === "th";

  if (!product) {
    return {
      title: isThai
        ? "ไม่พบสินค้า | MRT Supplier"
        : "Product Not Found | MRT Supplier",
      robots: { index: false, follow: false },
    };
  }

  const shouldNoIndex = !hasIndexableProductSignals(product);
  const title = `${product.partNo} | ${product.brand} Filter`;
  const description = isThai
    ? `ค้นหา ${product.partNo} พร้อมข้อมูล OEM cross reference และส่งคำขอใบเสนอราคาได้ทันที`
    : `Find ${product.partNo} with OEM cross reference and request quote`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products/${encodeURIComponent(product.partNo)}`,
    },
    robots: shouldNoIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = findProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <ProductDetailClient
          locale={locale}
          product={product}
        />
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
