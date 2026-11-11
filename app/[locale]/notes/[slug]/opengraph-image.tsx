import { locales } from '@/i18n/config';
import { getNoteSlugs, getNotes } from '@/data/notes';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const alt = 'Engineering note by Daniel Chen';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) => getNoteSlugs(locale).map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNotes('en').find((n) => n.slug === slug);
  const kind = note?.basis === 'design' ? 'Design proposal' : 'Engineering note';
  return renderOg({ kind, title: note?.title ?? 'Engineering notes', footer: note?.tags?.slice(0, 3).join(' · ') });
}
