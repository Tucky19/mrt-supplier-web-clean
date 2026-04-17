"use client";

import { FilePlus2 } from "lucide-react";
import toast from "react-hot-toast";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
  product: {
    id: string;
    partNo?: string;
    brand?: string;
    title?: string;
  };
  className?: string;
  label?: string;
};

export default function AddToQuoteButton({
  locale,
  product,
  className,
  label,
}: Props) {
  const { addItem } = useQuote();

  function onClick() {
    addItem({
      productId: product.id,
      partNo: product.partNo || product.id,
      brand: product.brand,
      title: product.title,
      qty: 1,
    });

    toast.success(
      locale === "th"
        ? `เพิ่ม ${product.partNo || product.id} ในใบขอราคาแล้ว`
        : `Added ${product.partNo || product.id} to quote`
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
      }
    >
      <FilePlus2 className="h-4 w-4" />
      {label || (locale === "th" ? "เพิ่มในใบขอราคา" : "Add to Quote")}
    </button>
  );
}