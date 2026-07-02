import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Aurora } from '@/components/portal/Aurora';
import { WorldNav } from '@/components/world/WorldNav';
import { WorldFooter } from '@/components/world/WorldFooter';
import { MobileWorldNav } from '@/components/world/MobileWorldNav';
import { propertyMeta } from '@/data/property';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'property' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `https://danielchen.tech/${locale}/property` },
  };
}

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="property" className="grid-overlay relative flex min-h-screen flex-col">
      <Aurora />
      <WorldNav world="property" />
      <main className="relative z-10 flex-1 pb-28 md:pb-0">{children}</main>
      <WorldFooter world="property" />
      <MobileWorldNav world="property" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: `${propertyMeta.name}, Property Agent`,
            url: 'https://danielchen.tech',
            email: propertyMeta.email,
            telephone: propertyMeta.phone,
            areaServed: propertyMeta.areas,
            knowsLanguage: ['en', 'zh', 'ms'],
            address: { '@type': 'PostalAddress', addressRegion: 'Klang Valley', addressCountry: 'Malaysia' },
          }),
        }}
      />
    </div>
  );
}
