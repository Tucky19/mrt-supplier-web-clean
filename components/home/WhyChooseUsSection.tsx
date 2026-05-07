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
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {section.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {section.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">
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
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
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
