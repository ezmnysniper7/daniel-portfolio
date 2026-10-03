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
  const nav = [
    { id: 'now', label: dict.nav.now },
    { id: 'work', label: dict.nav.work },
    { id: 'experience', label: dict.nav.experience },
  ];

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
        <nav aria-label="Primary" className="flex items-center gap-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone-2 md:gap-8">
          {nav.map((item) => (
            <a key={item.id} href={anchor(item.id)} className="link-underline hidden hover:text-bone md:inline" data-magnetic>
              {item.label}
            </a>
          ))}
          <a href={anchor('contact')} className="link-underline hover:text-bone" data-magnetic>
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
