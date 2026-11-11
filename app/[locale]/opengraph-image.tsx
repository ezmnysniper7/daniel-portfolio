import { locales } from '@/i18n/config';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const alt = 'Daniel Chen: fintech engineer and technical partner for founders, brokers and prop firms';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image() {
  return renderOg({ kind: 'Fintech engineering', title: 'Fintech products, from architecture to launch.' });
}
