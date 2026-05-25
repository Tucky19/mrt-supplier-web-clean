import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import AppProviders from "@/app/providers";
import JsonLd from "@/components/seo/JsonLd";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const SITE_URL = "https://mrtsupplier.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MRT Supplier Co., Ltd.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mrt.png`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+66 97 012 2111",
      contactType: "sales",
      areaServed: "TH",
      availableLanguage: ["Thai", "English"],
    },
  ],
  sameAs: ["https://lin.ee/S676yYH"],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <AppProviders locale={locale} messages={messages}>
      <JsonLd data={organizationJsonLd} />
      {children}
    </AppProviders>
  );
}
