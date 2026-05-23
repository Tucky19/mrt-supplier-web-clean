import "./globals.css";
import type { ReactNode } from "react";
import { Suspense } from "react";
import GA4 from "@/components/analytics/GA4";
import GA4PageView from "@/components/analytics/GA4PageView";
import LineContactButton from "@/components/ui/LineContactButton";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
