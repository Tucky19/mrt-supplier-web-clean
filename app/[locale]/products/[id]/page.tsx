import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { products as catalogProducts } from "@/data/products/index";
import AddToQuoteButton from "@/components/quote/AddToQuoteButton";
import { getProductImageUrl } from "@/lib/products/image";
type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function findProductByPartNoRoute(routeId: string) {
  const decodedId = decodeURIComponent(routeId);
  const normalizedId = normalizePartNo(decodedId);

  return (
    catalogProducts.find((product) => product.partNo === decodedId) ||
    catalogProducts.find(
      (product) => normalizePartNo(product.partNo) === normalizedId
    )
  );
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.SITE_URL?.replace(/\/+$/, "") ||
    "https://mrtsupplier.com"
  );
}

function getCanonicalProductPath(locale: string, partNo: string) {
  return `/${locale}/products/${encodeURIComponent(partNo)}`;
}

function getCanonicalProductUrl(locale: string, partNo: string) {
  return `${getBaseUrl()}${getCanonicalProductPath(locale, partNo)}`;
}

function getLocaleForMetadata(locale: string) {
  return locale === "th" ? "th_TH" : "en_US";
}

function getOgImageUrl(
  locale: string,
  product: {
    partNo: string;
    brand?: string;
    category?: string;
    title?: string;
  }
) {
  const baseUrl = getBaseUrl();
  const title = encodeURIComponent(product.partNo);
  const brand = encodeURIComponent(product.brand?.trim() || "MRT Supplier");
  const category = encodeURIComponent(
    product.category?.trim() || "Industrial Parts"
  );
  const subtitle = encodeURIComponent(
    product.title?.trim() || "Industrial parts and RFQ support"
  );

  return `${baseUrl}/api/og/product?locale=${encodeURIComponent(
    locale
  )}&title=${title}&brand=${brand}&category=${category}&subtitle=${subtitle}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = findProductByPartNoRoute(id);

  if (!product) {
    return {
      title:
        locale === "th"
          ? "ไม่พบสินค้า | MRT Supplier"
          : "Product Not Found | MRT Supplier",
      description:
        locale === "th"
          ? "ไม่พบสินค้าที่คุณกำลังค้นหา"
          : "The product you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const titleText = product.title?.trim() || product.partNo;
  const brandText = product.brand?.trim() || "MRT Supplier";
  const categoryText = product.category?.trim() || "Industrial Parts";
  const descriptionText =
    product.spec?.trim() ||
    product.category?.trim() ||
    (locale === "th"
      ? "รายละเอียดสินค้าและข้อมูลเบื้องต้นสำหรับส่งขอราคา"
      : "Product details and essential information for RFQ.");

  const canonicalUrl = getCanonicalProductUrl(locale, product.partNo);
  const ogImageUrl = getOgImageUrl(locale, product);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: `${product.partNo} | ${brandText} | MRT Supplier`,
    description: `${titleText} — ${descriptionText}`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "th-TH": getCanonicalProductPath("th", product.partNo),
        "en-US": getCanonicalProductPath("en", product.partNo),
      },
    },
    openGraph: {
      title: `${product.partNo} | ${brandText}`,
      description: `${titleText} — ${descriptionText}`,
      url: canonicalUrl,
      siteName: "MRT Supplier",
      locale: getLocaleForMetadata(locale),
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${product.partNo} | ${brandText}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.partNo} | ${brandText}`,
      description: `${titleText} — ${descriptionText}`,
      images: [ogImageUrl],
    },
    other: {
      "og:image:alt": `${product.partNo} | ${brandText}`,
    },
    keywords: [
      product.partNo,
      brandText,
      categoryText,
      titleText,
      "MRT Supplier",
      "RFQ",
      "industrial parts",
    ],
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = findProductByPartNoRoute(id);

  if (!product) {
    notFound();
  }

  const decodedId = decodeURIComponent(id);
  const canonicalPath = getCanonicalProductPath(locale, product.partNo);

  if (decodedId !== product.partNo) {
    redirect(canonicalPath);
  }

  const labels = {
    back: locale === "th" ? "กลับไปหน้าสินค้า" : "Back to products",
    partNo: locale === "th" ? "รหัสสินค้า (Part Number)" : "Part Number",
    brand: locale === "th" ? "แบรนด์" : "Brand",
    category: locale === "th" ? "หมวดหมู่" : "Category",
    spec: locale === "th" ? "สเปก" : "Specification",
    title: locale === "th" ? "ชื่อสินค้า" : "Product Title",
    refs: locale === "th" ? "เทียบเบอร์ (Cross-reference)" : "Cross References",
    official:
      locale === "th" ? "ดูข้อมูลจากผู้ผลิต" : "Official Product Page",
    imageFallback:
      locale === "th" ? "ไม่มีรูปสินค้า" : "No image available",
    rfqBadge: "RFQ Ready",
    rfqTitle:
      locale === "th"
        ? "ขอราคา / ให้ทีมช่วยตรวจสอบสินค้า"
        : "Request a quote or get product verification",
    rfqDesc:
      locale === "th"
        ? "เพิ่มรายการนี้เพื่อให้ทีมงานตรวจสอบความถูกต้องและเสนอราคาให้"
        : "Add this item to your RFQ list and our team will verify before quoting.",
    viewQuote: locale === "th" ? "ดูใบขอราคา" : "View quote",
    trustFast: locale === "th" ? "ตอบกลับรวดเร็ว" : "Fast response",
    trustVerify:
      locale === "th"
        ? "ตรวจสอบรุ่นก่อนเสนอราคา"
        : "Part verification before quote",
    trustCross:
      locale === "th"
        ? "ช่วยเทียบเบอร์ (Cross-reference)"
        : "Cross-reference support",
    trustTitle:
      locale === "th"
        ? "ไม่แน่ใจว่าใช่รุ่นนี้หรือไม่?"
        : "Not sure if this is the correct part?",
    trustDesc:
      locale === "th"
        ? "ไม่ต้องแน่ใจรุ่น 100% ก็สามารถส่งขอราคาได้ ทีมงานช่วยตรวจสอบก่อนเสนอราคา"
        : "You do not need to be 100% sure. Our team can verify before quoting.",
    nextStepTitle:
      locale === "th" ? "ขั้นตอนหลังเพิ่มรายการ" : "What happens next",
    nextStep1:
      locale === "th"
        ? "ทีมงานตรวจสอบรหัสสินค้า"
        : "Our team verifies the part number",
    nextStep2:
      locale === "th"
        ? "เทียบเบอร์หากจำเป็น"
        : "Cross-reference if needed",
    nextStep3:
      locale === "th"
        ? "เสนอราคาและติดต่อกลับ"
        : "Quote and follow up",
    readyTitle: locale === "th" ? "พร้อมขอราคาแล้ว?" : "Ready to request?",
    leadTime:
      locale === "th"
        ? "⚡ สินค้าบางรุ่นมี lead time — แนะนำส่งขอราคาก่อน"
        : "⚡ Some items may have lead time — sending RFQ early is recommended.",
  };

  const titleText = product.title?.trim() || product.partNo;
  const specText = product.spec?.trim() || "-";
  const brandText = product.brand?.trim() || "-";
  const categoryText = product.category?.trim() || "-";

  const refs = Array.isArray(product.refs)
    ? product.refs.filter(Boolean)
    : Array.isArray((product as { crossReferences?: string[] }).crossReferences)
      ? ((product as { crossReferences?: string[] }).crossReferences ?? []).filter(
          Boolean
        )
      : [];

  const officialUrl =
    typeof product.officialUrl === "string" ? product.officialUrl.trim() : "";

 const explicitImageUrl =
  typeof (product as { imageUrl?: string }).imageUrl === "string"
    ? (product as { imageUrl?: string }).imageUrl?.trim() || ""
    : "";

