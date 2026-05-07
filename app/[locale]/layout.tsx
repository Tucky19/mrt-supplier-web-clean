import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import AppProviders from "@/app/providers";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <AppProviders locale={locale} messages={messages}>
      {children}
    </AppProviders>
  );
}
