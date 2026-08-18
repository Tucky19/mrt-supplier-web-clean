// components/ui/Input.tsx
import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4",
          "text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
          "outline-none transition",
          "focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]/30",
          "aria-invalid:border-[var(--color-danger)] aria-invalid:focus-visible:border-[var(--color-danger)] aria-invalid:focus-visible:ring-[var(--color-danger)]/20",
          "disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:opacity-70",
          "sm:h-12 sm:text-base",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
