import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { MobileMenu } from './MobileMenu';

type Props = {
  locale: string;
  dict: Dictionary;
  /** Path after the locale, used for the language switch (e.g. '' or '/work/solvemy'). */
  path: string;
};

export function Header({ locale, dict, path }: Props) {
  const other = locale === 'en' ? 'zh-CN' : 'en';
  const { nav } = dict;
  // 40px+ tall hit areas for touch; the underline lives on the inner span so it hugs the text.
  const link = 'group inline-flex min-h-[40px] items-center whitespace-nowrap hover:text-bone';

  return (
    <header data-header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink via-ink/75 to-transparent" aria-hidden="true" />
      <div className="gutter relative mx-auto flex max-w-page items-center justify-between py-3 md:py-4">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap text-[1.02rem] font-semibold tracking-[-0.01em] text-bone"
        >
          Daniel Chen
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2.5 text-[0.92rem] text-bone-2 sm:gap-3.5 md:gap-7">
          <MobileMenu
            label={nav.menu}
            closeLabel={nav.close}
            links={[
              { href: `/${locale}/services`, label: nav.services },
              { href: `/${locale}/work`, label: nav.work },
              { href: `/${locale}/services/fintech-technical-partner`, label: nav.founders },
              { href: `/${locale}/notes`, label: nav.notes },
              { href: `/${locale}/about`, label: nav.about },
              { href: `/${locale}/contact`, label: nav.contact },
            ]}
          />
          <Link href={`/${locale}/services`} className={`${link} hidden md:inline-flex`}>
            <span className="link-underline">{nav.services}</span>
          </Link>
          <Link href={`/${locale}/work`} className={`${link} hidden md:inline-flex`}>
            <span className="link-underline">{nav.work}</span>
          </Link>
          <Link href={`/${locale}/services/fintech-technical-partner`} className={`${link} hidden lg:inline-flex`}>
            <span className="link-underline">{nav.founders}</span>
          </Link>
          <Link href={`/${locale}/notes`} className={`${link} hidden xl:inline-flex`}>
            <span className="link-underline">{nav.notes}</span>
          </Link>
          <Link href={`/${locale}/about`} className={`${link} hidden md:inline-flex`}>
            <span className="link-underline">{nav.about}</span>
          </Link>
          {/* Every page ends with the contact form, so this stays on the current page. */}
          <a
            href="#contact"
            data-track="cta_header"
            className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full bg-bone px-4 font-medium text-ink transition-colors hover:bg-signal sm:px-5"
          >
            <span className="xl:hidden">{nav.contact}</span>
            <span className="hidden xl:inline">{nav.cta}</span>
          </a>
          <Link
            href={`/${other}${path}`}
            hrefLang={other}
            lang={other}
            className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full border border-line px-3 text-bone transition-colors hover:border-bone-3 sm:px-3.5"
          >
            {nav.switchTo}
          </Link>
        </nav>
      </div>
    </header>
  );
}
