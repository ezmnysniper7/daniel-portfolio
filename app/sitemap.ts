import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { allSlugs } from '@/data/projects';
import { siteMetadata } from '@/data/metadata';

const base = siteMetadata.baseUrl;

function entry(path: string, priority: number): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${base}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...entry('', 1), ...allSlugs.flatMap((slug) => entry(`/work/${slug}`, 0.7))];
}
