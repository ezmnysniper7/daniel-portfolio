import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';

type Props = {
  locale: string;
  dict: Dictionary;
  /** Path after the locale, used for the language switch (e.g. '' or '/work/solvemy'). */
  path: string;
  /** On the landing page, section links are plain in-page anchors. */
  home?: boolean;
};

export function Header({ locale, dict, path, home }: Props) {
  const other = locale === 'en' ? 'zh-CN' : 'en';
  const anchor = (id: string) => (home ? `#${id}` : `/${locale}#${id}`);
  const link = 'link-underline hover:text-bone';

  return (
    <header data-header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/75 to-transparent" aria-hidden="true" />
      <div className="gutter relative mx-auto flex max-w-page items-center justify-between py-5">
        <Link
          href={`/${locale}`}
          className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-bone"
          data-magnetic
        >
          Daniel Chen<span className="text-signal">.</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone-2 md:gap-7">
          <a href={anchor('work')} className={`${link} hidden md:inline`} data-magnetic>
            {dict.nav.work}
          </a>
          <Link href={`/${locale}/services`} className={link} data-magnetic>
            {dict.nav.services}
          </Link>
          <a href={anchor('experience')} className={`${link} hidden lg:inline`} data-magnetic>
            {dict.nav.experience}
          </a>
          <Link href={`/${locale}/hire`} className={`${link} hidden md:inline`} data-magnetic>
            {dict.nav.hire}
          </Link>
          {/* Every page ends with the contact footer, so this stays on the current page. */}
          <a href="#contact" className={link} data-magnetic>
            {dict.nav.contact}
          </a>
          <Link
            href={`/${other}${path}`}
            hrefLang={other}
            lang={other}
            className="rounded-full border border-line px-3 py-1.5 text-bone transition-colors hover:border-bone-3"
            data-magnetic
          >
            {dict.nav.switchTo}
          </Link>
        </nav>
      </div>
    </header>
  );
}
