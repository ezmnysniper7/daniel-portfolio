'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/world/Reveal';
import { WhatsAppButton } from './WhatsAppButton';
import { propertyMeta } from '@/data/property';

export function PropertyHero() {
  const t = useTranslations('property');
  const params = useParams();
  const locale = params.locale as string;
  const base = `/${locale}/property`;

  const stats = [
    { value: `${propertyMeta.areas.length}+`, label: t('hero.statAreas') },
    { value: `${propertyMeta.languages.length}`, label: t('hero.statLangs') },
    { value: '24h', label: t('hero.statResponse') },
  ];

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.85fr)] lg:items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t('hero.kicker')}
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-7xl">
              {t('hero.headline')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-2 text-pretty">{t('hero.sub')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${base}/listings`} variant="accent" size="lg">
                {t('hero.browse')} <span aria-hidden="true">→</span>
              </Button>
              <WhatsAppButton message="Hi Daniel, I'm looking for a rental. Can you help?" label={t('hero.enquire')} size="lg" />
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-panel/60 p-4 backdrop-blur">
                  <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-2">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Warm illustration panel */}
          <Reveal delay={0.12}>
            <div className="surface-card relative overflow-hidden p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{ background: 'radial-gradient(120% 90% at 70% 10%, hsl(var(--glow-1) / 0.22), transparent 60%)' }}
              />
              <div className="relative flex flex-col items-center">
                <svg viewBox="0 0 200 150" className="w-full max-w-[260px] animate-float-soft" fill="none" aria-hidden="true">
                  {/* sun / warmth */}
                  <circle cx="158" cy="36" r="16" fill="hsl(var(--gold) / 0.35)" />
                  {/* house */}
                  <path d="M40 70 100 30 160 70" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                  <path d="M52 64v54h96V64" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* door */}
                  <path d="M86 118V92a14 14 0 0 1 28 0v26" stroke="hsl(var(--accent-2))" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="108" cy="104" r="1.6" fill="hsl(var(--accent-2))" />
                  {/* windows */}
                  <rect x="60" y="80" width="16" height="16" rx="1.5" stroke="hsl(var(--accent-2))" strokeWidth="1.8" />
                  <rect x="124" y="80" width="16" height="16" rx="1.5" stroke="hsl(var(--accent-2))" strokeWidth="1.8" />
                  {/* ground line */}
                  <path d="M30 118h140" stroke="hsl(var(--line))" strokeWidth="2" strokeLinecap="round" />
                </svg>

                <div className="mt-6 w-full rounded-2xl border border-line bg-paper-2/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {t('about.areasLabel')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-2">{propertyMeta.areas.join(' · ')}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {t('about.langsLabel')}
                  </p>
                  <p className="mt-2 text-sm text-ink-2">{propertyMeta.languages.join(' · ')}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
