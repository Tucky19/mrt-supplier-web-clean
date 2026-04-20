'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  rfqId: string;
};

export function RfqFollowUpForm({ rfqId }: Props) {
  const router = useRouter();
  const [dueAt, setDueAt] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!dueAt) {
      setMessage('Please select due date');
      return;
    }

    const res = await fetch(`/api/admin/rfq/${rfqId}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueAt, note }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setMessage(data.error || 'Failed to create follow-up');
      return;
    }

    setDueAt('');
    setNote('');
    setMessage('Follow-up created');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Due date</label>
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="เช่น โทรกลับวันจันทร์ / รอซัพพลายเออร์ตอบ"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Add Follow-up'}
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
