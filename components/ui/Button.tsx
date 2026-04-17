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
    "bg-amber-400 text-neutral-950 hover:opacity-90 focus-visible:ring-amber-300",
  secondary:
    "bg-neutral-100 text-neutral-950 hover:bg-white focus-visible:ring-neutral-300",
  outline:
    "border border-neutral-700 bg-transparent text-neutral-100 hover:border-neutral-500 hover:bg-neutral-900 focus-visible:ring-neutral-500",
  ghost:
    "bg-transparent text-neutral-100 hover:bg-neutral-900 focus-visible:ring-neutral-500",
  danger:
    "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "h-10 px-4 text-sm rounded-xl sm:h-11 sm:px-5",
  lg: "h-11 px-5 text-sm rounded-xl sm:h-12 sm:px-6 sm:text-base",
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
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}