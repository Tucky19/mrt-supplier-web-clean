"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getLineContactUiText } from "@/lib/i18n/lineContactUi";

type Props = {
  href: string;
  locale?: string;
  className?: string;
  children: ReactNode;
  title?: string;
  onNavigate?: () => void;
};

export default function LineContactLink(props: Props) {
  const pathname = usePathname();
  return <LineContactAction key={pathname} {...props} />;
}

function LineContactAction({ href, locale, className, children, title, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const text = getLineContactUiText(locale);

  useEffect(() => {
    if (!open || !dialog.current) return;
    const panel = dialog.current;
    const previousOverflow = document.body.style.overflow;
    panel.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      panel.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={title}
        aria-haspopup="dialog"
        data-line-contact="trigger"
        onClick={(event) => {
          setOpen(true);
          if (window.matchMedia("(min-width: 768px)").matches) {
            event.preventDefault();
          } else {
            // Preserve native mobile app navigation; leave contact help on return.
            onNavigate?.();
          }
        }}
      >
        {children}
      </a>
      {open && createPortal(
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          onClose={() => setOpen(false)}
          className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-center text-slate-900 shadow-xl backdrop:bg-black/50"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-left text-lg font-semibold">{text.title}</h2>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-blue-600">{text.close}</button>
          </div>
          <Image src="/line-oa-search-qr.svg" width={180} height={180} alt={text.qrAlt} className="mx-auto my-4 bg-white" unoptimized />
          <p className="text-sm">{text.help}</p>
          <p className="my-3 select-all text-xl font-semibold text-blue-900">@mrtsupplier</p>
          <p className="text-sm text-slate-600">{text.fallback}</p>
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className="my-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-blue-600">{text.open}</a>
          <p className="text-sm text-slate-600">{text.note}</p>
        </dialog>, document.body,
      )}
    </>
  );
}
