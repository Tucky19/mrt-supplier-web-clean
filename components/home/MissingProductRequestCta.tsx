import Link from "next/link";
import { getMissingProductUiText } from "@/lib/i18n/missingProductUi";

const LINE_URL = "https://lin.ee/S676yYH";

export default function MissingProductRequestCta({
  locale,
}: {
  locale: string;
}) {
  const text = getMissingProductUiText(locale);

  return (
    <div className="mt-4 rounded-2xl border border-sky-200/40 bg-white/10 px-4 py-4 backdrop-blur">
      <p className="text-sm font-semibold text-white">{text.title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{text.homepageCtaBody}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/products?request=1#missing-product-request`}
          className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {text.primaryButton}
        </Link>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/10"
        >
          {text.secondaryButton}
        </a>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-300">{text.helper}</p>
    </div>
  );
}
