import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QuoteProvider } from "@/providers/QuoteProvider";
import ToastProvider from "@/providers/ToastProvider";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

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