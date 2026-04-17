// components/analytics/GA4PageView.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { gaPageView } from "@/lib/analytics/ga";

export default function GA4PageView() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const url = useMemo(() => {
    const qs = sp?.toString();
    return qs ? `${pathname}?${qs}` : `${pathname}`;
  }, [pathname, sp]);

  useEffect(() => {
    if (!pathname) return;
    gaPageView(url);
  }, [pathname, url]);

  return null;
}