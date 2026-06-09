"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gaSubmitRFQ, type GAItem } from "@/lib/analytics/ga";

const RFQ_SUCCESS_STORAGE_KEY = "mrt_rfq_success_data";

type StoredRFQSuccess = {
  request_id?: string;
  item_count?: number;
  total_quantity?: number;
  locale?: string;
  source?: string;
  ecommerce?: {
    transaction_id?: string;
    items?: GAItem[];
  };
};

type Props = {
  locale: string;
};

function safeString(value: unknown) {
  return String(value ?? "").trim();
}

function readStoredSuccess(): StoredRFQSuccess | null {
  try {
    const raw = sessionStorage.getItem(RFQ_SUCCESS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredRFQSuccess;
  } catch {
    return null;
  }
}

export default function RFQSuccessDataLayer({ locale }: Props) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const stored = readStoredSuccess();

    if (!stored) return;

    const requestId =
      safeString(searchParams.get("rid")) ||
      safeString(searchParams.get("id")) ||
      safeString(searchParams.get("requestId")) ||
      safeString(stored?.request_id);

    const items = Array.isArray(stored?.ecommerce?.items)
      ? stored.ecommerce.items
      : [];

    gaSubmitRFQ(items, {
      request_id: requestId || undefined,
      item_count: Number(stored?.item_count ?? items.length),
      total_quantity: Number(
        stored?.total_quantity ??
          items.reduce((sum, item) => sum + Number(item.quantity ?? 1), 0),
      ),
      locale: safeString(stored?.locale) || locale,
      source: safeString(stored?.source) || "quote_success_page",
      ecommerce: {
        transaction_id:
          requestId || safeString(stored?.ecommerce?.transaction_id),
        items,
      },
    });

    try {
      sessionStorage.removeItem(RFQ_SUCCESS_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }, [locale, searchParams]);

  return null;
}
