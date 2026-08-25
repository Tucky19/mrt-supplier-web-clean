import { ShieldCheck, FileText, Boxes, Handshake } from "lucide-react";
import { getHomeWhyChooseUsText } from "@/lib/i18n/homeUi";

const iconMap = {
  trusted: ShieldCheck,
  response: FileText,
  clean: Boxes,
  b2b: Handshake,
} as const;

const items = ["trusted", "response", "clean", "b2b"] as const;

export default function WhyChooseUsSection({ locale }: { locale: string }) {
  const section = getHomeWhyChooseUsText(locale);

  return (
    <section className="mrt-blueprint-section border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {section.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            {section.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] lg:text-base">
            {section.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((key) => {
            const Icon = iconMap[key];
            const item = section.items[key];

            return (
              <article
                key={key}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-[var(--shadow-sm)]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--color-text)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
