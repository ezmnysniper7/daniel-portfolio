'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Aurora } from './Aurora';
import { WorldPanel } from './WorldPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Portal({ locale }: { locale: string }) {
  const t = useTranslations('portal');
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
        };

  return (
    <div className="grid-overlay relative flex min-h-screen flex-col overflow-hidden">
      <Aurora />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <span className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-panel/70 font-mono text-sm font-semibold tracking-[0.18em] text-ink backdrop-blur">
            DC
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-ink-3 sm:block">
            {t('kicker')}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-14 pt-4 md:px-8 md:pb-20">
        <motion.div {...fade(0.05)} className="max-w-3xl">
          <p className="section-kicker">{t('chooseHint')}</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
            {t('name')}
            <span className="ml-3 align-middle text-2xl text-ink-3 md:text-3xl">{t('nameZh')}</span>
          </h1>
          <p className="mt-5 font-display text-2xl text-gradient md:text-3xl">{t('tagline')}</p>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink-2 text-pretty">{t('intro')}</p>
        </motion.div>

        <div className="mt-10 flex flex-col gap-5 md:mt-12 md:flex-row">
          <WorldPanel
            world="engineer"
            href={`/${locale}/engineer`}
            label={t('engineer.label')}
            headline={t('engineer.headline')}
            desc={t('engineer.desc')}
            status={t('engineer.status')}
            cta={t('engineer.enter')}
            meta={t('engineer.next')}
            index={0}
          />
          <WorldPanel
            world="property"
            href={`/${locale}/property`}
            label={t('property.label')}
            headline={t('property.headline')}
            desc={t('property.desc')}
            status={t('property.status')}
            cta={t('property.enter')}
            meta={t('property.tag')}
            index={1}
          />
        </div>
      </main>

      {/* Footer hint */}
      <motion.footer
        {...fade(0.5)}
        className="relative z-10 flex items-center justify-center gap-2 px-5 pb-7 text-xs text-ink-3"
      >
        <Link href={`/${locale}/engineer`} className="transition-colors hover:text-accent">
          {t('engineer.label')}
        </Link>
        <span className="opacity-40">·</span>
        <Link href={`/${locale}/property`} className="transition-colors hover:text-accent">
          {t('property.label')}
        </Link>
      </motion.footer>
    </div>
  );
}
