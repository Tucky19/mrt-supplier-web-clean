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
          "h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4",
          "text-sm text-neutral-100 placeholder:text-neutral-500",
          "outline-none transition",
          "focus:border-neutral-600 focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
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