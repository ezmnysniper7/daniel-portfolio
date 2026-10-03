import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { allSlugs } from '@/data/projects';
import { serviceSlugs } from '@/data/services';
import { noteSlugs } from '@/data/notes';
import { siteMetadata } from '@/data/metadata';

const base = siteMetadata.baseUrl;
const lastModified = new Date();

function entry(path: string, priority: number, changeFrequency: 'weekly' | 'monthly'): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry('', 1, 'weekly'),
    ...entry('/services', 0.9, 'monthly'),
    ...serviceSlugs.flatMap((slug) => entry(`/services/${slug}`, 0.9, 'monthly')),
    ...entry('/hire', 0.8, 'monthly'),
    ...allSlugs.flatMap((slug) => entry(`/work/${slug}`, 0.6, 'monthly')),
    ...entry('/notes', 0.7, 'weekly'),
    ...noteSlugs.flatMap((slug) => entry(`/notes/${slug}`, 0.7, 'monthly')),
  ];
}
