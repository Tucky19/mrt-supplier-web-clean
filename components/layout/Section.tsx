import * as React from "react";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  bordered?: boolean;
  muted?: boolean;
};

export default function Section({
  children,
  className,
  containerClassName,
  bordered = false,
  muted = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-10 sm:py-14 lg:py-20",
        bordered && "border-b border-neutral-900",
        muted && "bg-neutral-950/40",
        className
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}