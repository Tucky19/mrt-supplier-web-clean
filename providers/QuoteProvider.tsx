"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type QuoteItem = {
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
  addItem: (item: Omit<QuoteItem, "qty"> & { qty?: number }) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);
const LS_KEY = "mrt_quote_v1";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QuoteItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item) => ({
              ...item,
              qty: Math.max(1, Math.min(999, Number(item.qty) || 1)),
            }))
          );
        }
      }
    } catch {
      // ignore
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, ready]);

  function addItem(item: Omit<QuoteItem, "qty"> & { qty?: number }) {
    const nextQty = Math.max(1, Math.min(999, Number(item.qty) || 1));

    setItems((prev) => {
      const index = prev.findIndex((x) => x.productId === item.productId);

      if (index >= 0) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          qty: Math.max(1, Math.min(999, next[index].qty + nextQty)),
        };
        return next;
      }

      return [
        ...prev,
        {
          productId: item.productId,
          partNo: item.partNo,
          brand: item.brand,
          title: item.title,
          qty: nextQty,
        },
      ];
    });
  }

  function setQty(productId: string, qty: number) {
    const nextQty = Math.max(1, Math.min(999, Number(qty) || 1));
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: nextQty } : item
      )
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value: QuoteContextValue = {
    items,
    ready,
    totalItems,
    addItem,
    setQty,
    removeItem,
    clear,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return ctx;
}