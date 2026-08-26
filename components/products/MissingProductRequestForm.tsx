"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { gaLineClick, gaMissingProductRequestSubmit } from "@/lib/analytics/ga";
import { getMissingProductUiText } from "@/lib/i18n/missingProductUi";
import { parseMissingProductSearchQuery } from "@/lib/rfq/parseMissingProductSearchQuery";
import {
  getRecommendedThreadSizeOptions,
  getThreadSizeOptions,
} from "@/lib/rfq/threadSizeOptions";

const LINE_URL = "https://lin.ee/S676yYH";

type Props = {
  locale: string;
  defaultPartNo?: string;
  searchQuery?: string;
  compactIntro?: boolean;
};

type FormState = {
  partNo: string;
  filterType: string;
  brand: string;
  qty: string;
  machineApplication: string;
  note: string;
  outerDiameter: string;
  innerDiameter: string;
  lengthHeight: string;
  threadSystem: string;
  threadSize: string;
  gasketOD: string;
  gasketID: string;
  contactName: string;
  company: string;
  phone: string;
  email: string;
  lineId: string;
  searchQuery: string;
};

type SubmitResponse = {
  ok?: boolean;
  requestId?: string;
  error?: string;
};

function createInitialState(defaultPartNo = "", searchQuery = ""): FormState {
  const parsedQuery = parseMissingProductSearchQuery(searchQuery);

  return {
    partNo: defaultPartNo,
    filterType: "",
    brand: "",
    qty: "1",
    machineApplication: "",
    note: "",
    outerDiameter: parsedQuery.outerDiameter,
    innerDiameter: parsedQuery.innerDiameter,
    lengthHeight: parsedQuery.lengthHeight,
    threadSystem: "",
    threadSize: parsedQuery.threadSize,
    gasketOD: "",
    gasketID: "",
    contactName: "",
    company: "",
    phone: "",
    email: "",
    lineId: "",
    searchQuery,
  };
}

