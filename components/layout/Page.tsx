// components/layout/Page.tsx
import React from "react";
import clsx from "clsx";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;

  className?: string;
  headerClassName?: string;
  containerClassName?: string;
};

export default function Page({
  title,
  subtitle,
  actions,
  children,
  className,
  headerClassName,
  containerClassName,
}: Props) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    // ✅ Important: DON'T paint a page background here.
    // Background is owned by RootLayout (AppBackground) to keep every page consistent.
    <main className={clsx("w-full", className)}>
      <div className={clsx("mx-auto max-w-6xl px-6", containerClassName)}>
        {hasHeader && (
          <header
            className={clsx(
              // ✅ subtle header divider that works on the global dark background
              "border-b border-white/10 py-10",
              headerClassName
            )}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {title && <div className="h2">{title}</div>}
                {subtitle && <div className="body mt-3 max-w-2xl">{subtitle}</div>}
              </div>

              {actions ? <div className="flex gap-3">{actions}</div> : null}
            </div>
          </header>
        )}

        <div className="py-16">{children}</div>
      </div>
    </main>
  );
}