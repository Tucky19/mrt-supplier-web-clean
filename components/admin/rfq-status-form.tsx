'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  rfqId: string;
  currentStatus: string;
};

const statuses = ['new', 'in_progress', 'quoted', 'closed', 'spam'];

export function RfqStatusForm({ rfqId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const res = await fetch(`/api/admin/rfq/${rfqId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setMessage(data.error || 'Failed to update status');
      return;
    }

    setMessage('Status updated');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={isPending}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Update Status'}
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
