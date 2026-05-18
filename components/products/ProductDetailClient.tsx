"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";
import { getProductUiText } from "@/lib/i18n/productUi";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";

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
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <img
          src={normalizePath(images[active])}
          alt={partNo}
          className="h-72 w-full object-contain sm:h-80"
          onError={(event) => {
            event.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              onClick={() => setActive(index)}
              className={`h-16 w-16 rounded border ${
                index === active ? "border-black" : "border-slate-200"
              }`}
            >
              <img
                src={normalizePath(img)}
                alt=""
                className="object-contain"
                onError={(event) => {
                  event.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function slugifyBrand(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "-");
}

type CrossReferenceRow = {
  brand: string;
  partNo: string;
};

function buildCrossReferenceRows(refs: string[]): CrossReferenceRow[] {
  return refs.map((ref) => {
    const [brand, partNo] = ref.includes(":")
      ? ref.split(":", 2).map((value) => value.trim())
      : ["—", ref];

    return {
      brand: brand || "—",
      partNo: partNo || ref,
    };
  });
}

function CrossReferenceCard({
  locale,
  rows,
}: {
  locale: string;
  rows: CrossReferenceRow[];
}) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5">
        <div className="text-sm font-semibold text-slate-900">
          Cross Reference
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          Equivalent / Replacement Parts
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="border-b border-slate-100 px-4 py-2.5 sm:px-5">
                Brand
              </th>
              <th className="border-b border-slate-100 px-4 py-2.5 sm:px-5">
                Part Number
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={`${row.brand}-${row.partNo}`}>
                <td className="px-4 py-3 text-slate-600 sm:px-5">
                  {row.brand}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <Link
                    href={`/${locale}/products/${encodeURIComponent(row.partNo)}`}
                    className="font-semibold text-slate-900 underline-offset-2 hover:underline"
                  >
                    {row.partNo}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 bg-slate-100/80 px-4 py-3 text-xs leading-5 text-slate-700 sm:px-5">
        หมายเหตุ: ข้อมูล Cross Reference ใช้เพื่อเทียบเบื้องต้น กรุณายืนยันสเปคก่อนสั่งซื้อ
      </div>
    </div>
  );
}

export default function ProductDetailClient({ locale, product }: Props) {
  const router = useRouter();
  const { addItem } = useQuote();
  const text = getProductUiText(locale);
  const guessedImagePath = `/images/products/${product.brand.toLowerCase()}/${product.partNo.toLowerCase()}.jpg`;
  const isThai = locale === "th";
  const [justAdded, setJustAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const images =
    product.images?.length
      ? product.images
      : [
          product.detailImageUrl ||
          product.imageUrl ||
            product.officialImageUrl ||
            guessedImagePath ||
            "/images/placeholder.jpg",
        ];

  const refs = useMemo(
    () =>
      Array.from(
        new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])])
      )
        .map((value) => String(value).trim())
        .filter(Boolean),
    [product.refs, product.crossReferences]
  );

  const crossReferenceRows = useMemo(
    () => buildCrossReferenceRows(refs),
    [refs]
  );

  const applications = useMemo(
    () =>
      Array.from(
        new Set([...(product.application ?? []), ...(product.applications ?? [])])
      )
        .map((value) => String(value).trim())
        .filter(Boolean)
        .slice(0, 6),
    [product.application, product.applications]
  );

  const pairedParts = useMemo(
    () =>
      (product.pairedParts ?? [])
        .filter(
          (item) =>
            item &&
            typeof item.partNo === "string" &&
            item.partNo.trim().length > 0
        )
        .map((item) => ({
          partNo: item.partNo.trim(),
          relation: item.relation,
          note: item.note?.trim(),
        })),
    [product.pairedParts]
  );

  const pairedPartsTitle = isThai ? "กรองที่ใช้คู่กัน" : "Paired Filter";
  const addToQuoteLabel = justAdded
    ? isThai
      ? "เพิ่มแล้ว ✓"
      : "Added ✓"
    : text.addToQuote;

  const getPairedRelationLabel = (relation: "outer" | "inner" | "paired") => {
    if (relation === "inner") {
      return isThai ? "กรองลูกใน" : "Inner filter";
    }

    if (relation === "outer") {
      return isThai ? "กรองลูกนอก" : "Outer filter";
    }

    return isThai ? "ใช้คู่กัน" : "Paired part";
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
      <div className="grid gap-8 pb-28 md:grid-cols-2 md:gap-10 md:pb-0">
        <div className="space-y-3 sm:space-y-4">
          <ProductGallery images={images} partNo={product.partNo} />
          <CrossReferenceCard locale={locale} rows={crossReferenceRows} />
        </div>

        <div className="self-start">
          <h1 className="text-2xl font-bold sm:text-3xl">{product.partNo}</h1>

          <Link
            href={`/${locale}/brands/${slugifyBrand(product.brand)}`}
            className="text-sm text-slate-500 underline-offset-2 hover:underline"
          >
            {product.brand.toUpperCase()}
          </Link>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              OEM Reference
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              {text.industrialGrade}
            </span>
          </div>

          {product.title && (
            <div className="mt-3 text-base font-medium text-slate-900 sm:mt-4 sm:text-lg">
              {product.title}
            </div>
          )}

          {product.spec && (
            <div className="mt-3 rounded-xl border bg-gray-50 p-4 text-sm sm:mt-4">
              {product.spec}
            </div>
          )}

          {product.shortDescription && (
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:mt-4">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {text.readyToQuote}
            </div>

            <p className="mt-2 text-sm text-slate-600">{text.readyToQuoteBody}</p>

            <div className="mt-4 hidden space-y-3 md:block">
              <button
                onClick={handleAdd}
                disabled={justAdded}
                className={`w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors ${
                  justAdded
                    ? "bg-emerald-600"
                    : "bg-slate-900 hover:bg-black"
                } ${justAdded ? "cursor-default" : ""}`}
              >
                {addToQuoteLabel}
              </button>

              <button
                onClick={handleRequestQuote}
                className="w-full rounded-lg border border-slate-300 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {text.requestQuote}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              {text.rfqSupportNote}
            </p>
          </div>

          {product.description && product.description !== product.shortDescription && (
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          )}

          {pairedParts.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <div className="text-xs uppercase text-gray-500">
                {pairedPartsTitle}
              </div>

              <div className="mt-3 space-y-3">
                {pairedParts.map((item) => (
                  <div
                    key={`${item.partNo}-${item.relation}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {getPairedRelationLabel(item.relation)}
                    </div>

                    <Link
                      href={`/${locale}/products/${encodeURIComponent(item.partNo)}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      {item.partNo}
                    </Link>

                    {item.note && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {applications.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <div className="text-xs uppercase text-gray-500">
                {text.applications}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {applications.map((application) => (
                  <span
                    key={application}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {application}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-xl border sm:mt-6">
              <div className="border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {text.specifications}
              </div>

              <div className="divide-y">
                {product.specifications.slice(0, 8).map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="px-4 py-3 text-sm md:grid md:grid-cols-[140px_1fr] md:gap-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:text-sm md:font-normal md:normal-case md:tracking-normal">
                      {item.label}
                    </div>
                    <div className="mt-1 text-slate-900 md:mt-0">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.officialUrl && (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-sm text-blue-700 underline underline-offset-2"
            >
              {text.viewOfficialSource}
            </a>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={justAdded}
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              justAdded
                ? "border border-emerald-200 bg-emerald-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            } ${justAdded ? "cursor-default" : ""}`}
          >
            {addToQuoteLabel}
          </button>

          <button
            onClick={handleRequestQuote}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            {text.requestQuote}
          </button>
        </div>
      </div>
    </>
  );
}
