'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/world/Reveal';
import { RentalCard } from './RentalCard';
import { Rental } from '@/types';

export function FeaturedRentals({ rentals }: { rentals: Rental[] }) {
  const t = useTranslations('property');
  const params = useParams();
  const locale = params.locale as string;
  const featured = rentals.filter((r) => r.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <Section className="border-t border-line/60">
      <Container>
        <Reveal className="mb-3 max-w-2xl">
          <p className="section-kicker">{t('featured.kicker')}</p>
          <h2 className="mt-4 font-display section-title">{t('featured.title')}</h2>
        </Reveal>
        <p className="mb-10 text-sm italic text-ink-3">{t('placeholderNote')}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featured.map((rental, i) => (
            <Reveal key={rental.slug} delay={i * 0.06}>
              <RentalCard rental={rental} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <Button href={`/${locale}/property/listings`} variant="secondary">
            {t('featured.viewAll')} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