function normalizeNumericInput(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export default function MissingProductRequestForm({
  locale,
  defaultPartNo = "",
  searchQuery = "",
  compactIntro = false,
}: Props) {
  const text = getMissingProductUiText(locale);
  const pathname = usePathname();
  const [form, setForm] = useState<FormState>(() =>
    createInitialState(defaultPartNo, searchQuery),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successRequestId, setSuccessRequestId] = useState("");
  const threadSizeOptions = useMemo(
    () => getThreadSizeOptions(form.filterType),
    [form.filterType],
  );
  const recommendedThreadSizeOptions = useMemo(
    () => getRecommendedThreadSizeOptions(form.filterType),
    [form.filterType],
  );
  const showThreadRecommendations = recommendedThreadSizeOptions.length > 0;

  useEffect(() => {
    setForm(createInitialState(defaultPartNo, searchQuery));
    setError("");
    setSuccessRequestId("");
  }, [defaultPartNo, searchQuery]);

  const hasProductIdentifier = useMemo(() => {
    return Boolean(
      form.partNo.trim() ||
        form.note.trim() ||
        form.filterType.trim() ||
        form.outerDiameter.trim() ||
        form.innerDiameter.trim() ||
        form.lengthHeight.trim() ||
        form.threadSystem.trim() ||
        form.threadSize.trim() ||
        form.gasketOD.trim() ||
        form.gasketID.trim()
    );
  }, [form]);

  const hasContactMethod = useMemo(() => {
    return Boolean(form.phone.trim() || form.email.trim() || form.lineId.trim());
  }, [form]);

  const handleChange = (field: keyof FormState, value: string) => {
    if (
      field === "qty" ||
      field === "outerDiameter" ||
      field === "innerDiameter" ||
      field === "lengthHeight" ||
      field === "gasketOD" ||
      field === "gasketID"
    ) {
      setForm((prev) => ({ ...prev, [field]: normalizeNumericInput(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQtyBlur = () => {
    const parsed = Number.parseInt(form.qty, 10);
    const nextQty = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    setForm((prev) => ({ ...prev, qty: String(nextQty) }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessRequestId("");

    if (!hasProductIdentifier) {
      setError(text.validationProduct);
      return;
    }

    if (!hasContactMethod) {
      setError(text.validationContact);
      return;
    }

    const qtyValue = Number.parseInt(form.qty, 10);
    if (form.qty.trim() && (!Number.isFinite(qtyValue) || qtyValue < 1)) {
      setError(text.validationQty);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/missing-product-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          ...form,
        }),
      });

      const data = (await response.json()) as SubmitResponse;

      if (!response.ok || !data.ok || !data.requestId) {
        throw new Error(data.error || text.submitError);
      }

      gaMissingProductRequestSubmit({
        request_id: data.requestId,
        filter_type: form.filterType.trim() || undefined,
        has_part_no: Boolean(form.partNo.trim()),
        has_dimensions: Boolean(
          form.outerDiameter.trim() ||
            form.innerDiameter.trim() ||
            form.lengthHeight.trim() ||
            form.threadSize.trim() ||
            form.gasketOD.trim() ||
            form.gasketID.trim(),
        ),
        source_page: pathname || undefined,
        locale,
      });

      setSuccessRequestId(data.requestId);
      setForm(createInitialState(defaultPartNo, searchQuery));
    } catch (submitError) {
      setError(
        submitError instanceof Error && submitError.message
          ? submitError.message
          : text.submitError
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (successRequestId) {
    return (
      <div className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-success-text)] bg-[var(--color-success-soft)] px-5 py-6 shadow-[var(--shadow-sm)]">
        <p className="text-sm font-semibold text-[var(--color-success-text)]">{text.successTitle}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-success-text)]">{text.successBody}</p>
        <div className="mt-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]">
          <span className="font-semibold">{text.requestReference}: </span>
          {successRequestId}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              gaLineClick({
                source: "missing_product_request_success",
                locale,
              });
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-success-text)] bg-[var(--color-success-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-success-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-success-soft)]"
          >
            {text.secondaryButton}
          </a>
          <button
            type="button"
            onClick={() => setSuccessRequestId("")}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-success-soft)]"
          >
            {text.submitLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      id="missing-product-request"
      className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
    >
      <div className="max-w-3xl">
        {!compactIntro && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {text.sectionLabel}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          {text.title}
        </h2>
        {form.searchQuery ? (
          <div className="mt-3 inline-flex max-w-full items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]">
            <span className="truncate">
              {locale === "th" ? "คำค้นหา:" : "Search query:"} {form.searchQuery}
            </span>
          </div>
        ) : null}
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{text.description}</p>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{text.helper}</p>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">{text.productInfo}</h3>

            <div className="space-y-2">
              <label htmlFor="missing-product-part-no" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.partNo}
              </label>
              <input
                id="missing-product-part-no"
                value={form.partNo}
                onChange={(event) => handleChange("partNo", event.target.value)}
                placeholder={text.partNo}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="missing-product-filter-type" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.filterType}
              </label>
              <select
                id="missing-product-filter-type"
                value={form.filterType}
                onChange={(event) => handleChange("filterType", event.target.value)}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              >
                {text.filterTypeOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="missing-product-brand" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.brand}
                </label>
                <input
                  id="missing-product-brand"
                  value={form.brand}
                  onChange={(event) => handleChange("brand", event.target.value)}
                  placeholder={text.brand}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-qty" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.qty}
                </label>
                <input
                  id="missing-product-qty"
                  value={form.qty}
                  onChange={(event) => handleChange("qty", event.target.value.replace(/\D/g, ""))}
                  onBlur={handleQtyBlur}
                  inputMode="numeric"
                  placeholder={text.qty}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="missing-product-machine-application" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.machineApplication}
              </label>
              <input
                id="missing-product-machine-application"
                value={form.machineApplication}
                onChange={(event) => handleChange("machineApplication", event.target.value)}
                placeholder={text.machineApplication}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="missing-product-note" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.note}
              </label>
              <textarea
                id="missing-product-note"
                value={form.note}
                onChange={(event) => handleChange("note", event.target.value)}
                placeholder={text.note}
                rows={4}
                className="w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">{text.dimensions}</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="missing-product-outer-diameter" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.outerDiameter}
                </label>
                <input
                  id="missing-product-outer-diameter"
                  value={form.outerDiameter}
                  onChange={(event) => handleChange("outerDiameter", event.target.value)}
                  placeholder={text.outerDiameter}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-inner-diameter" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.innerDiameter}
                </label>
                <input
                  id="missing-product-inner-diameter"
                  value={form.innerDiameter}
                  onChange={(event) => handleChange("innerDiameter", event.target.value)}
                  placeholder={text.innerDiameter}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-length-height" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.lengthHeight}
                </label>
                <input
                  id="missing-product-length-height"
                  value={form.lengthHeight}
                  onChange={(event) => handleChange("lengthHeight", event.target.value)}
                  placeholder={text.lengthHeight}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-thread-system" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Thread System
                </label>
                <select
                  id="missing-product-thread-system"
                  value={form.threadSystem}
                  onChange={(event) => handleChange("threadSystem", event.target.value)}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                >
                  <option value="">Select thread system</option>
                  <option value="inch_un_npt">Inch / UN / NPT</option>
                  <option value="metric_m">Metric / M</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="missing-product-thread-size" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.threadSize}
                </label>
                <p className="text-xs leading-5 text-[var(--color-text-muted)]">
                  {locale === "th"
                    ? "เลือกประเภทกรองก่อน ระบบจะแนะนำขนาดเกลียวที่พบบ่อย หรือพิมพ์เองได้หากไม่พบในรายการ"
                    : "Select the filter type first for common thread suggestions, or type a custom size if it is not listed."}
                </p>
                {showThreadRecommendations ? (
                  <div className="flex flex-wrap gap-2">
                    {recommendedThreadSizeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleChange("threadSize", option)}
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)] ${
                          form.threadSize === option
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                            : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
                <input
                  id="missing-product-thread-size"
                  list="missing-product-thread-size-options"
                  value={form.threadSize}
                  onChange={(event) => handleChange("threadSize", event.target.value)}
                  placeholder={text.threadSize}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
                <datalist id="missing-product-thread-size-options">
                  {threadSizeOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-gasket-od" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.gasketOD}
                </label>
                <input
                  id="missing-product-gasket-od"
                  value={form.gasketOD}
                  onChange={(event) => handleChange("gasketOD", event.target.value)}
                  placeholder={text.gasketOD}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="missing-product-gasket-id" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {text.gasketID}
                </label>
                <input
                  id="missing-product-gasket-id"
                  value={form.gasketID}
                  onChange={(event) => handleChange("gasketID", event.target.value)}
                  placeholder={text.gasketID}
                  className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">{text.contactInfo}</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="missing-product-contact-name" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.contactName}
              </label>
              <input
                id="missing-product-contact-name"
                value={form.contactName}
                onChange={(event) => handleChange("contactName", event.target.value)}
                placeholder={text.contactName}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="missing-product-company" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.company}
              </label>
              <input
                id="missing-product-company"
                value={form.company}
                onChange={(event) => handleChange("company", event.target.value)}
                placeholder={text.company}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="missing-product-phone" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.phone}
              </label>
              <input
                id="missing-product-phone"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder={text.phone}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="missing-product-email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.email}
              </label>
              <input
                id="missing-product-email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder={text.email}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="missing-product-line-id" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {text.lineId}
              </label>
              <input
                id="missing-product-line-id"
                value={form.lineId}
                onChange={(event) => handleChange("lineId", event.target.value)}
                placeholder={text.lineId}
                className="min-h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[var(--mrt-radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? text.sending : text.submitLabel}
          </button>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              gaLineClick({
                source: "missing_product_request_form",
                locale,
              });
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-success-text)] bg-[var(--color-success-soft)] px-5 py-3 text-sm font-medium text-[var(--color-success-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
          >
            {text.secondaryButton}
          </a>
        </div>
      </form>
    </section>
  );
}
