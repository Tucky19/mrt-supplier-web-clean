// components/ui/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-focus-ring)]",
  secondary:
    "bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] focus-visible:ring-[var(--color-focus-ring)]",
  outline:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] focus-visible:ring-[var(--color-focus-ring)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:ring-[var(--color-focus-ring)]",
  danger:
    "bg-[var(--color-danger)] text-[var(--color-text-inverse)] hover:bg-[var(--color-danger-hover)] focus-visible:ring-[var(--color-focus-ring)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-[var(--mrt-radius-md)] px-3 text-sm",
  md: "h-10 rounded-[var(--mrt-radius-md)] px-4 text-sm sm:h-11 sm:px-5",
  lg: "h-11 rounded-[var(--mrt-radius-md)] px-5 text-sm sm:h-12 sm:px-6 sm:text-base",
};

export default function Button({
  asChild = false,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
