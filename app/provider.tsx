"use client";

import { ReactNode } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { QuoteProvider } from "@/providers/QuoteProvider";

type Props = {
  children: ReactNode;
};

export default function Provider({ children }: Props) {
  return (
    <ToastProvider>
      <QuoteProvider>{children}</QuoteProvider>
    </ToastProvider>
  );
}