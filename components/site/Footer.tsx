import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { getServices } from '@/data/services';
import { ContactForm } from '@/components/contact/ContactForm';

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

        <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ContactForm copy={dict.form} locale={locale} email={siteMetadata.email} />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm text-bone-2">{dict.form.direct}</p>
            <a href={`mailto:${siteMetadata.email}`} className="link-underline mt-2 inline-block break-all py-1 text-lg text-bone">
              {siteMetadata.email}
            </a>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <a href={siteMetadata.social.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-block py-2 text-lg">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={siteMetadata.social.github} target="_blank" rel="noopener noreferrer" className="link-underline inline-block py-2 text-lg">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
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
            <li>
              <Link href={`/${locale}/notes`} className="link-underline inline-block py-1.5 text-bone-2 hover:text-bone">
                {dict.notes.label}
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
