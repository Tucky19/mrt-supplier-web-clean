import Link from "next/link";
import React from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function CatalogShell({
  title,
  subtitle,
  rightSlot,
  children,
  className,
}: Props) {
  return (
    <main
      className={cn(
        // Catalog-master background (ไม่ดำทึบ)
        "min-h-[calc(100vh-64px)]",
        "bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.22),transparent_60%),radial-gradient(900px_500px_at_80%_0%,rgba(14,165,233,0.18),transparent_55%),linear-gradient(180deg,#0b1220_0%,#0a1220_20%,#0b1528_55%,#0a1322_100%)]",
        "text-white",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        {(title || subtitle || rightSlot) && (
          <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {rightSlot}
            </div>
          </header>
        )}

        {children}

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/45">
          <div className="flex flex-wrap items-center gap-2">
            <span>Tip:</span>
            <span className="rounded-md bg-white/5 px-2 py-1">
              ใส่ Part No / Spec ได้หลายแบบ เช่น <b>p550388</b>, <b>od93</b>, <b>93mm</b>, <b>1-12</b>
            </span>
            <Link className="text-white/70 hover:text-white" href="/contact">
              ติดต่อทีม RFQ →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
