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
}: {
  locale: string;
  /** Path after the locale, '' for the home page. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  const url = absolute(`/${locale}${path}`);
  const image = { url: absolute(`/${locale}/opengraph-image`), width: 1200, height: 630, alt: title };
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, absolute(`/${l}${path}`)])),
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
      alternateLocale: locales.filter((l) => l !== locale).map(ogLocale),
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
    jobTitle: locale === 'zh-CN' ? '高级后端工程师' : 'Senior Backend Engineer',
    description:
      locale === 'zh-CN'
        ? '吉隆坡软件工程师，开发加密货币与交易平台、支付对接、网站和手机 App。'
        : 'Kuala Lumpur software engineer building crypto and trading platforms, payment integrations, websites and mobile apps.',
    url: absolute(`/${locale}`),
    image: absolute(`/${locale}/opengraph-image`),
    email: `mailto:${siteMetadata.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kuala Lumpur', addressCountry: 'MY' },
    sameAs: [siteMetadata.social.linkedin, siteMetadata.social.github],
    knowsLanguage: ['en', 'zh'],
    knowsAbout: [
      'Backend development',
      'Python',
      'FastAPI',
      'Go',
      'TypeScript',
      'C#',
      'RabbitMQ',
      'PostgreSQL',
      'Payment gateway integration',
      'Crypto trading platforms',
      'MetaTrader 5',
      'Prop trading platforms',
      'Next.js',
      'React',
      'Flutter',
      'Mobile app development',
      'Web development',
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
    areaServed: [
      { '@type': 'Country', name: 'Malaysia' },
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

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
