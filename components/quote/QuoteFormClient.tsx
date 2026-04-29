"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
};

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  lineId: string;
  note: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  lineId: "",
  note: "",
};

export default function QuoteFormClient({ locale }: Props) {
  const router = useRouter();
  const { items, clear } = useQuote();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (items.length === 0) {
      return "Please add at least 1 item";
    }

    if (!form.name.trim()) {
      return "Please provide your name";
    }

    if (!form.phone.trim() && !form.email.trim() && !form.lineId.trim()) {
      return "Please provide phone, email, or LINE";
    }

    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      customer: {
        name: form.name.trim(),
        company: form.company.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        lineId: form.lineId.trim() || undefined,
        note: form.note.trim() || undefined,
      },
      items,
    };

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "RFQ failed");
      }

      clear();
      router.push(`/${locale}/quote/success?rid=${data.requestId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to submit RFQ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={form.name}
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Your Name"
        className="w-full rounded-lg border px-4 py-2"
      />

      <input
        value={form.company}
        onChange={(event) => updateField("company", event.target.value)}
        placeholder="Company"
        className="w-full rounded-lg border px-4 py-2"
      />

      <input
        value={form.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        placeholder="Phone"
        className="w-full rounded-lg border px-4 py-2"
      />

      <input
        value={form.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="Email"
        className="w-full rounded-lg border px-4 py-2"
      />

      <input
        value={form.lineId}
        onChange={(event) => updateField("lineId", event.target.value)}
        placeholder="LINE ID"
        className="w-full rounded-lg border px-4 py-2"
      />

      <textarea
        value={form.note}
        onChange={(event) => updateField("note", event.target.value)}
        placeholder="Additional note"
        rows={4}
        className="w-full rounded-lg border px-4 py-2"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-900 py-3 text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Submit RFQ"}
      </button>
    </form>
  );
}
