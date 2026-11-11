import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Project } from '@/types';
import { CardArt } from './CardArt';
import { year } from '@/lib/format';

type Props = { locale: string; dict: Dictionary; projects: Project[] };
type Kind = 'side' | 'job' | 'freelance' | 'prototype';

/** A prototype is labelled as one wherever it appears, ahead of who owns it. */
export function projectKind(project: Project): Kind {
  return project.evidence === 'prototype' ? 'prototype' : (project.ownership ?? 'side');
}

/** One visual language for ownership, used by the legend and every card. */
const badgeStyle: Record<Kind, string> = {
  side: 'border-signal bg-signal text-ink',
  job: 'border-bone/50 bg-ink/80 text-bone',
  freelance: 'border-dashed border-bone/60 bg-ink/80 text-bone',
  prototype: 'border-dashed border-signal/70 bg-ink/80 text-signal',
};

export function OwnershipBadge({ dict, project, className = '' }: { dict: Dictionary; project: Project; className?: string }) {
  const kind = projectKind(project);
  const label = dict.work.badge[kind].replace('{company}', project.company ?? '');
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.04em] ${badgeStyle[kind]} ${className}`}
    >
      {label}
    </span>
  );
}

export function WorkLegend({ dict, className = '' }: { dict: Dictionary; className?: string }) {
  // No prototype is published at the moment; add 'prototype' back here when one is.
  const kinds: Kind[] = ['job', 'freelance', 'side'];
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-3 ${className}`} aria-label={dict.work.label}>
      {kinds.map((k) => (
        <li key={k} className="flex items-center gap-2.5 text-sm text-bone-2">
          <span className={`h-3.5 w-6 rounded-full border ${badgeStyle[k]}`} aria-hidden="true" />
          {dict.work.legend[k]}
        </li>
      ))}
    </ul>
  );
}

export function WorkCard({ locale, dict, project, wide = false }: { locale: string; dict: Dictionary; project: Project; wide?: boolean }) {
  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      data-track="case_study_open"
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-ink-2/60 transition-colors duration-500 hover:border-bone-3"
    >
      <div className="relative">
        <CardArt slug={project.slug} className={`aspect-[16/9] w-full ${wide ? 'lg:aspect-auto lg:h-60' : 'lg:aspect-auto lg:h-60'}`} />
        <OwnershipBadge dict={dict} project={project} className="absolute right-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="font-mono text-[0.72rem] text-bone-3">{year(project.startDate)}</p>
        <h3 className="mt-2 font-display text-[clamp(1.4rem,1.9vw,1.9rem)] leading-[1.1] tracking-[-0.02em] transition-colors duration-500 group-hover:text-signal">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-bone-2">{project.description}</p>
        <span className="mt-auto pt-6 text-sm text-bone">
          {dict.work.open}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

/** Selected case studies as a grid; the first gets a wide card. */
export function WorkSection({ locale, dict, projects }: Props) {
  const { work } = dict;
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{work.label}</p>
            <h2 className="display-xl mt-5">{work.title}</h2>
          </div>
          <p className="max-w-md leading-relaxed text-bone-2">{work.intro}</p>
        </div>

        <WorkLegend dict={dict} className="mt-8" />

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, n) => (
            <li key={p.slug} className={n === 0 ? 'md:col-span-2' : ''} data-reveal>
              <WorkCard locale={locale} dict={dict} project={p} wide={n === 0} />
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link href={`/${locale}/work`} className="eyebrow link-underline inline-block py-3 text-bone">
            {work.all} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
