import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { MeshGradient } from '@/components/effects/MeshGradient';
import { siteMetadata } from '@/data/metadata';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const baseUrl = 'https://danielchen.dev';
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteMetadata.name} - ${siteMetadata.title}`,
      template: `%s | ${siteMetadata.name}`,
    },
    description: t('description'),
    keywords: [
      'Daniel Chen',
      'Full-Stack Developer',
      'Platform Engineer',
      'Java Developer',
      'TypeScript',
      'Next.js',
      'Spring Boot',
      'PHP',
      'Malaysia Developer',
      'Portfolio',
      'Kubernetes',
      'Cloud Native',
      'Payment Systems',
      '陈启荣',
      '平台工程师',
      '全栈开发',
      '云原生',
      '支付系统',
    ],
    authors: [{ name: siteMetadata.name, url: baseUrl }],
    creator: siteMetadata.name,
    publisher: siteMetadata.name,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'zh-CN': `${baseUrl}/zh-CN`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh-CN' ? 'zh_CN' : 'en_US',
      url: canonicalUrl,
      title: `${siteMetadata.name} - ${siteMetadata.title}`,
      description: t('description'),
      siteName: `${siteMetadata.name} Portfolio`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${siteMetadata.name} - ${siteMetadata.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteMetadata.name} - ${siteMetadata.title}`,
      description: t('description'),
      creator: '@danielchen',
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code', // Replace with actual verification code
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href="https://danielchen.dev/en" />
        <link rel="alternate" hrefLang="zh-CN" href="https://danielchen.dev/zh-CN" />
        <link rel="alternate" hrefLang="x-default" href="https://danielchen.dev/en" />

        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteMetadata.name,
              url: 'https://danielchen.dev',
              image: 'https://danielchen.dev/og-image.png',
              jobTitle: siteMetadata.title,
              description: siteMetadata.description,
              email: siteMetadata.email,
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'Malaysia',
              },
              sameAs: [
                siteMetadata.social.github,
                siteMetadata.social.linkedin,
              ].filter(Boolean),
              knowsAbout: [
                'Platform Engineering',
                'Kubernetes',
                'Cloud Native',
                'Payment Systems',
                'Microservices',
                'TypeScript',
                'Java',
                'Next.js',
                'React',
              ],
            }),
          }}
        />

        {/* WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: `${siteMetadata.name} Portfolio`,
              url: 'https://danielchen.dev',
              description: siteMetadata.description,
              inLanguage: [locale],
              author: {
                '@type': 'Person',
                name: siteMetadata.name,
              },
            }),
          }}
        />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CustomCursor />
            <MeshGradient />
            <div className="flex min-h-screen flex-col relative z-10">
              <Navbar />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
