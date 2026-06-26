'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { siteMetadata } from '@/data/metadata';

export function WorldFooter({ world }: { world: 'engineer' | 'property' }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tPortal = useTranslations('portal');
  const params = useParams();
  const locale = params.locale as string;
  const year = new Date().getFullYear();

  const otherWorld = world === 'engineer' ? 'property' : 'engineer';
  const otherLabel = world === 'engineer' ? tNav('property') : tNav('engineer');

  return (
    <footer className="relative z-10 mt-8 border-t border-line/70 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-6 lg:px-8">
        <div className="max-w-md">
          <p className="section-kicker">Daniel Chen</p>
          <p className="mt-3 text-lg font-semibold text-ink">{t('builtBySelf')}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <Link href={`/${locale}`} className="text-ink-2 transition-colors hover:text-accent">
              {tPortal('backToPortal')}
            </Link>
            <span className="text-line">·</span>
            <Link
              href={`/${locale}/${otherWorld}`}
              className="inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-accent"
            >
              {otherLabel} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-ink-2 md:items-end">
          <p>{t('copyright', { year, name: siteMetadata.name })}</p>
          <div className="flex flex-wrap gap-5">
            {siteMetadata.portfolioRepo && (
              <a
                href={siteMetadata.portfolioRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t('viewSource')}
              </a>
            )}
            {siteMetadata.social.github && (
              <a
                href={siteMetadata.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                GitHub
              </a>
            )}
            {siteMetadata.social.linkedin && (
              <a
                href={siteMetadata.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                LinkedIn
              </a>
            )}
            <a href={`mailto:${siteMetadata.email}`} className="transition-colors hover:text-accent">
              {t('email')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
