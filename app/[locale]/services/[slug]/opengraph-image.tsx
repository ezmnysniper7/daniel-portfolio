import { locales } from '@/i18n/config';
import { getServices, serviceSlugs } from '@/data/services';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const alt = 'Service by Daniel Chen';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServices('en').find((s) => s.slug === slug);
  return renderOg({ kind: 'Service', title: service?.headline ?? service?.title ?? 'Fintech engineering services' });
}
