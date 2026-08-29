import type { Metadata } from "next";
import ProductListClient from "@/components/products/ProductListClient";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import {
  searchFilterProductsByDimensions,
  type FilterDimensionCategory,
} from "@/lib/search/search";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    od?: string;
    id?: string;
    length?: string;
    thread?: string;
    category?: string;
  }>;
};

const CATEGORY_OPTIONS: Array<{
  value: FilterDimensionCategory;
  th: string;
  en: string;
}> = [
  { value: "all", th: "ไส้กรองทุกประเภท", en: "All filter types" },
  { value: "air_filter", th: "ไส้กรองอากาศ", en: "Air filters" },
  { value: "oil_filter", th: "ไส้กรองน้ำมันเครื่อง", en: "Oil / lube filters" },
  { value: "fuel_filter", th: "ไส้กรองเชื้อเพลิง", en: "Fuel filters" },
  { value: "hydraulic_filter", th: "ไส้กรองไฮดรอลิก", en: "Hydraulic filters" },
];

function parsePositiveNumber(value: string | undefined) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function normalizeCategory(value: string | undefined): FilterDimensionCategory {
  return CATEGORY_OPTIONS.some((option) => option.value === value)
    ? (value as FilterDimensionCategory)
    : "all";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai
      ? "ค้นหาไส้กรองด้วยขนาด | MRT Supplier"
      : "Search Filters by Dimensions | MRT Supplier",
    description: isThai
      ? "ค้นหาไส้กรองจาก OD, ID, Length/Height และ Thread Size โดยรองรับช่วงขนาด ±3 มม."
      : "Find filters by OD, ID, length or height, and thread size with a ±3 mm filter tolerance.",
  };
}

export default async function FilterDimensionSearchPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const resolved = (await searchParams) ?? {};
  const isThai = locale === "th";
  const category = normalizeCategory(resolved.category);
  const criteria = {
    outerDiameterMm: parsePositiveNumber(resolved.od),
    innerDiameterMm: parsePositiveNumber(resolved.id),
    lengthMm: parsePositiveNumber(resolved.length),
    threadSize: String(resolved.thread ?? "").trim() || undefined,
  };
  const hasCriteria =
    criteria.outerDiameterMm !== undefined ||
    criteria.innerDiameterMm !== undefined ||
    criteria.lengthMm !== undefined ||
    Boolean(criteria.threadSize);
  const suppliedDimensionCount = [
    criteria.outerDiameterMm,
    criteria.innerDiameterMm,
    criteria.lengthMm,
    criteria.threadSize,
  ].filter((value) => value !== undefined && value !== "").length;
  const results = hasCriteria
    ? searchFilterProductsByDimensions(criteria, {
        category,
        limit: 500,
      })
    : [];
  const queryLabel = [
    criteria.outerDiameterMm !== undefined
      ? `OD ${criteria.outerDiameterMm}`
      : "",
    criteria.innerDiameterMm !== undefined
      ? `ID ${criteria.innerDiameterMm}`
      : "",
    criteria.lengthMm !== undefined
      ? `Length ${criteria.lengthMm}`
      : "",
    criteria.threadSize ? `Thread ${criteria.threadSize}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mrt-blueprint-shell min-h-screen">
      <SiteHeader locale={locale} />

      <main>
        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 xl:px-8">
            <a
              href={`/${locale}/products`}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              ← {isThai ? "กลับไปค้นหาด้วย Part No." : "Back to Part No. search"}
            </a>

            <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              {isThai
                ? "ค้นหาไส้กรองด้วยขนาด"
                : "Search filters by dimensions"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              {isThai
                ? "กรอกเฉพาะขนาดที่ทราบ ระบบจะค้นหาไส้กรองในช่วง ±3 มม. และเรียงจากขนาดที่ใกล้ที่สุด"
                : "Enter the dimensions you know. Filter results use a ±3 mm range and are sorted by closest fit."}
            </p>

            <form
              action={`/${locale}/products/dimensions`}
              method="get"
              className="mt-6 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 shadow-[var(--shadow-sm)] sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">
                    {isThai ? "ประเภทไส้กรอง" : "Filter type"}
                  </span>
                  <select
                    name="category"
                    defaultValue={category}
                    className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {isThai ? option.th : option.en}
                      </option>
                    ))}
                  </select>
                </label>

                {[
                  {
                    name: "od",
                    label: "OD",
                    value: resolved.od,
                    placeholder: "93",
                  },
                  {
                    name: "id",
                    label: "ID",
                    value: resolved.id,
                    placeholder: "62",
                  },
                  {
                    name: "length",
                    label: isThai ? "Length / Height" : "Length / Height",
                    value: resolved.length,
                    placeholder: "173",
                  },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">
                      {field.label} (mm)
                    </span>
                    <input
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.1"
                      defaultValue={field.value}
                      placeholder={field.placeholder}
                      className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">
                    Thread Size
                  </span>
                  <input
                    name="thread"
                    type="text"
                    defaultValue={resolved.thread}
                    placeholder="1-12 UN"
                    className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]"
                  />
                  <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
                    {isThai ? "ต้องตรงกับสินค้า" : "Exact match"}
                  </span>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)]"
                >
                  {isThai ? "ค้นหาด้วยขนาด" : "Search dimensions"}
                </button>
                <a
                  href={`/${locale}/products/dimensions`}
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]"
                >
                  {isThai ? "ล้างค่า" : "Clear"}
                </a>
                <span className="text-xs leading-5 text-[var(--color-text-muted)]">
                  {isThai
                    ? "OD, ID และ Length/Height เผื่อ ±3 มม. · Thread ต้องตรง"
                    : "OD, ID, and Length/Height use ±3 mm · Thread must match"}
                </span>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
          {!hasCriteria ? (
            <div className="rounded-[var(--mrt-radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-8 text-center text-sm text-[var(--color-text-muted)]">
              {isThai
                ? "กรอกอย่างน้อย 1 ขนาดเพื่อเริ่มค้นหา"
                : "Enter at least one dimension to start searching."}
            </div>
          ) : (
            <>
              <div className="mb-5 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 shadow-[var(--shadow-sm)] sm:px-5">
                <div className="font-semibold text-[var(--color-text)]">
                  {isThai
                    ? `พบ ${results.length} รายการสำหรับ ${queryLabel}`
                    : `${results.length} results for ${queryLabel}`}
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {suppliedDimensionCount === 1
                    ? isThai
                      ? "กรอก ID, Length/Height หรือ Thread Size เพิ่ม เพื่อให้ผลลัพธ์แม่นยำขึ้น"
                      : "Add ID, Length/Height, or Thread Size for more precise results."
                    : isThai
                      ? "เรียงจากขนาดที่ใกล้ค่าที่กรอกที่สุด กรุณาตรวจสอบสเปกก่อนสั่งซื้อ"
                      : "Sorted by closest dimensions. Verify specifications before ordering."}
                </p>
              </div>

              {results.length > 0 ? (
                <ProductListClient
                  products={results}
                  locale={locale}
                  initialCount={12}
                  incrementCount={12}
                  searchQuery={queryLabel}
                />
              ) : (
                <div className="rounded-[var(--mrt-radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-8 text-center">
                  <p className="font-medium text-[var(--color-text)]">
                    {isThai
                      ? "ไม่พบไส้กรองในช่วงขนาดที่ระบุ"
                      : "No filters found within the requested range."}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {isThai
                      ? "ลองตรวจสอบหน่วยมิลลิเมตร หรือลดจำนวนเงื่อนไขที่กรอก"
                      : "Check the millimeter values or remove one search condition."}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
