import { MetadataRoute } from 'next';
import { siteMetadata } from '@/data/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/_next/'] }],
    sitemap: `${siteMetadata.baseUrl}/sitemap.xml`,
  };
}
