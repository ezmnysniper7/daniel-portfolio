'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/world/Reveal';
import { propertyMeta } from '@/data/property';

export function PropertyAbout() {
  const t = useTranslations('property.about');

  const facts = [
    { label: t('renLabel'), value: propertyMeta.renNumber },
    { label: t('areasLabel'), value: `${propertyMeta.areas.length}+ ${t('areasLabel').toLowerCase()}` },
    { label: t('langsLabel'), value: propertyMeta.languages.join(' · ') },
  ];

  return (
    <Section className="border-t border-line/60">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
          <Reveal>
            <p className="section-kicker">{t('kicker')}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl">{t('title')}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2 text-pretty">{t('body')}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface-card divide-y divide-line p-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
                    {f.label}
                  </span>
                  <span className="text-right text-sm font-medium text-ink">{f.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
