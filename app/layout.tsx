import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import GA4 from "@/components/analytics/GA4";
import GA4PageView from "@/components/analytics/GA4PageView";
import LineContactButton from "@/components/ui/LineContactButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://mrtsupplier.com"),
  title: {
    default: "MRT Supplier | Industrial Parts RFQ",
    template: "%s | MRT Supplier",
  },
  description:
    "Search industrial parts by part number, cross reference, or dimensions and submit RFQs to MRT Supplier.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const lang = locale === "th" ? "th" : "en";

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-950">
        <GA4 />
        <Suspense fallback={null}>
          <GA4PageView />
        </Suspense>
        {children}
        <LineContactButton />
      </body>
    </html>
  );
}
