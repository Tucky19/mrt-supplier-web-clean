import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5 lg:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
