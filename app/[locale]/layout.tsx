import type { Metadata, Viewport } from 'next';
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { MotionBoot } from '@/components/motion/MotionBoot';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  // Preloaded so it's usually ready for first paint; 'optional' means a late arrival never swaps (no layout shift).
  display: 'optional',
});

// Runs before first paint: marks that JS is available.
const bootScript = `document.documentElement.classList.add('js');`;

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
        {/* Space behind every page: static CSS stars first, the WebGL starfield fades in over them. */}
        <div className="space-fallback pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
        <canvas data-space-canvas className="space-canvas pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />
        {children}
        <MotionBoot />
      </body>
    </html>
  );
}
