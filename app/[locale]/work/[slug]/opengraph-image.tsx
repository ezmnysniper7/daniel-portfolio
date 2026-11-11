import { locales } from '@/i18n/config';
import { allSlugs, getProjects } from '@/data/projects';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const alt = 'Case study by Daniel Chen';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjects('en').find((p) => p.slug === slug);
  const kind = project?.evidence === 'prototype' ? 'Prototype · not launched' : 'Case study';
  return renderOg({ kind, title: project?.title ?? 'Case study', footer: project?.tags?.slice(0, 3).join(' · ') });
}
