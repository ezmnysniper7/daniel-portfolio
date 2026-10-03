import type { Metadata, Viewport } from 'next';
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { Cursor, IntroOverlay } from '@/components/site/Chrome';
import { MotionBoot } from '@/components/motion/MotionBoot';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

// Runs before first paint: marks JS as available and opts into the intro once per session.
// The curtain is desktop-only; on phones the headline starts revealing immediately (LCP).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&matchMedia('(min-width: 768px)').matches&&!sessionStorage.getItem('dc-intro')){d.classList.add('intro');sessionStorage.setItem('dc-intro','1')}}catch(e){}})();`;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#090b10',
  colorScheme: 'dark',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const base = siteMetadata.baseUrl;

  return {
    metadataBase: new URL(base),
    title: { default: dict.meta.title, template: `%s · ${siteMetadata.name}` },
    description: dict.meta.description,
    authors: [{ name: siteMetadata.name, url: base }],
    creator: siteMetadata.name,
    keywords: [
      'Daniel Chen',
      '曾祈荣',
      'Senior Backend Engineer',
      'Backend Engineer Malaysia',
      'Fintech',
      'Payments',
      'Python',
      'FastAPI',
      'RabbitMQ',
      'Go',
      'Crypto trading platform',
      'MetaTrader 5',
    ],
    alternates: {
      canonical: `${base}/${locale}`,
      languages: { en: `${base}/en`, 'zh-CN': `${base}/zh-CN`, 'x-default': `${base}/en` },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh-CN' ? 'zh_CN' : 'en_US',
      url: `${base}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: siteMetadata.name,
    },
    twitter: { card: 'summary_large_image', title: dict.meta.title, description: dict.meta.description },
    robots: { index: true, follow: true },
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
  if (!locales.includes(locale as Locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans">
        <IntroOverlay label={dict.intro} />
        {children}
        <Cursor />
        <MotionBoot />
      </body>
    </html>
  );
}
