import type { Metadata } from 'next';
import { locales } from '@/i18n/config';
import { siteMetadata } from '@/data/metadata';
import { getServices } from '@/data/services';

const base = siteMetadata.baseUrl;

export const absolute = (path: string) => `${base}${path}`;
const ogLocale = (locale: string) => (locale === 'zh-CN' ? 'zh_CN' : 'en_US');

/**
 * Per-page metadata with canonical + hreflang alternates and an explicit share image
 * (a page-level openGraph object would otherwise drop the inherited one).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  image: imagePath,
  available = locales,
}: {
  locale: string;
  /** Path after the locale, '' for the home page. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Path after the locale of the page's own share image; the site-wide one otherwise. */
  image?: string;
  /** Locales this page exists in, when it is not all of them. */
  available?: string[];
}): Metadata {
  const url = absolute(`/${locale}${path}`);
  const image = { url: absolute(`/${locale}${imagePath ?? ''}/opengraph-image`), width: 1200, height: 630, alt: title };
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(available.map((l) => [l, absolute(`/${l}${path}`)])),
        'x-default': absolute(`/en${path}`),
      },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteMetadata.name,
      locale: ogLocale(locale),
      alternateLocale: available.filter((l) => l !== locale).map(ogLocale),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

// ---------- JSON-LD ----------

const personId = absolute('/#person');
const websiteId = absolute('/#website');

export function personNode(locale: string) {
  return {
    '@type': 'Person',
    '@id': personId,
    name: siteMetadata.name,
    alternateName: siteMetadata.nameZh,
    jobTitle: locale === 'zh-CN' ? '金融科技软件工程师' : 'Fintech Software Engineer',
    description:
      locale === 'zh-CN'
        ? '面向创始人、券商与自营交易公司的资深金融科技工程师：MT5 Manager API 集成、交易平台与支付系统，从架构到上线。'
        : 'Senior fintech engineer and independent technical partner for founders, brokers and prop firms: MT5 Manager API integrations, trading platforms and payment systems.',
    url: absolute(`/${locale}`),
    image: absolute(`/${locale}/opengraph-image`),
    email: `mailto:${siteMetadata.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kuala Lumpur', addressCountry: 'MY' },
    sameAs: [siteMetadata.social.linkedin, siteMetadata.social.github],
    knowsLanguage: ['en', 'zh'],
    knowsAbout: [
      'MetaTrader 5 Manager API',
      'MetaTrader 5 integration',
      'Prop trading platforms',
      'Broker back office systems',
      'Trading platform architecture',
      'Real-time risk monitoring',
      'Payment gateway integration',
      'Checkout.com',
      'Payment webhooks and idempotency',
      'Payment reconciliation',
      'Double-entry ledgers',
      'Fintech software architecture',
      'Backend development',
      'Python',
      'FastAPI',
      'Go',
      'TypeScript',
      'C#',
      '.NET',
      'RabbitMQ',
      'PostgreSQL',
      'Next.js',
      'Flutter',
    ],
  };
}

export function websiteNode(locale: string) {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: absolute(''),
    name: siteMetadata.name,
    inLanguage: locale,
    publisher: { '@id': personId },
  };
}

export function serviceNode(locale: string, slug: string) {
  const s = getServices(locale).find((x) => x.slug === slug)!;
  return {
    '@type': 'Service',
    '@id': absolute(`/${locale}/services/${slug}#service`),
    name: s.title,
    serviceType: s.serviceType,
    description: s.short,
    url: absolute(`/${locale}/services/${slug}`),
    provider: { '@id': personId },
    // Delivered remotely from Malaysia; these are the markets served, not office locations.
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Place', name: 'European Union' },
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Place', name: 'Worldwide (remote)' },
    ],
    availableLanguage: ['English', 'Chinese'],
  };
}

export function faqNode(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function profilePageNode(locale: string, path: string) {
  return {
    '@type': 'ProfilePage',
    url: absolute(`/${locale}${path}`),
    inLanguage: locale,
    isPartOf: { '@id': websiteId },
    mainEntity: { '@id': personId },
  };
}

/** A case study or article written by Daniel, with him as the author entity. */
export function articleNode({
  type,
  locale,
  path,
  headline,
  description,
  published,
  modified,
  keywords,
  image,
}: {
  type: 'Article' | 'BlogPosting' | 'TechArticle';
  locale: string;
  path: string;
  headline: string;
  description: string;
  published?: string;
  modified?: string;
  keywords?: string[];
  /** Path after the locale of the page's own share image. */
  image?: string;
}) {
  const url = absolute(`/${locale}${path}`);
  return {
    '@type': type,
    '@id': `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    ...(published ? { datePublished: published, dateModified: modified ?? published } : {}),
    inLanguage: locale,
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    image: absolute(`/${locale}${image ?? ''}/opengraph-image`),
    author: { '@type': 'Person', '@id': personId, name: siteMetadata.name, url: absolute(`/${locale}/about`) },
    publisher: { '@type': 'Person', '@id': personId, name: siteMetadata.name },
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
