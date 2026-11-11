import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { allSlugs, SELECTED_SLUGS } from '@/data/projects';
import { primaryServiceSlugs, serviceSlugs } from '@/data/services';
import { getNotes, noteLocales, noteSlugs } from '@/data/notes';
import { siteMetadata } from '@/data/metadata';

const base = siteMetadata.baseUrl;

/**
 * The real date the page content last changed, not the build time: search engines ignore lastmod
 * when every deploy marks every page as new. Bump this when the site's pages change substantially.
 */
const CONTENT_UPDATED = '2026-11-11';

function entry(
  path: string,
  priority: number,
  changeFrequency: 'weekly' | 'monthly',
  available: string[] = locales,
  lastModified: string = CONTENT_UPDATED
): MetadataRoute.Sitemap {
  return available.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(available.map((l) => [l, `${base}/${l}${path}`])) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getNotes('en');
  const noteDate = (slug: string) => {
    const note = notes.find((n) => n.slug === slug);
    return note ? (note.updated ?? note.date) : CONTENT_UPDATED;
  };
  return [
    ...entry('', 1, 'weekly'),
    ...entry('/services', 0.9, 'monthly'),
    ...serviceSlugs.flatMap((slug) => entry(`/services/${slug}`, primaryServiceSlugs.includes(slug) ? 0.9 : 0.6, 'monthly')),
    ...entry('/work', 0.8, 'monthly'),
    // The long case studies carry the evidence; the short project pages matter less.
    ...allSlugs.flatMap((slug) => entry(`/work/${slug}`, SELECTED_SLUGS.includes(slug) ? 0.8 : 0.5, 'monthly')),
    ...entry('/notes', 0.7, 'weekly'),
    ...noteSlugs.flatMap((slug) => entry(`/notes/${slug}`, 0.7, 'monthly', noteLocales(slug), noteDate(slug))),
    ...entry('/about', 0.7, 'monthly'),
    ...entry('/contact', 0.7, 'monthly'),
    ...entry('/hire', 0.5, 'monthly'),
  ];
}
