import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/world/Reveal';
import { RentalCard } from '@/components/property/RentalCard';
import { WhatsAppButton } from '@/components/property/WhatsAppButton';
import { getRentals } from '@/data/rentals';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('property.listingsPage');
  return { title: t('title'), description: t('desc') };
}

export default async function ListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('property');
  const rentals = getRentals(locale);
  const available = rentals.filter((r) => r.available);

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="section-kicker">{t('listingsPage.title')}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            {t('listingsPage.headline')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink-2">{t('listingsPage.desc')}</p>
          {available.length > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              {available.length} {t('listingsPage.countLabel')}
            </p>
          )}
        </Reveal>

        {available.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {available.map((rental, i) => (
              <Reveal key={rental.slug} delay={(i % 3) * 0.06}>
                <RentalCard rental={rental} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className="surface-card mt-12 flex flex-col items-center gap-6 px-6 py-16 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M15 9h.01M15 13h.01M10 21v-4h4v4" />
                </svg>
              </span>
              <p className="max-w-md text-lg leading-8 text-ink-2">{t('listingsPage.empty')}</p>
              <WhatsAppButton
                message="Hi Daniel, I'm looking for a rental. Here's what I need:"
                label={t('contactPage.whatsapp')}
                size="lg"
              />
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
