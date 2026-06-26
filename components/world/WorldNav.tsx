'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { cn } from '@/lib/utils';

export function WorldNav({ world }: { world: 'engineer' | 'property' }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const tNav = useTranslations('nav');
  const tProp = useTranslations('propertyNav');
  const tHome = useTranslations('home');

  const base = `/${locale}/${world}`;
  const stripped = pathname.replace(/^\/(en|zh-CN)/, '') || '/';

  const links =
    world === 'engineer'
      ? [
          { href: base, label: tNav('home'), match: `/${world}` },
          { href: `${base}/projects`, label: tNav('projects'), match: `/${world}/projects` },
          { href: `${base}/about`, label: tNav('about'), match: `/${world}/about` },
          { href: `${base}/contact`, label: tNav('contact'), match: `/${world}/contact` },
        ]
      : [
          { href: base, label: tProp('home'), match: `/${world}` },
          { href: `${base}/listings`, label: tProp('listings'), match: `/${world}/listings` },
          { href: `${base}/contact`, label: tProp('contact'), match: `/${world}/contact` },
        ];

  const otherWorld = world === 'engineer' ? 'property' : 'engineer';
  const switchLabel = world === 'engineer' ? tNav('property') : tNav('engineer');
  const role = world === 'engineer' ? tHome('title') : tProp('role');

  const isActive = (match: string) => {
    if (match === `/${world}`) return stripped === `/${world}` || stripped === `/${world}/`;
    return stripped.startsWith(match);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-3" aria-label="Portal">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-panel/70 font-mono text-sm font-semibold tracking-[0.16em] text-ink transition-colors group-hover:border-accent group-hover:text-accent">
            DC
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-ink">Daniel Chen</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-3">{role}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-line bg-panel/60 px-2 py-1.5 backdrop-blur md:flex">
          {links.map((link) => {
            const active = isActive(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  active ? 'bg-accent text-white' : 'text-ink-2 hover:text-accent'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/${otherWorld}`}
            className="hidden items-center gap-1.5 rounded-full border border-line bg-panel/60 px-3 py-2 text-xs font-medium text-ink-2 backdrop-blur transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            title={`${tNav('switchTo')} ${switchLabel}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {switchLabel}
            <span aria-hidden="true">↗</span>
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
