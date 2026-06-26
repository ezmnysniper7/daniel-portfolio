import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { projects } from '@/data/projects';

const baseUrl = 'https://danielchen.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/engineer',
    '/engineer/projects',
    '/engineer/about',
    '/engineer/contact',
    '/property',
    '/property/listings',
    '/property/contact',
  ];

  const mainRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${route}`])),
      },
    }))
  );

  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/engineer/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.7 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/engineer/projects/${project.slug}`])
        ),
      },
    }))
  );

  return [...mainRoutes, ...projectRoutes];
}
