'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  rfqId: string;
  initialQuoteRef?: string | null;
  initialQuotedBy?: string | null;
  initialQuoteAmount?: number | null;
  initialQuoteCurrency?: string | null;
  initialQuotedAt?: string | null;
  initialValidUntil?: string | null;
  initialQuoteDocumentUrl?: string | null;
  initialQuoteSentAt?: string | null;
  initialQuoteSentNote?: string | null;
};

function toDatetimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function RfqQuoteForm({
  rfqId,
  initialQuoteRef,
  initialQuotedBy,
  initialQuoteAmount,
  initialQuoteCurrency,
  initialQuotedAt,
  initialValidUntil,
  initialQuoteDocumentUrl,
  initialQuoteSentAt,
  initialQuoteSentNote,
}: Props) {
  const router = useRouter();
  const [quoteRef, setQuoteRef] = useState(initialQuoteRef ?? '');
  const [quotedBy, setQuotedBy] = useState(initialQuotedBy ?? '');
  const [quoteAmount, setQuoteAmount] = useState(
    initialQuoteAmount != null ? String(initialQuoteAmount) : ''
  );
  const [quoteCurrency, setQuoteCurrency] = useState(initialQuoteCurrency ?? 'THB');
  const [quotedAt, setQuotedAt] = useState(toDatetimeLocal(initialQuotedAt));
  const [validUntil, setValidUntil] = useState(toDatetimeLocal(initialValidUntil));
  const [quoteDocumentUrl, setQuoteDocumentUrl] = useState(initialQuoteDocumentUrl ?? '');
  const [quoteSentAt, setQuoteSentAt] = useState(toDatetimeLocal(initialQuoteSentAt));
  const [quoteSentNote, setQuoteSentNote] = useState(initialQuoteSentNote ?? '');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const commonHeaders = { 'Content-Type': 'application/json' };

    const recordRes = await fetch(`/api/admin/rfq/${rfqId}/quote-record`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        quoteRef,
        quotedBy,
        quoteAmount,
        quoteCurrency,
        quotedAt: quotedAt || null,
        validUntil: validUntil || null,
      }),
    });

    const recordData = await recordRes.json().catch(() => null);

    if (!recordRes.ok || !recordData?.ok) {
      setMessage(recordData?.error || 'Failed to update quote');
      return;
    }

    const documentRes = await fetch(`/api/admin/rfq/${rfqId}/quote-document`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        quoteDocumentUrl,
        quoteSentAt: quoteSentAt || null,
        quoteSentNote,
      }),
    });

    const documentData = await documentRes.json().catch(() => null);

    if (!documentRes.ok || !documentData?.ok) {
      setMessage(documentData?.error || 'Failed to update quote');
      return;
    }

    setMessage('Quote updated');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Quote Ref</label>
        <input
          value={quoteRef}
          onChange={(e) => setQuoteRef(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="QT-20260419-001"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quoted By</label>
        <input
          value={quotedBy}
          onChange={(e) => setQuotedBy(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="ชื่อผู้ดูแลใบเสนอราคา"
          disabled={isPending}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Quote Amount</label>
          <input
            type="number"
            step="0.01"
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Currency</label>
          <input
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quoted At</label>
        <input
          type="datetime-local"
          value={quotedAt}
          onChange={(e) => setQuotedAt(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Valid Until</label>
        <input
          type="datetime-local"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quote Document URL</label>
        <input
          value={quoteDocumentUrl}
          onChange={(e) => setQuoteDocumentUrl(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="https://..."
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quote Sent At</label>
        <input
          type="datetime-local"
          value={quoteSentAt}
          onChange={(e) => setQuoteSentAt(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quote Sent Note</label>
        <textarea
          value={quoteSentNote}
          onChange={(e) => setQuoteSentNote(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="เช่น ส่งทางอีเมลแล้ว / ลูกค้าขอแก้ qty"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Update Quote'}
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
