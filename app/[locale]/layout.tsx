import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Fraunces } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MobileProvider } from '@/contexts/MobileContext';
import { Grain } from '@/components/portal/Grain';
import { siteMetadata } from '@/data/metadata';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'portal' });

  const baseUrl = 'https://danielchen.tech';
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteMetadata.name}, ${t('tagline')}`,
      template: `%s | ${siteMetadata.name}`,
    },
    description: t('metaDescription'),
    keywords: [
      'Daniel Chen',
      '曾祈荣',
      'Platform Engineer',
      'Full-Stack Developer',
      'Trading Systems',
      'CFI',
      'Next.js',
      'TypeScript',
      'Property Agent',
      'Rental Malaysia',
      'Leasing',
      'Klang Valley',
      '房产中介',
      '租房',
      'Malaysia',
    ],
    authors: [{ name: siteMetadata.name, url: baseUrl }],
    creator: siteMetadata.name,
    publisher: siteMetadata.name,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        'zh-CN': `${baseUrl}/zh-CN`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh-CN' ? 'zh_CN' : 'en_US',
      url: canonicalUrl,
      title: `${siteMetadata.name}, ${t('tagline')}`,
      description: t('metaDescription'),
      siteName: `${siteMetadata.name}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteMetadata.name}, ${t('tagline')}`,
      description: t('metaDescription'),
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

  if (!locales.includes(locale as 'en' | 'zh-CN')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="en" href="https://danielchen.tech/en" />
        <link rel="alternate" hrefLang="zh-CN" href="https://danielchen.tech/zh-CN" />
        <link rel="alternate" hrefLang="x-default" href="https://danielchen.tech/en" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0f16" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MobileProvider>
              <Grain />
              {children}
            </MobileProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
