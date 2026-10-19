"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { META_CONSENT_EVENT, metaPageView, syncMetaConsent } from "@/lib/analytics/meta";

export default function MetaPixel() {
  const pathname = usePathname();
  const query = useSearchParams()?.toString();
  useEffect(() => {
    if (pathname) metaPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, query]);
  useEffect(() => {
    window.addEventListener(META_CONSENT_EVENT, syncMetaConsent);
    window.addEventListener("storage", syncMetaConsent);
    return () => {
      window.removeEventListener(META_CONSENT_EVENT, syncMetaConsent);
      window.removeEventListener("storage", syncMetaConsent);
    };
  }, []);
  return null;
}
