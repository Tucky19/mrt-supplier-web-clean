'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuote } from '@/providers/QuoteProvider';

export default function QuotePage() {
  const { items, addItem, removeItem, updateQty, clear } = useQuote();
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const isThai = locale === 'th';
  const requestedPartNo = searchParams.get('partNo')?.trim() ?? '';

  const [loading, setLoading] = useState(false);
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
      brand: 'Manual Request',
      title: isThai ? 'Requested part number' : 'Requested part number',
      qty: 1,
    });
  }, [addItem, isThai, items, requestedPartNo]);

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert(isThai ? 'กรุณาเพิ่มอย่างน้อย 1 รายการ' : 'Please add at least 1 item');
      return;
    }

    if (!form.name.trim()) {
      alert(isThai ? 'กรุณากรอกชื่อผู้ติดต่อ' : 'Please provide your name');
      return;
    }

    if (!form.phone && !form.email && !form.lineId) {
      alert(
        isThai
          ? 'กรุณากรอกเบอร์โทร อีเมล หรือ LINE อย่างน้อย 1 ช่องทาง'
          : 'Please provide phone, email, or LINE'
      );
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

      clear();

      const rid = data.requestId
        ? `?rid=${encodeURIComponent(data.requestId)}`
        : '';

      window.location.href = `/${locale}/quote/success${rid}`;
    } catch {
      alert(isThai ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'Something went wrong');
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
              {isThai ? 'กลับหน้าแรก' : 'Back to Home'}
            </Link>

            <Link
              href={`/${locale}/products`}
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
            >
              {isThai ? 'กลับไปค้นหาสินค้า' : 'Back to Products'}
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            RFQ
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {isThai ? 'ขอใบเสนอราคา' : 'Request for Quotation'}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {isThai
              ? 'ส่งรายการสินค้าให้ทีม MRT Supplier ตรวจสอบ Part Number, Cross Reference และเสนอราคากลับได้ทันที'
              : 'Send your item list to MRT Supplier for part number review, cross-reference support, and fast quotation follow-up.'}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? 'เวลาตอบกลับ' : 'Response Time'}
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {isThai ? 'ทีมงานตอบกลับภายใน 24 ชั่วโมง' : 'Our team responds within 24 hours.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Cross Reference
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {isThai
                ? 'รองรับการช่วยเทียบรหัส OEM และ aftermarket'
                : 'We support OEM and aftermarket cross-reference matching.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? 'ช่องทางติดต่อ' : 'Contact Method'}
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {isThai
                ? 'กรอกโทรศัพท์ อีเมล หรือ LINE อย่างน้อย 1 ช่องทาง'
                : 'Provide phone, email, or LINE for follow-up.'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {isThai ? 'รายการสินค้าที่ต้องการ' : 'Quote Items'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isThai
                    ? `${items.length} รายการในใบขอราคา`
                    : `${items.length} items in your RFQ list`}
                </p>
              </div>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                  {isThai ? 'ล้างทั้งหมด' : 'Clear all'}
                </button>
              )}
            </div>

            <div className="mt-5 space-y-4">
              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-base font-medium text-slate-900">
                    {isThai
                      ? 'ยังไม่มีรายการสินค้าในใบขอราคา'
                      : 'No items yet in your RFQ list.'}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {isThai
                      ? 'เริ่มจากค้นหา Part Number แล้วเพิ่มสินค้าเข้ามาก่อนส่ง RFQ'
                      : 'Start by searching a part number, then add products before submitting your RFQ.'}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      {isThai ? 'ค้นหาสินค้า' : 'Browse Products'}
                    </Link>

                    <Link
                      href={`/${locale}`}
                      className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      {isThai ? 'กลับหน้าแรก' : 'Back to Home'}
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
                      <div className="text-base font-semibold text-slate-950">
                        {item.partNo}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.brand || item.title || (isThai ? 'Requested item' : 'Requested item')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      {isThai ? 'ลบ' : 'Remove'}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {isThai ? 'จำนวน' : 'Quantity'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>

                      <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {isThai ? 'ข้อมูลสำหรับติดต่อกลับ' : 'Contact Details'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isThai
                  ? 'กรอกข้อมูลให้ครบเท่าที่สะดวก เพื่อให้ทีมงานติดตามกลับได้เร็วขึ้น'
                  : 'Provide the details you have available so our team can follow up quickly.'}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder={isThai ? 'ชื่อผู้ติดต่อ' : 'Your Name'}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  placeholder={isThai ? 'บริษัท (ถ้ามี)' : 'Company (optional)'}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <input
                placeholder={isThai ? 'เบอร์โทร' : 'Phone'}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="LINE ID"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={form.lineId}
                onChange={(e) => setForm({ ...form, lineId: e.target.value })}
              />

              <textarea
                placeholder={isThai ? 'หมายเหตุเพิ่มเติม (ถ้ามี)' : 'Additional note (optional)'}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                rows={4}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {isThai ? 'ใช้สำหรับติดต่อกลับ' : 'Required for Follow-Up'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {isThai
                    ? 'กรอกอย่างน้อย 1 ช่องทาง: เบอร์โทร, อีเมล หรือ LINE'
                    : 'Provide at least one contact method: phone, email, or LINE.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading
                ? isThai
                  ? 'กำลังส่ง...'
                  : 'Sending...'
                : isThai
                  ? 'ส่งใบขอราคา'
                  : 'Submit RFQ'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
