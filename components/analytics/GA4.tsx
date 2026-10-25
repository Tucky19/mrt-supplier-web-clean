"use client";

import Script from "next/script";
import { googleContextBootstrapScript } from "@/lib/analytics/ga-context";

export default function GA4() {
  const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;

          ${googleContextBootstrapScript()}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
            ...window.__mrtGAContext.page,
            ...window.__mrtGAContext.campaign
          });
        `}
      </Script>
    </>
  );
}