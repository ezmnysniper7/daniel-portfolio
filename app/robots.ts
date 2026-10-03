import { MetadataRoute } from 'next';
import { siteMetadata } from '@/data/metadata';

// Everything is crawlable, including /_next/ (Google needs the CSS and JS to render pages).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteMetadata.baseUrl}/sitemap.xml`,
    host: siteMetadata.baseUrl,
  };
}
