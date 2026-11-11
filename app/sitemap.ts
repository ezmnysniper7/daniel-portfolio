import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { allSlugs, SELECTED_SLUGS } from '@/data/projects';
import { primaryServiceSlugs, serviceSlugs } from '@/data/services';
import { noteLocales, noteSlugs } from '@/data/notes';
import { siteMetadata } from '@/data/metadata';

const base = siteMetadata.baseUrl;
const lastModified = new Date();

function entry(path: string, priority: number, changeFrequency: 'weekly' | 'monthly', available: string[] = locales): MetadataRoute.Sitemap {
  return available.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(available.map((l) => [l, `${base}/${l}${path}`])) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry('', 1, 'weekly'),
    ...entry('/services', 0.9, 'monthly'),
    ...serviceSlugs.flatMap((slug) => entry(`/services/${slug}`, primaryServiceSlugs.includes(slug) ? 0.9 : 0.6, 'monthly')),
    ...entry('/work', 0.8, 'monthly'),
    // The long case studies carry the evidence; the short project pages matter less.
    ...allSlugs.flatMap((slug) => entry(`/work/${slug}`, SELECTED_SLUGS.includes(slug) ? 0.8 : 0.5, 'monthly')),
    ...entry('/notes', 0.7, 'weekly'),
    ...noteSlugs.flatMap((slug) => entry(`/notes/${slug}`, 0.7, 'monthly', noteLocales(slug))),
    ...entry('/about', 0.7, 'monthly'),
    ...entry('/contact', 0.7, 'monthly'),
    ...entry('/hire', 0.5, 'monthly'),
  ];
}