const imageUrl = explicitImageUrl || getProductImageUrl(product.partNo);
  const quoteProduct = {
    id: product.id,
    partNo: product.partNo,
    brand: product.brand,
    title: product.title,
  };

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← {labels.back}
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
            <div className="flex flex-wrap items-center gap-2">
              {brandText !== "-" ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700">
                  {brandText}
                </span>
              ) : null}

              {categoryText !== "-" ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {categoryText}
                </span>
              ) : null}

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {labels.rfqBadge}
              </span>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {labels.partNo}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {product.partNo}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {titleText}
            </p>

            <div className="mt-5 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">
                ✔ {labels.trustDesc}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-emerald-800">
                <li>• {labels.trustVerify}</li>
                <li>• {labels.trustCross}</li>
                <li>• {labels.trustFast}</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.partNo}
                    className="max-h-64 object-contain"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                    {labels.imageFallback}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {labels.brand}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {brandText}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {labels.category}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {categoryText}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {labels.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-800">
                  {titleText}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {labels.spec}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-800">
                  {specText}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {labels.readyTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {labels.rfqDesc}
                </p>
                <div className="mt-4">
                  <AddToQuoteButton product={quoteProduct} />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-emerald-900">
                  {labels.trustTitle}
                </p>
                <p className="mt-2 text-sm leading-7 text-emerald-800">
                  {labels.trustDesc}
                </p>
              </div>

              {refs.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {labels.refs}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {refs.map((ref) => (
                      <span
                        key={ref}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {officialUrl ? (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-medium text-sky-700 transition hover:text-sky-900"
                  >
                    {labels.official} ↗
                  </a>
                </div>
              ) : null}
            </div>

            <aside>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:sticky lg:top-6">
                <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {labels.rfqBadge}
                </div>

                <p className="text-base font-semibold text-slate-900">
                  {labels.rfqTitle}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {labels.rfqDesc}
                </p>

                <p className="mt-2 text-xs text-amber-600">
                  {labels.leadTime}
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <span>{labels.trustVerify}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <span>{labels.trustCross}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <span>{labels.trustFast}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <AddToQuoteButton product={quoteProduct} />
                </div>

                <Link
                  href={`/${locale}/quote`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  {labels.viewQuote}
                </Link>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {labels.nextStepTitle}
                  </p>
                  <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    <li>1. {labels.nextStep1}</li>
                    <li>2. {labels.nextStep2}</li>
                    <li>3. {labels.nextStep3}</li>
                  </ol>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">
                {product.partNo}
              </p>
              <p className="truncate text-xs text-slate-500">{brandText}</p>
            </div>

            <div className="shrink-0">
              <AddToQuoteButton product={quoteProduct} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}