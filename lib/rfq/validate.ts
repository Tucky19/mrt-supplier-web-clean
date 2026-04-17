export type RfqCustomer = {
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  lineId?: string;
  note?: string;
  contactPref?: string;

  // honeypot (optional)
  website?: string;
};

export type RfqItemInput = {
  productId: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
  spec?: string;
  qty: number;
  meta?: unknown;
};

function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

export function validateRfqPayload(input: unknown) {
  const obj = (input ?? {}) as any;
  const customer = (obj.customer ?? {}) as RfqCustomer;
  const items = (obj.items ?? []) as RfqItemInput[];

  const phone = safeStr(customer.phone);
  const email = safeStr(customer.email);
  const lineId = safeStr(customer.lineId);

  if (!phone && !email && !lineId) {
    return {
      ok: false as const,
      error: "กรุณากรอก Phone หรือ Email หรือ LINE อย่างน้อย 1 ช่อง",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false as const, error: "ไม่มีรายการสินค้าในใบขอราคา" };
  }

  for (const it of items) {
    const qty = Number((it as any)?.qty ?? 0);
    if (!it?.productId || !it?.partNo || !Number.isFinite(qty) || qty <= 0) {
      return {
        ok: false as const,
        error: "ข้อมูลรายการสินค้าไม่ถูกต้อง (productId/partNo/qty)",
      };
    }
  }

  return {
    ok: true as const,
    data: {
      customer: {
        company: safeStr(customer.company) || undefined,
        name: safeStr(customer.name) || undefined,
        phone: phone || undefined,
        email: email || undefined,
        lineId: lineId || undefined,
        note: safeStr(customer.note) || undefined,
        contactPref: safeStr(customer.contactPref) || undefined,
        website: safeStr(customer.website) || undefined, // honeypot passthrough
      },
      items: items.map((x) => ({
        productId: safeStr(x.productId),
        partNo: safeStr(x.partNo),
        brand: safeStr(x.brand) || undefined,
        title: safeStr(x.title) || undefined,
        category: safeStr(x.category) || undefined,
        spec: safeStr(x.spec) || undefined,
        qty: Number(x.qty),
        meta: (x as any).meta ?? undefined,
      })),
    },
  };
}