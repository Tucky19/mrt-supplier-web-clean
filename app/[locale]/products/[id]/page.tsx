import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { products as catalogProducts } from "@/data/products/index";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const LOCALES = ["th", "en"] as const;
const SITE_URL = "https://mrtsupplier.com";

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function getLocalizedAlternates(path: string) {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `/${locale}${path}`]),
  );
}

function getAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getProductDescription(product: Product) {
  return (
    product.description?.trim() ||
    product.shortDescription?.trim() ||
    product.spec?.trim() ||
    `${product.brand} ${product.partNo}`
  );
}

function getProductImage(product: Product) {
  if (!product.imageUrl || product.imageUrl === "/images/placeholder.jpg") {
    return null;
  }

  return getAbsoluteUrl(product.imageUrl);
}

function getProductJsonLd(product: Product, locale: string) {
  const productUrl = `${SITE_URL}/${locale}/products/${encodeURIComponent(
    product.partNo,
  )}`;
  const image = getProductImage(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.partNo}`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    sku: product.partNo,
    category: product.category,
    description: getProductDescription(product),
    url: productUrl,
    ...(image ? { image } : {}),
  };
}

function getBreadcrumbJsonLd(product: Product, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "th" ? "หน้าแรก" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "th" ? "สินค้า" : "Products",
        item: `${SITE_URL}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${product.brand} ${product.partNo}`,
        item: `${SITE_URL}/${locale}/products/${encodeURIComponent(
          product.partNo,
        )}`,
      },
    ],
  };
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

  return products.flatMap((product) =>
    LOCALES.map((locale) => ({
      locale,
      id: product.partNo,
    })),
  );
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
      languages: {
        ...getLocalizedAlternates(
          `/products/${encodeURIComponent(product.partNo)}`,
        ),
        "x-default": `/th/products/${encodeURIComponent(product.partNo)}`,
      },
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
      <JsonLd data={getBreadcrumbJsonLd(product, locale)} />
      <JsonLd data={getProductJsonLd(product, locale)} />
      <Suspense fallback={<div className="h-[72px] bg-white" />}>
        <SiteHeader locale={locale} />
      </Suspense>

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
