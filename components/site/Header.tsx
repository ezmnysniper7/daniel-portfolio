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
  // 40px+ tall hit areas for touch; the underline lives on the inner span so it hugs the text.
  const link = 'group inline-flex min-h-[40px] items-center whitespace-nowrap hover:text-bone';

  return (
    <header data-header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/75 to-transparent" aria-hidden="true" />
      <div className="gutter relative mx-auto flex max-w-page items-center justify-between py-3 md:py-4">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap font-mono text-[0.75rem] uppercase tracking-[0.16em] text-bone md:tracking-[0.22em]"
          data-magnetic
        >
          Daniel Chen<span className="text-signal">.</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-bone-2 md:gap-7">
          <a href={anchor('work')} className={`${link} hidden md:inline-flex`} data-magnetic>
            <span className="link-underline">{dict.nav.work}</span>
          </a>
          <Link href={`/${locale}/services`} className={link} data-magnetic>
            <span className="link-underline">{dict.nav.services}</span>
          </Link>
          <a href={anchor('experience')} className={`${link} hidden lg:inline-flex`} data-magnetic>
            <span className="link-underline">{dict.nav.experience}</span>
          </a>
          <Link href={`/${locale}/hire`} className={`${link} hidden md:inline-flex`} data-magnetic>
            <span className="link-underline">{dict.nav.hire}</span>
          </Link>
          {/* Every page ends with the contact footer, so this stays on the current page. */}
          <a href="#contact" className={link} data-magnetic>
            <span className="link-underline">{dict.nav.contact}</span>
          </a>
          <Link
            href={`/${other}${path}`}
            hrefLang={other}
            lang={other}
            className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full border border-line px-3.5 text-bone transition-colors hover:border-bone-3"
            data-magnetic
          >
            {dict.nav.switchTo}
          </Link>
        </nav>
      </div>
    </header>
  );
}
