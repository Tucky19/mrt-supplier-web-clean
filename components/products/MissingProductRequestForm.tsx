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
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-emerald-900">{text.successTitle}</p>
        <p className="mt-2 text-sm leading-6 text-emerald-800">{text.successBody}</p>
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900">
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
            className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {text.secondaryButton}
          </a>
          <button
            type="button"
            onClick={() => setSuccessRequestId("")}
            className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100"
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
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="max-w-3xl">
        {!compactIntro && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {text.sectionLabel}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {text.title}
        </h2>
        {form.searchQuery ? (
          <div className="mt-3 inline-flex max-w-full items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <span className="truncate">
              {locale === "th" ? "คำค้นหา:" : "Search query:"} {form.searchQuery}
            </span>
          </div>
        ) : null}
        <p className="mt-3 text-sm leading-7 text-slate-600">{text.description}</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">{text.helper}</p>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">{text.productInfo}</h3>

            <input
              value={form.partNo}
              onChange={(event) => handleChange("partNo", event.target.value)}
              placeholder={text.partNo}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={form.filterType}
              onChange={(event) => handleChange("filterType", event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {text.filterTypeOptions.map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.brand}
                onChange={(event) => handleChange("brand", event.target.value)}
                placeholder={text.brand}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                value={form.qty}
                onChange={(event) => handleChange("qty", event.target.value.replace(/\D/g, ""))}
                onBlur={handleQtyBlur}
                inputMode="numeric"
                placeholder={text.qty}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <input
              value={form.machineApplication}
              onChange={(event) => handleChange("machineApplication", event.target.value)}
              placeholder={text.machineApplication}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            <textarea
              value={form.note}
              onChange={(event) => handleChange("note", event.target.value)}
              placeholder={text.note}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">{text.dimensions}</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.outerDiameter}
                onChange={(event) => handleChange("outerDiameter", event.target.value)}
                placeholder={text.outerDiameter}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                value={form.innerDiameter}
                onChange={(event) => handleChange("innerDiameter", event.target.value)}
                placeholder={text.innerDiameter}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                value={form.lengthHeight}
                onChange={(event) => handleChange("lengthHeight", event.target.value)}
                placeholder={text.lengthHeight}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Thread System
                </label>
                <select
                  value={form.threadSystem}
                  onChange={(event) => handleChange("threadSystem", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select thread system</option>
                  <option value="inch_un_npt">Inch / UN / NPT</option>
                  <option value="metric_m">Metric / M</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {text.threadSize}
                </label>
                <p className="text-xs leading-5 text-slate-500">
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
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          form.threadSize === option
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
                <input
                  list="missing-product-thread-size-options"
                  value={form.threadSize}
                  onChange={(event) => handleChange("threadSize", event.target.value)}
                  placeholder={text.threadSize}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <datalist id="missing-product-thread-size-options">
                  {threadSizeOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
              <input
                value={form.gasketOD}
                onChange={(event) => handleChange("gasketOD", event.target.value)}
                placeholder={text.gasketOD}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                value={form.gasketID}
                onChange={(event) => handleChange("gasketID", event.target.value)}
                placeholder={text.gasketID}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{text.contactInfo}</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={form.contactName}
              onChange={(event) => handleChange("contactName", event.target.value)}
              placeholder={text.contactName}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              value={form.company}
              onChange={(event) => handleChange("company", event.target.value)}
              placeholder={text.company}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder={text.phone}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder={text.email}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              value={form.lineId}
              onChange={(event) => handleChange("lineId", event.target.value)}
              placeholder={text.lineId}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:col-span-2"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
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
            className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            {text.secondaryButton}
          </a>
        </div>
      </form>
    </section>
  );
}
