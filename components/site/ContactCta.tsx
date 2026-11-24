import Link from 'next/link';
import type { ContactNeed } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { TraceSection } from './Trace';
import { Portrait } from './Portrait';

type Props = {
  title: string;
  body?: string;
  button: string;
  /** Preselected in the contact form when the button is used. */
  need: ContactNeed;
  orEmail: string;
  subject: string;
};

/** The call to action on service, case study and hiring pages: jumps to the contact form, with email as the alternative. */
export function ContactCta({ title, body, button, need, orEmail, subject }: Props) {
  const mailto = `mailto:${siteMetadata.email}?subject=${encodeURIComponent(subject)}`;
  return (
    <section className="border-t border-line">
      <div className="gutter mx-auto max-w-page py-24 md:py-32">
        <h2 className="display-xl max-w-[18ch]">{title}</h2>
        {body ? (
          <p className="mt-6 max-w-xl leading-relaxed text-bone-2" data-reveal>
            {body}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" data-reveal>
          <a
            href="#contact"
            data-contact-need={need}
            data-track="cta_page_contact"
            data-magnetic
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-medium text-ink transition-colors hover:bg-signal"
          >
            {button}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <a href={mailto} className="link-underline inline-block py-2 text-bone-2 hover:text-bone">
            {orEmail}: <span className="text-bone">{siteMetadata.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** Home page: a short invitation that leads to the contact page, in place of a full form. The last stop on the trace. */
export function ContactInvite({ locale, label, title, body, button }: { locale: string; label: string; title: string; body: string; button: string }) {
  return (
    <TraceSection id="contact" title={label}>
      <p className="display-xl max-w-[18ch]">{title}</p>
      <p className="mt-5 max-w-md leading-relaxed text-bone-2">{body}</p>
      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Portrait locale={locale} size="small" className="h-14 w-14 rounded-full border border-line object-cover" />
        <Link
          href={`/${locale}/contact`}
          data-track="cta_home_contact"
          data-magnetic
          className="inline-flex items-center rounded-full bg-bone px-7 py-4 font-medium text-ink transition-colors hover:bg-signal"
        >
          {button}
        </Link>
        <a href={`mailto:${siteMetadata.email}`} className="link-underline py-2 text-bone-2 hover:text-bone">
          {siteMetadata.email}
        </a>
      </div>
    </TraceSection>
  );
}
