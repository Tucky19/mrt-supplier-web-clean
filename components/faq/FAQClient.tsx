"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  FileText,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

type FAQItem = {
  q: string;
  a: string;
};

type FAQSection = {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
  items: FAQItem[];
};

const sections: FAQSection[] = [
  {
    title: "Search & Cross Reference",
    icon: Search,
    description:
      "How to search parts, equivalent numbers, and application references.",
    items: [
      {
        q: "How do I search for a part?",
        a: "You can search by part number, equivalent number, brand name, application keyword, or machine model. Exact part numbers usually return the best results first.",
      },
      {
        q: "Do you support cross reference lookup?",
        a: "Yes. MRT Supplier supports cross reference and equivalent part search across supported brands, making it easier to find replacement parts.",
      },
      {
        q: "What is the best way to search if I only know part of the number?",
        a: "Enter the most recognizable part of the number, such as P55 or 6205. The search system is designed to rank likely industrial part matches first.",
      },
      {
        q: "Can I search by machine or application?",
        a: "Yes. You can search using equipment model names, fitment terms, or application keywords when part number information is incomplete.",
      },
    ],
  },
  {
    title: "RFQ & Quotation",
    icon: FileText,
    description:
      "How quotation requests work for single and multiple industrial items.",
    items: [
      {
        q: "Can I request quotation for multiple items at once?",
        a: "Yes. Add multiple products to your RFQ list, then submit one quotation request. This is ideal for procurement and maintenance workflows.",
      },
      {
        q: "Do I need to create an account before sending an RFQ?",
        a: "No. You can submit an RFQ directly by filling in your contact details and part requirements.",
      },
      {
        q: "How long does it take to receive a quotation?",
        a: "Quotation response time depends on product availability and supplier confirmation, but sales handling is intended to be fast and practical for industrial workflows.",
      },
      {
        q: "What information should I include in my RFQ?",
        a: "For best results, include the part number, brand, quantity, application if relevant, and any cross reference or replacement number you already have.",
      },
    ],
  },
  {
    title: "Availability & Product Information",
    icon: PackageCheck,
    description:
      "Questions about product details, availability, and replacement parts.",
    items: [
      {
        q: "Are all products shown as ready to order immediately?",
        a: "Not always. Some products may be available for RFQ only, depending on sourcing status, stock confirmation, and supplier lead time.",
      },
      {
        q: "Do you provide replacement or equivalent industrial parts?",
        a: "Yes. MRT Supplier is built to support replacement sourcing, equivalent lookup, and practical industrial procurement workflows.",
      },
      {
        q: "What if the specification looks incomplete on the product page?",
        a: "You can still submit an RFQ. Product pages are designed to help with identification, but the sales workflow can confirm details, equivalents, and availability.",
      },
      {
        q: "Can I use your site to compare brands?",
        a: "Yes. Search results and cross reference information can help identify compatible or equivalent parts across supported brands.",
      },
    ],
  },
  {
    title: "Ordering Workflow",
    icon: RefreshCw,
    description: "What happens after search, quote request, and follow-up.",
    items: [
      {
        q: "What happens after I submit my RFQ?",
        a: "Your request is recorded in the system and sent into the quotation workflow so your sales team can review the items, verify details, and follow up.",
      },
      {
        q: "Can I go back and continue searching after adding one item?",
        a: "Yes. The platform is designed around search-first workflow, so you can continue adding more items before sending your final RFQ.",
      },
      {
        q: "Is this site better for browsing or direct search?",
        a: "Direct search is the main workflow. The platform is optimized for industrial users who already have part numbers, cross references, or application clues.",
      },
      {
        q: "Who is this platform built for?",
        a: "It is built for industrial procurement teams, maintenance buyers, technicians, and businesses that need a faster way to identify and request spare parts.",
      },
    ],
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neutral-50"
      >
        <span className="text-sm font-semibold leading-6 text-neutral-900 md:text-base">
          {item.q}
        </span>

        <ChevronDown
          className={[
            "h-5 w-5 shrink-0 text-neutral-500 transition",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-neutral-200 px-5 py-4">
          <p className="text-sm leading-7 text-neutral-600">{item.a}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function FAQClient() {
  const [openKey, setOpenKey] = useState<string>("0-0");
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en")
    ? "en"
    : pathname?.startsWith("/th")
    ? "th"
    : "th";

  return (
    <main className="bg-[#F7F8FA]">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Help Center
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600 md:text-base">
            Answers to common questions about industrial part search, cross
            reference, RFQ workflow, and product sourcing on MRT Supplier.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              Go to Search
            </Link>

            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Go to RFQ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                <div className="mt-4 text-base font-semibold text-neutral-900">
                  {section.title}
                </div>

                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {section.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;

            return (
              <section key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-neutral-200">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {section.title}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const key = `${sectionIndex}-${itemIndex}`;
                    return (
                      <FAQAccordionItem
                        key={key}
                        item={item}
                        isOpen={openKey === key}
                        onToggle={() =>
                          setOpenKey((prev) => (prev === key ? "" : key))
                        }
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Still need help?
              </div>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                Continue with search or send an RFQ
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                If you already have a part number or replacement reference,
                search first. If you need pricing or sourcing support for one or
                more items, send your RFQ directly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Search Parts
              </Link>

              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Send RFQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
