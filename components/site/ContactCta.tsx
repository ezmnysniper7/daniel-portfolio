import { siteMetadata } from '@/data/metadata';

type Props = {
  title: string;
  body?: string;
  button: string;
  /** Topic preselected in the contact form when the button is used. */
  topic: 'project' | 'job' | 'other';
  orEmail: string;
  subject: string;
};

/** The call to action on service and hire pages: jumps to the contact form, with email as the alternative. */
export function ContactCta({ title, body, button, topic, orEmail, subject }: Props) {
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
            data-contact-topic={topic}
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
