"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gaAddToQuote, gaViewItem } from "@/lib/analytics/ga";
import { trackEvent } from "@/lib/analytics/track";
import { getProductUiText } from "@/lib/i18n/productUi";
import { getProductImageUrl } from "@/lib/products/image";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";
import ProductCrossReferenceCards from "./detail/ProductCrossReferenceCards";
import ProductOfficialReference from "./detail/ProductOfficialReference";
import ProductSpecTable from "./detail/ProductSpecTable";

type Props = {
  locale: string;
  product: Product;
};

const LINE_URL = "https://lin.ee/S676yYH";

function normalizePath(src?: string) {
  if (!src) return "/images/placeholder.jpg";
  return src;
}

function ProductGallery({
  images,
  partNo,
}: {
  images: string[];
  partNo: string;
}) {
  const primaryImage = normalizePath(images[0]);
  const [imageSrc, setImageSrc] = useState(primaryImage);

  useEffect(() => {
    setImageSrc(primaryImage);
  }, [primaryImage]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="rounded-[22px] border border-slate-200 bg-white p-4 sm:p-6">
          <div className="relative h-72 w-full sm:h-80">
            <Image
              src={imageSrc}
              alt={partNo}
              fill
              preload
              sizes="(max-width: 1024px) calc(100vw - 72px), 520px"
              className="object-contain"
              onError={() => setImageSrc("/images/placeholder.jpg")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeSpecLabel(value: string) {
  return value.trim().toLowerCase();
}

function normalizeComparableText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getCategorySummary(category: string | undefined, locale: string) {
  const isThai = locale === "th";
  const key = String(category ?? "").trim().toLowerCase();

  if (key === "oil_filter") return isThai ? "ไส้กรองน้ำมันเครื่อง" : "Oil filter";
  if (key === "fuel_filter") return isThai ? "ไส้กรองเชื้อเพลิง" : "Fuel filter";
  if (key === "hydraulic_filter") return isThai ? "ไส้กรองไฮดรอลิก" : "Hydraulic filter";
  if (key === "air_filter") return isThai ? "ไส้กรองอากาศ" : "Air filter";
  if (!key) return "";

  return key
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildHeaderSummary(product: Product, locale: string) {
  const categorySummary = getCategorySummary(product.category, locale);
  const specs = Array.isArray(product.specifications) ? product.specifications : [];
  const skipLabels = new Set([
    "height",
    "length",
    "outside diameter",
    "inside diameter",
    "od",
    "id",
    "thread",
    "gasket od",
    "gasket id",
    "efficiency",
    "efficiency test std",
    "micron rating",
  ]);

  const summarySpecs = specs
    .filter((item) => {
      const label = normalizeSpecLabel(String(item?.label ?? ""));
      const value = String(item?.value ?? "").trim();

      return label && value && !skipLabels.has(label);
    })
    .map((item) => String(item.value).trim());

  return [categorySummary, ...summarySpecs]
    .filter((value, index, array): value is string =>
      Boolean(value) && array.indexOf(value) === index,
    )
    .slice(0, 4);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </div>
  );
}

function SurfaceCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-slate-300 bg-white shadow-[0_16px_42px_rgba(15,23,42,0.07)] ${className}`}
    >
      {children}
    </div>
  );
}

function VerificationNote({ locale }: { locale: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
      {locale === "th"
        ? "หมายเหตุ: ข้อมูลสเปคและเบอร์เทียบใช้เพื่อการตรวจสอบเบื้องต้น กรุณายืนยันขนาด เกลียว รุ่นเครื่องจักร และการใช้งานก่อนสั่งซื้อ"
        : "Note: Specifications and cross references are for preliminary checking. Please confirm dimensions, thread size, machine model, and application before ordering."}
    </div>
  );
}

function buildTopProductInfo(product: Product, locale: string) {
  const isThai = locale === "th";

  if (product.partNo.toUpperCase() === "P553000" && isThai) {
    return {
      title: "เกี่ยวกับ Donaldson P553000",
      paragraphs: [
        "Donaldson P553000 เป็นกรองน้ำมันเครื่องแบบ Spin-on สำหรับช่วยรักษาความสะอาดของน้ำมันเครื่อง และลดสิ่งปนเปื้อนที่อาจก่อให้เกิดการสึกหรอภายในเครื่องยนต์",
        "ตัวกรองช่วยดักจับสิ่งสกปรกระหว่างการใช้งาน สนับสนุนการหล่อลื่นให้มีประสิทธิภาพ และช่วยส่งผ่านน้ำมันที่สะอาดกว่าไปยังชิ้นส่วนสำคัญของเครื่องยนต์",
      ],
    };
  }

  if (isThai) {
    if (product.category === "oil_filter") {
      return {
        title: "เกี่ยวกับสินค้า",
        paragraphs: ["Spin-on filter สำหรับระบบหล่อลื่น"],
      };
    }

    if (product.category === "fuel_filter") {
      return {
        title: "เกี่ยวกับสินค้า",
        paragraphs: ["Spin-on filter สำหรับระบบเชื้อเพลิง"],
      };
    }

    if (product.category === "hydraulic_filter") {
      return {
        title: "เกี่ยวกับสินค้า",
        paragraphs: ["Spin-on filter สำหรับระบบไฮดรอลิก"],
      };
    }

    return {
      title: "เกี่ยวกับสินค้า",
      paragraphs: ["อุปกรณ์กรองสำหรับงานอุตสาหกรรม"],
    };
  }

  return {
    title: "About This Product",
    paragraphs: ["Industrial filtration component"],
  };
}

function buildDescriptionBlock(product: Product, locale: string) {
  const fallbackInfo = buildTopProductInfo(product, locale);
  const specText = normalizeComparableText(String(product.spec ?? ""));
  const structuredValues = (product.specifications ?? [])
    .map((item) => normalizeComparableText(String(item?.value ?? "")))
    .filter(Boolean);

  const paragraphs = [
    product.shortDescription,
    product.description,
    ...fallbackInfo.paragraphs,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .filter((paragraph, index, array) => {
      const normalized = normalizeComparableText(paragraph);

      if (!normalized) return false;
      if (specText && normalized === specText) return false;
      if (structuredValues.includes(normalized)) return false;

      return (
        array.findIndex(
          (item) => normalizeComparableText(item) === normalized,
        ) === index
      );
    });

  return {
    title: fallbackInfo.title,
    paragraphs,
  };
}

export default function ProductDetailClient({ locale, product }: Props) {
  const router = useRouter();
  const { addItem } = useQuote();
  const text = getProductUiText(locale);
  const isThai = locale === "th";
  const [justAdded, setJustAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const primaryImage = getProductImageUrl(
    product.brand,
    product.partNo,
    product.imageUrl,
  );

  const images = useMemo(() => {
    const extraImages = (product.images ?? [])
      .map((image) => String(image).trim())
      .filter(Boolean);

    return [primaryImage, ...extraImages].filter(
      (image, index, array) => array.indexOf(image) === index,
    );
  }, [primaryImage, product.images]);

  const refs = useMemo(
    () =>
      Array.from(
        new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])]),
      )
        .map((value) => String(value).trim())
        .filter(Boolean),
    [product.refs, product.crossReferences],
  );

  const applications = useMemo(
    () =>
      Array.from(
        new Set([
          ...(product.application ?? []),
          ...(product.applications ?? []),
        ]),
      )
        .map((value) => String(value).trim())
        .filter(Boolean)
        .slice(0, 6),
    [product.application, product.applications],
  );

  const pairedParts = useMemo(
    () =>
      (product.pairedParts ?? [])
        .filter(
          (item) =>
            item &&
            typeof item.partNo === "string" &&
            item.partNo.trim().length > 0,
        )
        .map((item) => ({
          partNo: item.partNo.trim(),
          relation: item.relation,
          note: item.note?.trim(),
        })),
    [product.pairedParts],
  );

  const descriptionBlock = useMemo(
    () => buildDescriptionBlock(product, locale),
    [locale, product],
  );
  const headerSummary = useMemo(
    () => buildHeaderSummary(product, locale),
    [locale, product],
  );
  const specRows = useMemo(
    () =>
      (product.specifications ?? [])
        .map((item) => ({
          label: String(item?.label ?? "").trim(),
          value: String(item?.value ?? "").trim(),
        }))
        .filter((item) => item.label.length > 0 && item.value.length > 0),
    [product.specifications],
  );
  const hasSpecContent = Boolean(product.spec?.trim()) || specRows.length > 0;

  const pairedPartsTitle = isThai ? "ชุดกรองที่ใช้คู่กัน" : "Paired Filter";
  const addToQuoteLabel = justAdded
    ? isThai
      ? "เพิ่มในใบเสนอราคาแล้ว"
      : "Added"
    : text.addToQuote;

  const getPairedRelationLabel = (relation: "outer" | "inner" | "paired") => {
    if (relation === "inner") {
      return isThai ? "ไส้กรองใน" : "Inner filter";
    }

    if (relation === "outer") {
      return isThai ? "ไส้กรองนอก" : "Outer filter";
    }

    return isThai ? "ชิ้นส่วนที่ใช้คู่กัน" : "Paired part";
  };

  useEffect(() => {
    gaViewItem(
      {
        item_id: product.partNo || product.id,
        item_brand: product.brand,
        item_category: product.category,
      },
      {
        source: "product_detail",
      },
    );
  }, [product.brand, product.category, product.id, product.partNo]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleAdd = () => {
    trackEvent("add_to_quote", {
      partNo: product.partNo,
      brand: product.brand,
    });
    gaAddToQuote(
      {
        item_id: product.partNo || product.id,
        item_brand: product.brand,
        item_category: product.category,
        quantity: 1,
      },
      {
        source: "product_detail",
      },
    );

    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title ?? "",
      qty: 1,
    });

    setJustAdded(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setJustAdded(false);
      resetTimerRef.current = null;
    }, 1500);
  };

  const handleRequestQuote = () => {
    handleAdd();
    router.push(`/${locale}/quote`);
  };

  return (
    <>
      <div className="grid gap-6 pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0 space-y-4">
          <div className="rounded-[24px] border border-slate-300 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                {product.brand.toUpperCase()}
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
                {text.industrialGrade}
              </span>
            </div>

            <h1 className="mt-3 break-all text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {product.partNo}
            </h1>

            {product.title && (
              <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-700">
                {product.title}
              </p>
            )}
          </div>

          <ProductGallery images={images} partNo={product.partNo} />
          <ProductCrossReferenceCards
            locale={locale}
            refs={refs}
            brand={product.brand}
            currentPartNo={product.partNo}
            sameBrandAlternatives={product.sameBrandAlternatives}
          />
        </div>

        <div className="min-w-0 self-start space-y-4">
          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-slate-300 bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_100%)] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {product.brand.toUpperCase()}
                </span>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                  OEM Reference
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
                  {text.industrialGrade}
                </span>
              </div>

              <h1 className="mt-4 break-all text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                {product.partNo}
              </h1>

              {headerSummary.length > 0 && (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  {headerSummary.join(" • ")}
                </p>
              )}

              <Link
                href={`/${locale}/products?q=${encodeURIComponent(
                  product.brand.trim().toLowerCase(),
                )}`}
                className="mt-3 inline-flex text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
              >
                {product.brand.toUpperCase()}
              </Link>

              {product.title && (
                <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-900">
                  {product.title}
                </p>
              )}
            </div>

            <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
              {descriptionBlock.paragraphs.length > 0 && (
                <div className="rounded-[22px] border border-slate-300 bg-slate-50/95 px-5 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {descriptionBlock.title}
                  </div>
                  <div className="mt-2 space-y-3 text-sm leading-7 text-slate-700">
                    {descriptionBlock.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[24px] border border-slate-300 bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_100%)] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-5">
                <SectionLabel>{text.readyToQuote}</SectionLabel>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {text.readyToQuoteBody}
                </p>

                <div className="mt-5 hidden space-y-3 md:block">
                  <button
                    onClick={handleAdd}
                    disabled={justAdded}
                    className={`w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                      justAdded
                        ? "bg-emerald-600"
                        : "bg-slate-900 hover:bg-slate-800"
                    } ${justAdded ? "cursor-default" : ""}`}
                  >
                    {addToQuoteLabel}
                  </button>

                  <button
                    onClick={handleRequestQuote}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                  >
                    {text.requestQuote}
                  </button>
                </div>

                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
                >
                  {isThai
                    ? "ปรึกษาสเปคหรือส่งรูปทาง LINE"
                    : "Consult specs or send photos on LINE"}
                </a>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {text.rfqSupportNote}
                </p>
              </div>

              {hasSpecContent && (
                <ProductSpecTable
                  locale={locale}
                  specifications={specRows}
                  specSummary={specRows.length === 0 ? product.spec : undefined}
                />
              )}

              <ProductOfficialReference
                locale={locale}
                itemId={product.partNo || product.id}
                itemBrand={product.brand}
                officialUrl={product.officialUrl}
              />

              <VerificationNote locale={locale} />
            </div>
          </SurfaceCard>

          {pairedParts.length > 0 && (
            <SurfaceCard className="px-5 py-5 sm:px-6">
              <SectionLabel>{pairedPartsTitle}</SectionLabel>

              <div className="mt-4 space-y-3">
                {pairedParts.map((item) => (
                  <div
                    key={`${item.partNo}-${item.relation}`}
                    className="rounded-2xl border border-slate-300 bg-slate-50/85 px-4 py-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {getPairedRelationLabel(item.relation)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/${locale}/products/${encodeURIComponent(item.partNo)}`}
                        className="inline-flex min-h-10 items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-100"
                      >
                        {item.partNo}
                      </Link>
                    </div>

                    {item.note && (
                      <p className="mt-3 text-xs leading-6 text-slate-500">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SurfaceCard>
          )}

          {applications.length > 0 && (
            <SurfaceCard className="px-5 py-5 sm:px-6">
              <SectionLabel>{text.applications}</SectionLabel>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {applications.map((application) => (
                  <span
                    key={application}
                    className="rounded-full border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700"
                  >
                    {application}
                  </span>
                ))}
              </div>
            </SurfaceCard>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-300 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={justAdded}
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
              justAdded
                ? "border border-emerald-200 bg-emerald-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            } ${justAdded ? "cursor-default" : ""}`}
          >
            {addToQuoteLabel}
          </button>

          <button
            onClick={handleRequestQuote}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {text.requestQuote}
          </button>
        </div>
      </div>
    </>
  );
}
