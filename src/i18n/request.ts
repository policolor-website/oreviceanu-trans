import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = (
    locale === "de"
      ? await import("../../messages/de.json")
      : locale === "fr"
        ? await import("../../messages/fr.json")
        : locale === "it"
          ? await import("../../messages/it.json")
          : locale === "zh"
            ? await import("../../messages/zh.json")
            : await import("../../messages/en.json")
  ).default;

  return {
    locale,
    messages,
  };
});
