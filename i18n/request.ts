import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = new Set(["th", "en"]);

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const currentLocale =
    requestedLocale && SUPPORTED_LOCALES.has(requestedLocale)
      ? requestedLocale
      : "th";

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default,
  };
});
