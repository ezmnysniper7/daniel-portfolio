import type { ReactNode } from 'react';
import Link from 'next/link';

/**
 * The home page below the hero reads as one trace through a system: a rail down the left,
 * a node at each section, and a packet that travels the rail as you scroll.
 * Phones get the same sections as a plain stack.
 */
export function Trace({ children }: { children: ReactNode }) {
  return (
    <div className="trace gutter relative mx-auto max-w-page">
      <div className="trace-rail" aria-hidden="true">
        <span className="trace-packet">
          <span className="trace-glint" />
        </span>
      </div>
      {children}
    </div>
  );
}

type Props = {
  id: string;
  title: string;
  /** The quiet link under the section name. */
  link?: { href: string; label: string };
  children: ReactNode;
};

export function TraceSection({ id, title, link, children }: Props) {
  return (
    <section id={id} className="grid gap-x-10 gap-y-7 py-14 md:py-20 md:pl-10 lg:grid-cols-12">
      <div className="flex items-baseline justify-between gap-6 lg:col-span-3 lg:block">
        <h2 className="display-lg relative">
          <span className="trace-node" aria-hidden="true" />
          {title}
        </h2>
        {link ? (
          <Link href={link.href} className="eyebrow link-underline inline-block shrink-0 py-2 hover:text-bone lg:mt-1">
            {link.label}
          </Link>
        ) : null}
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}
