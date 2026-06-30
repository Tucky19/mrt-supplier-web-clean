'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TrackedLineLink from '@/components/analytics/TrackedLineLink';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import BulkAddToQuote from '@/components/quote/BulkAddToQuote';
import CopyButton from '@/components/ui/CopyButton';
import { gaBeginCheckout, gaViewCart, type GAItem } from '@/lib/analytics/ga';
import { getRfqUiText } from '@/lib/i18n/rfqUi';
import { useQuote } from '@/providers/QuoteProvider';

const RFQ_SUCCESS_STORAGE_KEY = 'mrt_rfq_success_data';
const LINE_URL = 'https://lin.ee/S676yYH';

type ContactForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  lineId: string;
  note: string;
};

type FormErrors = {
  items?: string;
  name?: string;
  contact?: string;
  submit?: string;
};

function sanitizeQuantityInput(value: string) {
  return value.replace(/\D+/g, '');
}

function normalizeQuantity(value: string) {
  return Math.max(1, Number.parseInt(sanitizeQuantityInput(value), 10) || 1);
}

function getQuoteDataLayerItems(
  items: Array<{
    productId: string;
    partNo: string;
    brand?: string;
    title?: string;
    qty: number;
  }>,
): GAItem[] {
  return items.map((item) => ({
    item_id: item.partNo || item.productId,
    item_name: item.title || item.partNo,
    item_brand: item.brand,
    quantity: item.qty,
  }));
}

