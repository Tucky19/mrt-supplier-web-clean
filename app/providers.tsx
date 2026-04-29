"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import { QuoteProvider } from "@/providers/QuoteProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

type Props = {
  children: ReactNode;
  locale: string;
  messages: any;
};

export default function AppProviders({
  children,
  locale,
  messages,
}: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QuoteProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QuoteProvider>
    </NextIntlClientProvider>
  );
}