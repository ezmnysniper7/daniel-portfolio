import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

// next-intl only handles locale routing (middleware). Copy lives in data/dictionary.ts.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;
  return { locale, messages: {} };
});