export default function QuotePage() {
  const { items, addItem, removeItem, updateQty, clear } = useQuote();
  const hasTrackedViewCartRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'th';
  const text = getRfqUiText(locale);
  const requestedPartNo = searchParams.get('partNo')?.trim() ?? '';
  const hasQuoteItems = items.length > 0;
  const dataLayerItems = useMemo(() => getQuoteDataLayerItems(items), [items]);
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const [loading, setLoading] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ContactForm>({
    name: '',
    company: '',
    phone: '',
    email: '',
    lineId: '',
    note: '',
  });
  const lineSummary = useMemo(
    () =>
      [
        'MRT Supplier RFQ',
        ...items.map((item) => `${item.partNo} x ${item.qty}`),
      ].join('\n'),
    [items],
  );

  useEffect(() => {
    if (!requestedPartNo) return;

    const manualProductId = `manual:${requestedPartNo.toLowerCase()}`;
    const alreadyAdded = items.some((item) => item.productId === manualProductId);

    if (alreadyAdded) return;

    addItem({
      productId: manualProductId,
      partNo: requestedPartNo,
      brand: text.manualRequest,
      title: text.requestedPartNumber,
      qty: 1,
    });
  }, [addItem, items, requestedPartNo, text.manualRequest, text.requestedPartNumber]);

  useEffect(() => {
    setQuantityInputs((prev) => {
      const next: Record<string, string> = {};

      for (const item of items) {
        next[item.productId] = prev[item.productId] ?? String(item.qty);
      }

      return next;
    });
  }, [items]);

  useEffect(() => {
    if (items.length === 0 || hasTrackedViewCartRef.current) return;

    gaViewCart(dataLayerItems, {
      item_count: items.length,
      total_quantity: totalQuantity,
      locale,
      page_location: window.location.href,
    });

    hasTrackedViewCartRef.current = true;
  }, [dataLayerItems, items.length, locale, totalQuantity]);

  const handleQuantityChange = (productId: string, value: string) => {
    const sanitized = sanitizeQuantityInput(value);

    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: sanitized,
    }));

    if (!sanitized) return;

    updateQty(productId, normalizeQuantity(sanitized));
  };

  const handleQuantityBlur = (productId: string) => {
    const rawValue = quantityInputs[productId] ?? '';
    const nextQty = normalizeQuantity(rawValue);

    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: String(nextQty),
    }));

    updateQty(productId, nextQty);
  };

  const handleQuantityStep = (productId: string, nextQty: number) => {
    const normalizedQty = Math.max(1, nextQty);

    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: String(normalizedQty),
    }));

    updateQty(productId, normalizedQty);
  };

  const updateFormField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (field === 'name') {
      setFormErrors((current) => ({ ...current, name: undefined, submit: undefined }));
    } else if (field === 'phone' || field === 'email' || field === 'lineId') {
      setFormErrors((current) => ({ ...current, contact: undefined, submit: undefined }));
    } else {
      setFormErrors((current) => ({ ...current, submit: undefined }));
    }
  };

  const handleConfirmClear = () => {
    clear();
    setConfirmingClear(false);
    setFormErrors((current) => ({ ...current, items: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});

    if (items.length === 0) {
      setFormErrors({ items: text.alertAddItem });
      return;
    }

    if (!form.name.trim()) {
      setFormErrors({ name: text.alertName });
      nameInputRef.current?.focus();
      return;
    }

    if (!form.phone.trim() && !form.email.trim() && !form.lineId.trim()) {
      setFormErrors({ contact: text.alertContact });
      phoneInputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      gaBeginCheckout(dataLayerItems, {
        item_count: items.length,
        total_quantity: totalQuantity,
        locale,
        source: 'quote_page',
      });

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || 'RFQ failed');
      }

      try {
        sessionStorage.setItem(
          RFQ_SUCCESS_STORAGE_KEY,
          JSON.stringify({
            request_id: data.requestId ? String(data.requestId) : '',
            item_count: items.length,
            total_quantity: totalQuantity,
            locale,
            source: 'quote_page',
            ecommerce: {
              transaction_id: data.requestId ? String(data.requestId) : '',
              items: dataLayerItems,
            },
          }),
        );
      } catch {
        // ignore storage failures
      }

      clear();

      const nextParams = new URLSearchParams();

      if (data.requestId) {
        nextParams.set('rid', String(data.requestId));
      }

      if (data.partialFailure) {
        nextParams.set('pf', '1');
      }

      if (Array.isArray(data.sideEffectFailures) && data.sideEffectFailures.length > 0) {
        nextParams.set('fx', data.sideEffectFailures.join(','));
      }

      if (data.lineNotifyOk === false) {
        nextParams.set('line', '0');
      }

      const query = nextParams.toString();
      window.location.href = `/${locale}/quote/success${query ? `?${query}` : ''}`;
    } catch {
      setFormErrors({ submit: text.alertSubmitError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader locale={locale} />
      <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
            >
              {text.backToHome}
            </Link>

            <Link
              href={`/${locale}/products`}
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
            >
              {text.backToProducts}
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            RFQ
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {text.quoteTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {text.quoteIntro}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {text.responseTime}
            </div>
            <p className="mt-2 text-sm text-slate-700">{text.responseTimeBody}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {text.crossReference}
            </div>
            <p className="mt-2 text-sm text-slate-700">{text.crossReferenceBody}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {text.contactMethod}
            </div>
            <p className="mt-2 text-sm text-slate-700">{text.contactMethodBody}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{text.quoteItems}</h2>
                <p className="mt-1 text-sm text-slate-500">{text.itemsInList(items.length)}</p>
              </div>

              {items.length > 0 && !confirmingClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmingClear(true)}
                  className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                  {text.clearAll}
                </button>
              ) : null}
            </div>

            {confirmingClear ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-900">{text.clearConfirm}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(false)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
                  >
                    {text.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="rounded-lg bg-amber-900 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                  >
                    {text.confirmClear}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <BulkAddToQuote locale={locale} />

              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-base font-medium text-slate-900">{text.noItemsTitle}</p>
                  <p className="mt-2 text-sm text-slate-500">{text.noItemsBody}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      {text.browseProducts}
                    </Link>

                    <Link
                      href={`/${locale}`}
                      className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      {text.backToHome}
                    </Link>
                  </div>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-950">{item.partNo}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.brand || item.title || text.requestedItem}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      {text.remove}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {text.quantity}
                    </div>

                    <div className="w-full max-w-[220px] rounded-[16px] border border-slate-200 bg-white/80 p-1.5 sm:w-auto">
                      <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityStep(item.productId, item.qty - 1)}
                        aria-label={`${text.decreaseQuantity} ${item.partNo}`}
                        className="inline-flex min-h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                      >
                        -
                      </button>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-label={`${text.quantity} ${item.partNo}`}
                        value={quantityInputs[item.productId] ?? String(item.qty)}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        onBlur={() => handleQuantityBlur(item.productId)}
                        className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                      />

                      <button
                        type="button"
                        onClick={() => handleQuantityStep(item.productId, item.qty + 1)}
                        aria-label={`${text.increaseQuantity} ${item.partNo}`}
                        className="inline-flex min-h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                      >
                        +
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="scroll-mt-24 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{text.contactDetails}</h2>
              <p className="mt-1 text-sm text-slate-500">{text.contactDetailsBody}</p>
              <p className="mt-2 text-xs text-slate-500">{text.requiredHelper}</p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rfq-name" className="block text-sm font-medium text-slate-800">
                    {text.yourName} <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="rfq-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? 'rfq-name-error' : undefined}
                    className={`mt-2 w-full scroll-mt-24 rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      formErrors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                    value={form.name}
                    onChange={(event) => updateFormField('name', event.target.value)}
                  />
                  {formErrors.name ? (
                    <p id="rfq-name-error" className="mt-2 text-sm text-red-700">
                      {formErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="rfq-company" className="block text-sm font-medium text-slate-800">
                    {text.company} <span className="font-normal text-slate-500">({text.optional})</span>
                  </label>
                  <input
                    id="rfq-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="mt-2 w-full scroll-mt-24 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={form.company}
                    onChange={(event) => updateFormField('company', event.target.value)}
                  />
                </div>
              </div>

              <fieldset
                aria-describedby={formErrors.contact ? 'rfq-contact-error' : 'rfq-contact-helper'}
                className={`rounded-2xl border p-4 ${
                  formErrors.contact ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <legend className="px-1 text-sm font-semibold text-slate-900">
                  {text.contactMethodRequired} <span className="text-red-600">*</span>
                </legend>
                <p id="rfq-contact-helper" className="mt-1 text-xs leading-5 text-slate-500">
                  {text.followUpRequiredBody}
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="rfq-phone" className="block text-sm font-medium text-slate-800">
                      {text.phone}
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="rfq-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(formErrors.contact)}
                      className="mt-2 w-full scroll-mt-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      value={form.phone}
                      onChange={(event) => updateFormField('phone', event.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-email" className="block text-sm font-medium text-slate-800">
                      {text.email}
                    </label>
                    <input
                      id="rfq-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={Boolean(formErrors.contact)}
                      className="mt-2 w-full scroll-mt-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      value={form.email}
                      onChange={(event) => updateFormField('email', event.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-line" className="block text-sm font-medium text-slate-800">
                      {text.lineId}
                    </label>
                    <input
                      id="rfq-line"
                      name="lineId"
                      type="text"
                      autoComplete="off"
                      aria-invalid={Boolean(formErrors.contact)}
                      className="mt-2 w-full scroll-mt-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      value={form.lineId}
                      onChange={(event) => updateFormField('lineId', event.target.value)}
                    />
                  </div>
                </div>

                {formErrors.contact ? (
                  <p id="rfq-contact-error" className="mt-3 text-sm font-medium text-red-700">
                    {formErrors.contact}
                  </p>
                ) : null}
              </fieldset>

              <div>
                <label htmlFor="rfq-note" className="block text-sm font-medium text-slate-800">
                  {text.additionalNoteLabel} <span className="font-normal text-slate-500">({text.optional})</span>
                </label>
                <textarea
                  id="rfq-note"
                  name="note"
                  className="mt-2 w-full scroll-mt-24 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows={4}
                  value={form.note}
                  onChange={(event) => updateFormField('note', event.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {text.followUpRequired}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text.contactUseNote}</p>
              </div>
            </div>

            {formErrors.items || formErrors.submit ? (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.items || formErrors.submit}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !hasQuoteItems}
              className="mt-6 w-full scroll-mb-24 rounded-xl bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {!hasQuoteItems
                ? text.addProductsBeforeSubmitting
                : loading
                  ? text.sending
                  : text.submitRfq}
            </button>

            {!hasQuoteItems && (
              <p className="mt-3 text-sm text-slate-500">
                {text.emptySubmitHelper}
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-950">{text.lineContinueTitle}</p>
              <p className="mt-1 text-xs leading-5 text-emerald-800">{text.lineContinueBody}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <CopyButton
                  value={lineSummary}
                  label={text.copyRfqList}
                  copiedLabel={text.copiedRfqList}
                  disabled={!hasQuoteItems}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <TrackedLineLink
                  href={LINE_URL}
                  source="quote_page_contact_card"
                  locale={locale}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {text.openLine}
                </TrackedLineLink>
              </div>
            </div>
          </form>
        </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
