import { siteMetadata } from '@/data/metadata';

type Props = { title: string; body?: string; button: string; subject: string };

/** The conversion block on service and hire pages: a prefilled email plus LinkedIn. */
export function ContactCta({ title, body, button, subject }: Props) {
  const mailto = `mailto:${siteMetadata.email}?subject=${encodeURIComponent(subject)}`;
  return (
    <section className="border-t border-line">
      <div className="gutter mx-auto max-w-page py-24 md:py-32">
        <h2 className="display-xl max-w-[18ch]">
          {title}
        </h2>
        {body ? (
          <p className="mt-6 max-w-xl leading-relaxed text-bone-2" data-reveal>
            {body}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" data-reveal>
          <a
            href={mailto}
            data-magnetic
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-medium text-ink transition-colors hover:bg-signal"
          >
            {button}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a href={siteMetadata.social.linkedin} target="_blank" rel="noopener noreferrer" data-magnetic className="link-underline text-lg">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <span className="font-mono text-sm text-bone-2">{siteMetadata.email}</span>
        </div>
      </div>
    </section>
  );
}
