import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Project } from '@/types';
import { CardArt } from './CardArt';
import { TraceSection } from './Trace';
import { Shared } from '@/components/motion/Shared';

type Props = {
  locale: string;
  dict: Dictionary;
  projects: Project[];
};
type Kind = 'side' | 'job' | 'freelance' | 'prototype';

/** A prototype is labelled as one wherever it appears, ahead of who owns it. */
export function projectKind(project: Project): Kind {
  return project.evidence === 'prototype' ? 'prototype' : (project.ownership ?? 'side');
}

/** One visual language for ownership, used by the legend and the case study pages. */
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
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] ${badgeStyle[kind]} ${className}`}>
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

/** A picture, who the work was for, the title and one paragraph. The whole card is the link. */
export function WorkCard({ locale, dict, project }: { locale: string; dict: Dictionary; project: Project }) {
  const kind = projectKind(project);
  return (
    <Link href={`/${locale}/work/${project.slug}`} data-track="case_study_open" className="group flex h-full flex-col">
      <Shared name={`art-${project.slug}`}>
        <CardArt
          slug={project.slug}
          locale={locale}
          className="aspect-[16/10] w-full rounded-2xl border border-line transition-colors duration-300 group-hover:border-bone-3"
        />
      </Shared>
      {/* Ownership is always stated: a job, a freelance contract or my own product. */}
      <p className="mt-5 text-sm text-bone-3">
        {dict.work.badge[kind].replace('{company}', project.company ?? '')}
      </p>
      <h3 className="mt-1.5 font-display text-[1.3rem] leading-snug transition-colors duration-300 group-hover:text-signal">{project.title}</h3>
      <p className="mt-2.5 line-clamp-3 text-[0.95rem] leading-relaxed text-bone-2">{project.description}</p>
    </Link>
  );
}

/** Home page: three selected case studies. */
export function WorkSection({ locale, dict, projects }: Props) {
  const { work } = dict;
  return (
    <TraceSection id="work" title={dict.nav.work} link={{ href: `/${locale}/work`, label: work.all }}>
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <WorkCard locale={locale} dict={dict} project={p} />
          </li>
        ))}
      </ul>
    </TraceSection>
  );
}
