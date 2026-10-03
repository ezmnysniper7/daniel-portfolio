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

  // Defaults only: every page sets its own title, canonical, hreflang and share image via lib/seo.
  return {
    metadataBase: new URL(base),
    title: { default: dict.meta.title, template: `%s · ${siteMetadata.name}` },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    authors: [{ name: siteMetadata.name, url: base }],
    creator: siteMetadata.name,
    publisher: siteMetadata.name,
    category: 'technology',
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
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
