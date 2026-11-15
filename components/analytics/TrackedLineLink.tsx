"use client";

import type { ReactNode } from "react";
import LineContactLink from "@/components/contact/LineContactLink";
import { gaLineClick } from "@/lib/analytics/ga";

type Props = {
  href: string;
  source: string;
  locale?: string;
  className?: string;
  children: ReactNode;
  title?: string;
};

export default function TrackedLineLink({
  href,
  source,
  locale,
  className,
  children,
  title,
}: Props) {
  return (
    <LineContactLink
      href={href}
      locale={locale}
      className={className}
      title={title}
      onNavigate={() => {
        gaLineClick({
          source,
          locale,
        });
      }}
    >
      {children}
    </LineContactLink>
  );
}
