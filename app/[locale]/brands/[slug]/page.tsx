import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products as catalogProducts } from "@/data/products/index";
import { getBrandBySlug } from "@/data/brands/index";
import ProductCard from "@/components/products/ProductCard";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.SITE_URL?.replace(/\/+$/, "") ||
    "https://mrtsupplier.com"
  );
}

function getCanonicalBrandPath(locale: string, slug: string) {
  return `/${locale}/brands/${encodeURIComponent(slug)}`;
}

function getCanonicalBrandUrl(locale: string, slug: string) {
  return `${getBaseUrl()}${getCanonicalBrandPath(locale, slug)}`;
}

function getLocaleForMetadata(locale: string) {
  return locale === "th" ? "th_TH" : "en_US";
}

function getBrandOgImageUrl(
  locale: string,
  name: string,
  subtitle: string
) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og/brand?locale=${encodeURIComponent(
    locale
  )}&name=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(subtitle)}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return {
      title:
        locale === "th"
          ? "ไม่พบแบรนด์ | MRT Supplier"
          : "Brand Not Found | MRT Supplier",
      description:
        locale === "th"
          ? "ไม่พบหน้าแบรนด์ที่คุณกำลังค้นหา"
          : "The brand page you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    brand.ogSubtitle ||
    (locale === "th"
      ? `จัดหาสินค้า ${brand.name} พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา`
      : `${brand.name} industrial parts sourcing with verification support before quotation.`);

  const canonicalUrl = getCanonicalBrandUrl(locale, brand.slug);
  const ogImageUrl = getBrandOgImageUrl(locale, brand.name, description);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: `${brand.name} | MRT Supplier`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "th-TH": getCanonicalBrandPath("th", brand.slug),
        "en-US": getCanonicalBrandPath("en", brand.slug),
      },
    },
    openGraph: {
      title: `${brand.name} | MRT Supplier`,
      description,
      url: canonicalUrl,
      siteName: "MRT Supplier",
      locale: getLocaleForMetadata(locale),
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${brand.name} | MRT Supplier`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} | MRT Supplier`,
      description,
      images: [ogImageUrl],
    },
    other: {
      "og:image:alt": `${brand.name} | MRT Supplier`,
    },
  };
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const brandProducts = catalogProducts.filter(
    (product) =>
      product.brand?.trim().toLowerCase() === brand.name.trim().toLowerCase()
  );

  const labels = {
    back: locale === "th" ? "กลับไปหน้าแบรนด์" : "Back to brands",
    title:
      locale === "th"
        ? "แบรนด์สินค้าที่เราจัดหา"
        : "Brands We Source",
    trust1:
      locale === "th"
        ? "ช่วยตรวจสอบรหัสสินค้า"
        : "Part verification support",
    trust2:
      locale === "th"
        ? "ช่วยเทียบเบอร์"
        : "Cross-reference support",
    trust3:
      locale === "th"
        ? "ตอบกลับรวดเร็ว"
        : "Fast response",
    emptyTitle:
      locale === "th"
        ? "ยังไม่มีรายการสินค้าในขณะนี้"
        : "No products available yet",
    emptyDesc:
      locale === "th"
        ? "สามารถส่งคำขอเพื่อให้ทีมงานช่วยค้นหาและเสนอราคาได้"
        : "You can submit a request and our team will help source and quote.",
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/${locale}/brands`}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← {labels.back}
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {labels.title}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {brand.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {labels.trust1}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {labels.trust2}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {labels.trust3}
              </span>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            {brandProducts.length > 0 ? (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {brandProducts.map((product) => (
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
        </section>
      </div>
    </main>
  );
}