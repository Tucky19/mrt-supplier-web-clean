"use client";

import type { ReactNode } from "react";
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
      onClick={() => {
        gaLineClick({
          source,
          locale,
        });
      }}
    >
      {children}
    </a>
  );
}
