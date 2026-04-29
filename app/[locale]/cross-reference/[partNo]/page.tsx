import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProductHero from "@/components/products/ProductHero";
import { products } from "@/data/products/index";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ locale: string; partNo: string }>;
};

export function generateStaticParams() {
  const locales = ["en", "th"];

  return products.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      partNo: product.partNo,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { partNo, locale } = await params;
  const product = products.find((p: Product) => p.partNo === partNo);
  const isThai = locale === "th";

  if (!product) {
    return {
      title: isThai
        ? "ไม่พบรหัสเทียบ | MRT Supplier"
        : "Cross Reference Not Found | MRT Supplier",
      robots: { index: false, follow: false },
    };
  }

  const title = isThai
    ? `${product.partNo} รหัสเทียบ | MRT Supplier`
    : `${product.partNo} Cross Reference | MRT Supplier`;
  const description = isThai
    ? `ดูรหัสเทียบและสินค้าอ้างอิงสำหรับ ${product.partNo} พร้อมลิงก์ไปยังหน้าสินค้า`
    : `View compatible parts and cross reference information for ${product.partNo}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/cross-reference/${encodeURIComponent(product.partNo)}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, partNo } = await params;
  const product = products.find((p: Product) => p.partNo === partNo);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <ProductHero product={product} />
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
