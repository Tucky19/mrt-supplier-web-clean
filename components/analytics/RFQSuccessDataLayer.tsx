"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gaSubmitRFQ, type GAItem } from "@/lib/analytics/ga";

const RFQ_SUCCESS_STORAGE_KEY = "mrt_rfq_success_data";

type StoredRFQSuccess = {
  eligible_for_lead?: boolean;
  meta_receipt?: string;
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

    if (!stored || stored.eligible_for_lead !== true) return;

    const requestId = safeString(stored.request_id);
    const routeId = safeString(searchParams.get("rid"));
    if (!requestId || requestId === "OK" || (routeId && routeId !== requestId)) return;

    const items = Array.isArray(stored?.ecommerce?.items)
      ? stored.ecommerce.items
      : [];

    const queued = gaSubmitRFQ(items, {
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
    }, typeof stored.meta_receipt === "string" ? stored.meta_receipt : undefined);

    try {
      if (queued) sessionStorage.removeItem(RFQ_SUCCESS_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }, [locale, searchParams]);

  return null;
}
