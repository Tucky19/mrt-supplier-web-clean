import React from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Panel({ title, subtitle, right, children, className }: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur",
        "p-5 sm:p-6",
        className
      )}
    >
      {(title || subtitle || right) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <div className="text-base font-semibold text-white">{title}</div>}
            {subtitle && <div className="mt-1 text-sm text-white/65">{subtitle}</div>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
