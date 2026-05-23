'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import BulkAddToQuote from '@/components/quote/BulkAddToQuote';
import { gaSubmitRFQ } from '@/lib/analytics/ga';
import { getRfqUiText } from '@/lib/i18n/rfqUi';
import { useQuote } from '@/providers/QuoteProvider';

function sanitizeQuantityInput(value: string) {
  return value.replace(/\D+/g, '');
}

function normalizeQuantity(value: string) {
  return Math.max(1, Number.parseInt(sanitizeQuantityInput(value), 10) || 1);
}

export default function QuotePage() {
  const { items, addItem, removeItem, updateQty, clear } = useQuote();
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'th';
  const text = getRfqUiText(locale);
  const requestedPartNo = searchParams.get('partNo')?.trim() ?? '';
  const hasQuoteItems = items.length > 0;

  const [loading, setLoading] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    lineId: '',
    note: '',
  });

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

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert(text.alertAddItem);
      return;
    }

    if (!form.name.trim()) {
      alert(text.alertName);
      return;
    }

    if (!form.phone && !form.email && !form.lineId) {
      alert(text.alertContact);
      return;
    }

    setLoading(true);

    try {
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

      gaSubmitRFQ(
        items.map((item) => ({
          item_id: item.partNo || item.productId,
          item_brand: item.brand,
          quantity: item.qty,
        })),
        {
          request_id: data.requestId ? String(data.requestId) : undefined,
          source: 'quote_page',
        },
      );

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
      alert(text.alertSubmitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
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

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                  {text.clearAll}
                </button>
              )}
            </div>

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
                  key={item.partNo}
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

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{text.contactDetails}</h2>
              <p className="mt-1 text-sm text-slate-500">{text.contactDetailsBody}</p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder={text.yourName}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  placeholder={text.companyOptional}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <input
                placeholder={text.phone}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder={text.email}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder={text.lineId}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.lineId}
                onChange={(e) => setForm({ ...form, lineId: e.target.value })}
              />

              <textarea
                placeholder={text.additionalNote}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                rows={4}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {text.followUpRequired}
                </p>
                <p className="mt-2 text-sm text-slate-600">{text.followUpRequiredBody}</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !hasQuoteItems}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-black disabled:opacity-60"
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
          </section>
        </div>
      </div>
    </div>
  );
}
