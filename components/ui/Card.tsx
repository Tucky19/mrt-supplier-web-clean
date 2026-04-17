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
        "rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-sm backdrop-blur sm:p-5 lg:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}