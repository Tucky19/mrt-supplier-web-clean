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
      ? "bg-green-100 text-green-700"
      : variant === "warning"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tone} ${className}`}
    >
      {children}
    </span>
  );
}