import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import JsonLd from "@/components/seo/JsonLd";
import {
  brandTrademarkNote,
  brandsIndexHeroCopy,
  getBrandCtaHref,
  getBrandsIndexItems,
} from "@/data/brands";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = "https://www.mrtsupplier.com";
const LOCALES = ["th", "en"] as const;
const lightFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";

function getLocalizedAlternates(path: string) {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";
  const title = isThai
    ? "แบรนด์สินค้าอุตสาหกรรม | MRT Supplier"
    : "Industrial Brands | MRT Supplier";
  const description = isThai ? brandsIndexHeroCopy.th : brandsIndexHeroCopy.en;
  const canonical = `${SITE_URL}/${locale}/brands`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...getLocalizedAlternates("/brands"),
        "x-default": `${SITE_URL}/th/brands`,
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

export default async function BrandsPage({ params }: PageProps) {
  const { locale } = await params;
  const isThai = locale === "th";
  const title = isThai ? "แบรนด์สินค้า" : "Brands";
  const productsLabel = isThai ? "ค้นหาสินค้า" : "Search products";
  const quoteLabel = isThai ? "ขอใบเสนอราคา" : "Request quote";
  const brandItems = getBrandsIndexItems();
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
        name: title,
        item: `${SITE_URL}/${locale}/brands`,
      },
    ],
  };

  return (
    <main className="mrt-blueprint-shell min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader locale={locale} />

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              MRT Supplier
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
              {isThai ? brandsIndexHeroCopy.th : brandsIndexHeroCopy.en}
            </p>
          </div>
        </div>
      </section>

      <section className="mrt-blueprint-section border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {brandItems.map((brand) => (
              <article
                key={brand.slug}
                className="flex min-w-0 flex-col rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-28 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5">
                  <div className="relative h-16 w-full">
                    <Image
                      src={brand.logoPath}
                      alt={brand.displayName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-1 flex-col">
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    {brand.displayName}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    {isThai ? brand.summary.th : brand.summary.en}
                  </p>
                  {brand.cta.helper ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                      {isThai ? brand.cta.helper.th : brand.cta.helper.en}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href={getBrandCtaHref(brand, locale)}
                      className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] ${lightFocusClass}`}
                    >
                      {isThai ? brand.cta.label.th : brand.cta.label.en}
                    </Link>
                    {brand.supplyMode === "catalog" ? (
                      <Link
                        href={`/${locale}/quote`}
                        className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
                      >
                        {quoteLabel}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] px-5 py-4 text-sm leading-7 text-[var(--color-text-muted)]">
            {isThai ? brandTrademarkNote.th : brandTrademarkNote.en}
          </div>
        </div>
      </section>

      <section className="mrt-blueprint-section-strong border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {isThai
                ? "ต้องการค้นหาด้วย Part No. หรือ Cross Reference?"
                : "Need to search by Part No. or Cross Reference?"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
              {isThai
                ? "ค้นหาสินค้าใน catalog หรือส่ง RFQ ให้ทีมงานช่วยตรวจสอบรายการที่ต้องการ"
                : "Search the catalog or send an RFQ for the team to review your required items."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/products`}
              className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] ${lightFocusClass}`}
            >
              {productsLabel}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] ${lightFocusClass}`}
            >
              {quoteLabel}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
