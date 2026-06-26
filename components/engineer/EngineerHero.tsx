'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/world/Reveal';
import { VisitorCount } from '@/components/home/VisitorCount';
import { Sparkline } from './Sparkline';
import { siteMetadata } from '@/data/metadata';

interface EngineerHeroProps {
  availableForWork: boolean;
  initialVisitorCount: number;
  visitorCounterEnabled: boolean;
}

export function EngineerHero({
  availableForWork,
  initialVisitorCount,
  visitorCounterEnabled,
}: EngineerHeroProps) {
  const t = useTranslations('home');
  const params = useParams();
  const locale = params.locale as string;
  const base = `/${locale}/engineer`;

  const proofItems = [
    { value: '6+', label: t('hero.proof.roles') },
    { value: 'Payments', label: t('hero.proof.payments') },
    { value: 'Cloud', label: t('hero.proof.platforms') },
  ];

  const focusItems = [
    t('hero.focusItems.payments'),
    t('hero.focusItems.platforms'),
    t('hero.focusItems.interfaces'),
  ];

  return (
    <Section className="pt-10 md:pt-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_360px] lg:items-start">
          {/* Main */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-up/30 bg-up/10 px-3 py-1 text-xs font-medium text-up">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-up" />
                </span>
                {t('hero.open')} · {t('hero.openZh')}
              </span>
              <span className="rounded-full border border-line bg-panel/60 px-3 py-1 font-mono text-xs text-ink-3">
                BASE: {t('location')}
              </span>
            </div>

            <p className="section-kicker mt-6">{t('greeting')}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-ink md:text-7xl">
              {t('name')}
            </h1>
            <p className="mt-4 font-mono text-xl text-accent md:text-2xl">{t('title')}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-2">{t('tagline')}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-3">{t('hero.supportingText')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${base}/projects`} variant="accent" size="lg">
                {t('viewProjects')} <span aria-hidden="true">→</span>
              </Button>
              <Button href={`${base}/contact`} variant="secondary" size="lg">
                {t('contactMe')}
              </Button>
              {siteMetadata.resumeUrl && (
                <Button href={siteMetadata.resumeUrl} variant="ghost" size="lg" external>
                  {t('hero.resume')}
                </Button>
              )}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <VisitorCount initialCount={initialVisitorCount} enabled={visitorCounterEnabled} />
              {proofItems.map((item) => (
                <div key={item.label} className="rounded-3xl border border-line bg-panel/60 p-5 backdrop-blur">
                  <p className="font-mono text-xl font-semibold text-ink">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-2">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Terminal monitor panel */}
          <Reveal delay={0.12}>
            <div className="surface-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-down/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-up/80" />
                  <span className="ml-2 font-mono text-xs text-ink-3">~/now</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-up">
                  <span className="h-1.5 w-1.5 rounded-full bg-up" /> {t('hero.live')}
                </span>
              </div>

              <div className="p-6">
                <p className="text-lg font-semibold text-ink">{t('title')}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {availableForWork ? t('availableForWork') : t('notAvailableForWork')}
                </p>

                {/* CFI — what's next */}
                <div className="mt-6 rounded-2xl border border-line bg-paper-2/50 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {t('hero.cfiKicker')} →
                    </p>
                    <span className="font-mono text-xs text-up">▲ live markets</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-ink">{t('hero.cfiTitle')}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-2">{t('hero.cfiDesc')}</p>
                  <Sparkline className="mt-4 h-10 w-full" />
                </div>

                {/* Focus */}
                <div className="mt-6">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-3">
                    {t('hero.focus')}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {focusItems.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-2">
                        <span className="mt-0.5 font-mono text-accent">{'>'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
