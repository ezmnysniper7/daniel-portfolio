import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { getServices } from '@/data/services';

export function Footer({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { footer } = dict;
  const year = new Date().getFullYear();
  const services = getServices(locale);
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line pt-24 md:pt-36">
      <div className="gutter mx-auto max-w-page">
        <p className="eyebrow">{footer.label}</p>
        <h2 className="display-xl mt-6">
          {footer.lines[0]}
          <br />
          {footer.lines[1]}
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-16">
          <a
            href={`mailto:${siteMetadata.email}`}
            data-magnetic
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-medium text-ink transition-colors hover:bg-signal"
          >
            {footer.email}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a href={siteMetadata.social.linkedin} target="_blank" rel="noopener noreferrer" data-magnetic className="link-underline text-lg">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a href={siteMetadata.social.github} target="_blank" rel="noopener noreferrer" data-magnetic className="link-underline text-lg">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <span className="font-mono text-sm text-bone-2">{siteMetadata.email}</span>
        </div>

        <nav aria-label={footer.servicesLabel} className="mt-20 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">{footer.servicesLabel}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-9">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/services/${s.slug}`} className="link-underline inline-block py-1.5 text-bone-2 hover:text-bone">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${locale}/hire`} className="link-underline inline-block py-1.5 text-bone hover:text-signal">
                {footer.hireLink}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone-3 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {siteMetadata.name} · {siteMetadata.nameZh} · Kuala Lumpur
          </span>
          <span className="normal-case tracking-normal">{footer.rights}</span>
          <a href="#top" data-magnetic className="link-underline w-fit py-2 text-bone">
            {footer.top} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      <div className="mt-12 overflow-hidden" aria-hidden="true">
        <p className="wordmark translate-y-[0.14em] text-center text-bone">
          Daniel Chen
        </p>
      </div>
    </footer>
  );
}
