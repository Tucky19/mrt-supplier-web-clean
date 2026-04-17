// lib/sheets.ts
export type SheetsQuotePayload = {
  quoteId: string;
  createdAt: string;

  customer: {
    company?: string;
    name?: string;
    phone?: string;
    email?: string;
    note?: string;
  };

  items: Array<{
    productId?: string;
    partNo: string;
    brand?: string;
    category?: string;
    spec?: string;
    qty: number;
    note?: string;
  }>;

  source?: string; // optional
};

export async function pushToSheets(payload: SheetsQuotePayload) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!url) throw new Error("Missing GOOGLE_SHEETS_WEBHOOK_URL");
  if (!secret) throw new Error("Missing GOOGLE_SHEETS_WEBHOOK_SECRET");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-mrt-secret": secret,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // Apps Script บางทีตอบเป็น text
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Sheets webhook failed: HTTP ${res.status} ${text}`);
  }

  // ลอง parse json ถ้าได้
  try {
    return JSON.parse(text);
  } catch {
    return { ok: true, raw: text };
  }
}
