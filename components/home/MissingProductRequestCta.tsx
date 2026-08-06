import Link from "next/link";
import { getMissingProductUiText } from "@/lib/i18n/missingProductUi";

const LINE_URL = "https://lin.ee/S676yYH";

export default function MissingProductRequestCta({
  locale,
  variant = "dark",
}: {
  locale: string;
  variant?: "dark" | "light";
}) {
  const text = getMissingProductUiText(locale);
  const isLight = variant === "light";

  return (
    <div
      className={`mt-4 rounded-2xl border px-4 py-4 ${
        isLight
          ? "border-blue-100 bg-blue-50"
          : "border-sky-200/40 bg-white/10 backdrop-blur"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          isLight ? "text-blue-950" : "text-white"
        }`}
      >
        {text.title}
      </p>
      <p
        className={`mt-2 text-sm leading-6 ${
          isLight ? "text-slate-600" : "text-slate-200"
        }`}
      >
        {text.homepageCtaBody}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/products?request=1#missing-product-request`}
          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition ${
            isLight
              ? "bg-blue-900 text-white hover:bg-blue-800"
              : "bg-white text-slate-900 hover:bg-slate-100"
          }`}
        >
          {text.primaryButton}
        </Link>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition ${
            isLight
              ? "border-blue-200 bg-white text-blue-900 hover:border-blue-300 hover:bg-blue-100"
              : "border-white/30 text-white hover:border-white/50 hover:bg-white/10"
          }`}
        >
          {text.secondaryButton}
        </a>
      </div>
      <p
        className={`mt-3 text-xs leading-5 ${
          isLight ? "text-slate-500" : "text-slate-300"
        }`}
      >
        {text.helper}
      </p>
    </div>
  );
}
