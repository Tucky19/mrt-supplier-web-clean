import Image from "next/image";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import { getHomeBrandShowcaseText } from "@/lib/i18n/homeUi";

const LINE_URL = "https://lin.ee/S676yYH";

type Brand = {
  key: string;
  name: string;
  logo: string;
};

export default function BrandShowcase({
  brands,
  locale,
}: {
  brands: Brand[];
  locale: string;
}) {
  const copy = getHomeBrandShowcaseText(locale);

  return (
    <section id="brands" className="mrt-blueprint-section-strong border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {copy.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            {copy.description}
          </p>
        </div>

        <div className="mt-10">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
              {copy.coreHeading}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {copy.coreHelper}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {brands.map((brand) => (
              <article
                key={brand.key}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)] sm:p-6"
              >
                <div className="flex h-24 items-center justify-center rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 sm:h-28 sm:px-6">
                  <div className="relative h-16 w-full sm:h-20">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                <div className="mt-4 text-center sm:mt-5">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{brand.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {copy.items[brand.key as keyof typeof copy.items]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-8 text-center">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              {locale === "th"
                ? "ตรวจสอบเบอร์เทียบและแบรนด์อื่นเพิ่มเติม"
                : "Additional brand and cross-reference support"}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              {locale === "th"
                ? "นอกเหนือจากแบรนด์ที่แสดง เรายังรับตรวจสอบ Part No. จากแบรนด์อื่น เพื่อค้นหาเบอร์เทียบ Donaldson, MANN-FILTER หรือแนวทางจัดหาที่เหมาะสม"
                : "Beyond the brands shown, we can review part numbers from other brands to identify a suitable Donaldson, MANN-FILTER, or sourcing option."}
            </p>
          </div>

          <TrackedLineLink
            href={LINE_URL}
            source="home_brand_support"
            locale={locale}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
          >
            {locale === "th" ? "ส่ง Part No. ให้ทีมงานตรวจสอบ" : "Send a part number"}
          </TrackedLineLink>
        </div>
      </div>
    </section>
  );
}
