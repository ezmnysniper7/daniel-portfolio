'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/world/Reveal';

export function ProcessSteps() {
  const t = useTranslations('property.process');
  const steps = [
    { title: t('step1.title'), body: t('step1.body') },
    { title: t('step2.title'), body: t('step2.body') },
    { title: t('step3.title'), body: t('step3.body') },
    { title: t('step4.title'), body: t('step4.body') },
  ];

  return (
    <Section className="border-t border-line/60">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-kicker">{t('kicker')}</p>
          <h2 className="mt-4 font-display section-title">{t('title')}</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl border border-line bg-panel/60 p-6 backdrop-blur">
                <span className="font-display text-5xl font-semibold text-accent/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-2">{step.body}</p>
                {i < steps.length - 1 && (
                  <span className="absolute right-5 top-7 hidden text-accent/40 lg:block" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
