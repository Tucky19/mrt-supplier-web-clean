import * as React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  title,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}