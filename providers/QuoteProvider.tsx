'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type QuoteItem = {
  productId: string;
  partNo: string;
  brand?: string;
  title?: string;
  qty: number;
};

type QuoteContextValue = {
  items: QuoteItem[];
  ready: boolean;
  totalItems: number;
  addItem: (item: Omit<QuoteItem, 'qty'> & { qty?: number }) => void;
  setQty: (productId: string, qty: number) => void;
  updateQty: (productId: string, qty: number) => void; // 🔥 ใช้ใน UI ใหม่
  removeItem: (productId: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

const LS_KEY = 'mrt_quote_v1';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);

  /* =========================
     Load from localStorage
  ========================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {}
    setReady(true);
  }, []);

  /* =========================
     Persist
  ========================= */
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, ready]);

  /* =========================
     Add Item
  ========================= */
  const addItem: QuoteContextValue['addItem'] = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);

      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, qty: i.qty + (item.qty ?? 1) }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          qty: item.qty ?? 1,
        },
      ];
    });
  };

  /* =========================
     Set Qty
  ========================= */
  const setQty = (productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  /* =========================
     Alias for new UI
  ========================= */
  const updateQty = setQty;

  /* =========================
     Remove
  ========================= */
  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  /* =========================
     Clear
  ========================= */
  const clear = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        ready,
        totalItems,
        addItem,
        setQty,
        updateQty, // 🔥 สำคัญ
        removeItem,
        clear,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error('useQuote must be used within QuoteProvider');
  }
  return ctx;
}