import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { getServices } from '@/data/services';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocalTime } from './LocalTime';

type Props = {
  dict: Dictionary;
  locale: string;
  /** The contact page has its own form, so its footer skips this one. */
  form?: boolean;
};

export function DirectContact({ dict }: { dict: Dictionary }) {
  return (
    <>
      <p className="text-sm text-bone-2">{dict.form.direct}</p>
      <a href={`mailto:${siteMetadata.email}`} className="link-underline mt-1 inline-block break-all py-2 text-lg text-bone">
        {siteMetadata.email}
      </a>
      <br />
      <a
        href={`https://wa.me/${siteMetadata.whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline inline-block py-2 text-lg text-bone"
      >
        WhatsApp {siteMetadata.whatsapp} <span aria-hidden="true">↗</span>
      </a>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <a href={siteMetadata.social.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-block py-2 text-lg">
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a href={siteMetadata.social.github} target="_blank" rel="noopener noreferrer" className="link-underline inline-block py-2 text-lg">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}

export function Footer({ dict, locale, form = true }: Props) {
  const { footer, nav } = dict;
  const year = new Date().getFullYear();
  const services = getServices(locale);
  const sha = process.env.BUILD_SHA ?? '';
  const builtAt = new Date(process.env.BUILD_TIME ?? Date.now());
  const builtOn = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'zh-CN', {
    day: 'numeric',
    month: locale === 'en' ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(builtAt);
  const site = [
    { href: `/${locale}/work`, label: nav.work },
    { href: `/${locale}/notes`, label: nav.notes },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contact`, label: nav.contact },
    { href: `/${locale}/hire`, label: footer.hireLink },
  ];
  const linkClass = 'link-underline inline-block py-1.5 text-bone-2 hover:text-bone';

  return (
    <footer id={form ? 'contact' : undefined} className={`relative overflow-hidden border-t border-line ${form ? 'pt-24 md:pt-36' : 'pt-4'}`}>
      <div className="gutter mx-auto max-w-page">
        {form ? (
          <>
            <p className="eyebrow">{footer.label}</p>
            <h2 className="display-xl mt-6">
              {footer.lines[0]}
              <br />
              {footer.lines[1]}
            </h2>

            <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <ContactForm copy={dict.form} locale={locale} email={siteMetadata.email} />
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <DirectContact dict={dict} />
              </div>
            </div>
          </>
        ) : null}

        <div className={`grid gap-10 border-t border-line pt-8 md:grid-cols-12 ${form ? 'mt-20' : 'mt-0 border-t-0'}`}>
          <nav aria-label={footer.servicesLabel} className="md:col-span-7">
            <p className="eyebrow">{footer.servicesLabel}</p>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${locale}/services/${s.slug}`} className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={footer.siteLabel} className="md:col-span-4 md:col-start-9">
            <p className="eyebrow">{footer.siteLabel}</p>
            <ul className="mt-4">
              {site.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-bone-3 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em]">
            © {year} {siteMetadata.name} · {siteMetadata.nameZh}
          </span>
          <span>{footer.rights}</span>
        </div>
      </div>

      {/* Sign-off: the page ends like the status bar of a running system (live local time, the real last deploy). */}
      <div className="mt-10 border-t border-line bg-bone/[0.03]">
        <div className="gutter mx-auto flex max-w-page flex-wrap items-center gap-x-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-bone-3 md:py-0">
          <span className="flex items-center gap-2.5 py-1.5 text-bone-2 md:py-3">
            <span className="status-dot" aria-hidden="true" />
            {footer.status}
          </span>
          <span className="py-1.5 md:border-l md:border-line md:py-3 md:pl-6">
            {footer.city} <LocalTime className="tabular-nums text-bone-2" /> GMT+8
          </span>
          {sha ? (
            <a
              href={`${siteMetadata.social.github}/daniel-portfolio/commit/${sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 transition-colors hover:text-bone md:border-l md:border-line md:py-3 md:pl-6"
            >
              {footer.deployed} <time dateTime={builtAt.toISOString()}>{builtOn}</time> ·{' '}
              <span className="normal-case">{sha.slice(0, 7)}</span>
            </a>
          ) : null}
          <a href="#top" data-magnetic className="link-underline ml-auto w-fit py-2 text-bone md:py-3">
            {footer.top} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
