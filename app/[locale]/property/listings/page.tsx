import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/world/Reveal';
import { RentalCard } from '@/components/property/RentalCard';
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
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {available.length} {t('listingsPage.countLabel')}
          </p>
          <p className="mt-4 text-sm italic text-ink-3">{t('placeholderNote')}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {available.map((rental, i) => (
            <Reveal key={rental.slug} delay={(i % 3) * 0.06}>
              <RentalCard rental={rental} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
