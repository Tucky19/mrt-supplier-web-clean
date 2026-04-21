import Image from "next/image";
import Link from "next/link";
import AddToQuoteButton from "@/components/quote/AddToQuoteButton";

export type ProductCardData = {
  id: string;
  partNo: string;
  brand: string;
  category: string;

  title: string;
  shortDescription?: string;
  description?: string;

  spec?: string;
  crossReferences?: string[];
  equipment?: string[];
  applications?: string[];

  officialUrl?: string;
  officialImageUrl?: string | null;

  stockStatus?: "in_stock" | "low_stock" | "request";
  isFeatured?: boolean;
};

export type ProductCardProps = {
  locale: string;
  product: ProductCardData;

  showOfficialLink?: boolean;
  showCrossReferences?: boolean;
  showEquipment?: boolean;
  showStockStatus?: boolean;

  variant?: "search" | "featured";
};

function getStockLabel(
  locale: string,
  status: ProductCardData["stockStatus"]
): string | null {
  if (!status) return null;

  if (locale === "th") {
    if (status === "in_stock") return "พร้อมส่ง";
    if (status === "low_stock") return "สต็อกต่ำ";
    return "สอบถามสินค้า";
  }

  if (status === "in_stock") return "In Stock";
  if (status === "low_stock") return "Low Stock";
  return "Request";
}

function getStockClass(status: ProductCardData["stockStatus"]) {
  if (status === "in_stock") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "low_stock") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function compactList(values: string[] | undefined, max = 3) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean).slice(0, max);
}

function getSummary(product: ProductCardData) {
  return (
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    ""
  );
}

function getSafeOfficialImageUrl(value: ProductCardData["officialImageUrl"]) {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized.startsWith("/") ? normalized : null;
}

export default function ProductCard({
  locale,
  product,
  showOfficialLink = true,
  showCrossReferences = true,
  showEquipment = true,
  showStockStatus = true,
  variant = "search",
}: ProductCardProps) {
  const stockLabel = getStockLabel(locale, product.stockStatus);
  const crossReferences = compactList(product.crossReferences, 4);
  const equipment = compactList(product.equipment, 3);
  const applications = compactList(product.applications, 2);
  const summary = getSummary(product);
  const isFeatured = variant === "featured" || Boolean(product.isFeatured);
  const brand = product.brand.trim();
  const category = product.category.trim();
  const officialImageUrl = getSafeOfficialImageUrl(product.officialImageUrl);

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
        isFeatured
          ? "border-slate-300 ring-1 ring-slate-200"
          : "border-slate-200"
      }`}
    >
      <div className="border-b border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {brand ? (
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                  {brand}
                </span>
              ) : null}

              {category ? (
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {category}
                </span>
              ) : null}

              {showStockStatus && stockLabel ? (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStockClass(
                    product.stockStatus
                  )}`}
                >
                  {stockLabel}
                </span>
              ) : null}

              {isFeatured ? (
                <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                  Featured
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Part Number
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {product.partNo}
            </h3>

            <p className="mt-3 text-sm font-medium text-slate-900">
              {product.title}
            </p>

            {summary ? (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {summary}
              </p>
            ) : null}
          </div>

          {officialImageUrl ? (
            <div className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
              <Image
                src={officialImageUrl}
                alt={product.title || product.partNo}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-4">
          {product.spec ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Specification
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {product.spec}
              </p>
            </div>
          ) : null}

          {showCrossReferences && crossReferences.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Cross Reference
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {crossReferences.map((reference) => (
                  <span
                    key={reference}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {reference}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {showEquipment && equipment.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Equipment
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {equipment.join(", ")}
              </p>
            </div>
          ) : null}

          {applications.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Applications
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {applications.join(", ")}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">
            {locale === "th"
              ? "ต้องการราคา หรือเช็กเทียบเบอร์?"
              : "Need pricing or cross-reference support?"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {locale === "th"
              ? "เพิ่มรายการในใบขอราคาเพื่อส่ง RFQ ให้ทีมงานตรวจสอบและติดต่อกลับ"
              : "Add this item to your RFQ list so our team can review and follow up."}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/products/${product.id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {locale === "th" ? "ดูรายละเอียด" : "View Detail"}
          </Link>

          <AddToQuoteButton
            product={{
              id: product.id,
              partNo: product.partNo,
              brand: product.brand,
              title: product.title,
            }}
          />

          <Link
            href={`/${locale}/quote`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {locale === "th" ? "ไปที่ RFQ" : "Go to RFQ"}
          </Link>

          {showOfficialLink && product.officialUrl ? (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {locale === "th" ? "Official Link" : "Official Link"}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
