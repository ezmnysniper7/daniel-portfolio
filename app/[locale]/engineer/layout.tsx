import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Aurora } from '@/components/portal/Aurora';
import { WorldNav } from '@/components/world/WorldNav';
import { WorldFooter } from '@/components/world/WorldFooter';
import { MobileWorldNav } from '@/components/world/MobileWorldNav';
import { TickerTape } from '@/components/engineer/TickerTape';
import { siteMetadata } from '@/data/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `https://danielchen.tech/${locale}/engineer` },
  };
}

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-world="engineer" className="grid-overlay relative flex min-h-screen flex-col">
      <Aurora />
      <WorldNav world="engineer" />
      <TickerTape />
      <main className="relative z-10 flex-1 pb-28 md:pb-0">{children}</main>
      <WorldFooter world="engineer" />
      <MobileWorldNav world="engineer" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteMetadata.name,
            url: 'https://danielchen.tech',
            jobTitle: siteMetadata.title,
            description: siteMetadata.description,
            email: siteMetadata.email,
            address: { '@type': 'PostalAddress', addressCountry: 'Malaysia' },
            sameAs: [siteMetadata.social.github, siteMetadata.social.linkedin].filter(Boolean),
            knowsAbout: [
              'Platform Engineering',
              'Trading Systems',
              'Payment Systems',
              'Kubernetes',
              'Cloud Native',
              'TypeScript',
              'Go',
              'Java',
              'Next.js',
            ],
          }),
        }}
      />
    </div>
  );
}
