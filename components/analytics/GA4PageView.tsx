// components/analytics/GA4PageView.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { gaPageView } from "@/lib/analytics/ga";

export default function GA4PageView() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const lastNavigation = useRef<string | null>(null);

  const url = useMemo(() => {
    const qs = sp?.toString();
    return qs ? `${pathname}?${qs}` : `${pathname}`;
  }, [pathname, sp]);

  useEffect(() => {
    if (!pathname || lastNavigation.current === url) return;
    if (gaPageView(url)) lastNavigation.current = url;
  }, [pathname, url]);

  return null;
}