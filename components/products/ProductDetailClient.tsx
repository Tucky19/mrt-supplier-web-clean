"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";
import { getProductUiText } from "@/lib/i18n/productUi";
import { getProductImageUrl } from "@/lib/products/image";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";
import ProductCrossReferenceCards from "./detail/ProductCrossReferenceCards";

type Props = {
  locale: string;
  product: Product;
};

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

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="rounded-[22px] border border-slate-200 bg-white p-4 sm:p-6">
          <img
            src={primaryImage}
            alt={partNo}
            className="h-72 w-full object-contain sm:h-80"
            onError={(event) => {
              event.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
}

function slugifyBrand(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "-");
}

function normalizeSpecLabel(value: string) {
  return value.trim().toLowerCase();
}

function buildProductBadges(product: Product) {
  const specs = Array.isArray(product.specifications) ? product.specifications : [];
  const specMap = new Map(
    specs
      .filter(
        (item) =>
          typeof item?.label === "string" &&
          item.label.trim().length > 0 &&
          String(item.value ?? "").trim().length > 0,
      )
      .map((item) => [normalizeSpecLabel(item.label), String(item.value).trim()]),
  );

  return [
    specMap.get("type"),
    specMap.get("style"),
    specMap.get("position") ?? specMap.get("stage"),
    specMap.get("flow"),
    specMap.get("seal"),
    specMap.get("shape") ?? specMap.get("form"),
  ].filter(
    (value, index, array): value is string =>
      Boolean(value) && array.indexOf(value) === index,
  );
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

function buildTopProductInfo(product: Product, locale: string) {
  const isThai = locale === "th";

  if (product.partNo.toUpperCase() === "P553000" && isThai) {
    return {
      title: "เกี่ยวกับ Donaldson P553000",
      paragraphs: [
        "Donaldson P553000 เป็นกรองน้ำมันเครื่องแบบ Spin-on สำหรับช่วยรักษาความสะอาดของน้ำมันเครื่อง และลดสิ่งปนเปื้อนที่อาจก่อให้เกิดการสึกหรอภายในเครื่องยนต์",
        "ตัวกรองช่วยดักจับสิ่งสกปรกที่สะสมระหว่างการใช้งาน สนับสนุนการหล่อลื่นให้มีประสิทธิภาพ และช่วยส่งผ่านน้ำมันที่สะอาดกว่าไปยังชิ้นส่วนสำคัญของเครื่องยนต์",
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

  const topProductInfo = useMemo(
    () => buildTopProductInfo(product, locale),
    [locale, product],
  );
  const specRows = useMemo(
    () =>
      (product.specifications ?? []).filter(
        (item) =>
          String(item?.label ?? "").trim().length > 0 &&
          String(item?.value ?? "").trim().length > 0,
      ),
    [product.specifications],
  );
  const hasSpecContent = Boolean(product.spec?.trim()) || specRows.length > 0;

  const badges = useMemo(() => buildProductBadges(product), [product]);
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
      <div className="grid gap-8 pb-28 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10 lg:pb-0">
        <div className="space-y-5">
          <ProductGallery images={images} partNo={product.partNo} />
          <ProductCrossReferenceCards
            locale={locale}
            refs={refs}
            brand={product.brand}
          />

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-slate-300 bg-slate-50/95 px-5 py-4 sm:px-6">
              <SectionLabel>
                {isThai ? "หมายเหตุการตรวจสอบ" : "Verification Notes"}
              </SectionLabel>
            </div>
            <div className="px-5 py-5 sm:px-6">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                <li>หน้านี้ใช้สำหรับตรวจสอบ Part Number / OEM Reference เบื้องต้น</li>
                <li>กรุณาส่ง RFQ เพื่อให้ทีมงานตรวจสอบเบอร์เทียบ ทางเลือกทดแทน และความเหมาะสมก่อนเสนอราคา</li>
                <li>เว็บไซต์ยังไม่แสดงราคาและจำนวนสต๊อกแบบเรียลไทม์</li>
              </ul>
            </div>
          </SurfaceCard>
        </div>

        <div className="self-start space-y-5">
          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-slate-300 bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_100%)] px-5 py-5 sm:px-6">
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

              <h1 className="mt-4 break-all text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                {product.partNo}
              </h1>

              {product.spec?.trim() && (
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
                  {product.spec.trim()}
                </p>
              )}

              {badges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/${locale}/brands/${slugifyBrand(product.brand)}`}
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

            <div className="space-y-5 px-5 py-5 sm:px-6">
              {topProductInfo.paragraphs.length > 0 && (
                <div className="rounded-[22px] border border-slate-300 bg-slate-50/95 px-5 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {topProductInfo.title}
                  </div>
                  <div className="mt-2 space-y-3 text-sm leading-7 text-slate-700">
                    {topProductInfo.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {product.shortDescription && (
                <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {product.shortDescription}
                </p>
              )}

              {hasSpecContent && (
                <div className="rounded-[22px] border border-slate-300 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <SectionLabel>
                    {locale === "th" ? "สเปกสินค้า" : "Product Specifications"}
                  </SectionLabel>

                  {product.spec?.trim() && (
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-[15px]">
                      {product.spec.trim()}
                    </p>
                  )}

                  {specRows.length > 0 && (
                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                      {specRows.map((item) => (
                        <div
                          key={`${item.label}-${item.value}`}
                          className="rounded-2xl border border-slate-300 bg-slate-50/80 px-4 py-3.5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {String(item.label)}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
                            {String(item.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
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

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {text.rfqSupportNote}
                </p>
              </div>
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

          {product.officialUrl && (
            <SurfaceCard className="px-5 py-5 sm:px-6">
              <SectionLabel>
                {isThai ? "Official Reference" : "Official Reference"}
              </SectionLabel>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {isThai
                  ? "ใช้หน้าผู้ผลิตสำหรับตรวจสอบรายละเอียดและความเข้ากันได้ก่อนส่ง RFQ"
                  : "Use the manufacturer page to verify details and compatibility before sending an RFQ."}
              </p>
              <a
                href={product.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {text.viewOfficialSource}
              </a>
            </SurfaceCard>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-300 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
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
