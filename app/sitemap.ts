import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { projects } from '@/data/projects';

const baseUrl = 'https://danielchen.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate URLs for all pages in all locales
  const routes = ['', '/about', '/projects', '/contact'];

  // Main routes for each locale
  const mainRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${route}`])
        ),
      },
    }))
  );

  // Project detail pages for each locale
  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.7 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/projects/${project.slug}`])
        ),
      },
    }))
  );

  return [...mainRoutes, ...projectRoutes];
}
