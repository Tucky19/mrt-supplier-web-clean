import * as React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning";
};

export default function Badge({
  children,
  className = "",
  variant = "default",
}: Props) {
  const tone =
    variant === "success"
      ? "border-[var(--color-success-soft)] bg-[var(--color-success-soft)] text-[var(--color-success-text)]"
      : variant === "warning"
      ? "border-[var(--color-warning-soft)] bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]"
      : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]";

  return (
    <span
      className={`inline-flex items-center rounded-[var(--mrt-radius-sm)] border px-2.5 py-1 text-xs font-medium ${tone} ${className}`}
    >
      {children}
    </span>
  );
}
