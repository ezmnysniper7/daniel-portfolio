import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Project } from '@/types';
import { CardArt } from './CardArt';
import { year } from '@/lib/format';

type Props = { locale: string; dict: Dictionary; projects: Project[] };
type Ownership = NonNullable<Project['ownership']>;

/** One visual language for ownership, used by the legend and every card. */
const badgeStyle: Record<Ownership, string> = {
  side: 'border-signal bg-signal text-ink',
  job: 'border-bone/50 bg-ink/80 text-bone',
  freelance: 'border-dashed border-bone/60 bg-ink/80 text-bone',
};

export function OwnershipBadge({ dict, project, className = '' }: { dict: Dictionary; project: Project; className?: string }) {
  const kind = project.ownership ?? 'side';
  const label = dict.work.badge[kind].replace('{company}', project.company ?? '');
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.04em] ${badgeStyle[kind]} ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * Without JS (and on touch / narrow screens) the rail is a native swipe carousel.
 * On desktop with motion allowed, the section pins and vertical scroll drives the rail.
 */
export function WorkSection({ locale, dict, projects }: Props) {
  const { work } = dict;
  const kinds: Ownership[] = ['side', 'job', 'freelance'];
  return (
    <section id="work" className="relative border-t border-line">
      <div data-hscroll className="flex flex-col justify-center overflow-hidden py-20 md:py-28 lg:min-h-screen lg:py-8">
        <div className="gutter mx-auto flex w-full max-w-page flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">
              <span className="text-signal">{work.index}</span> / {work.label}
            </p>
            <h2 className="display-xl mt-5" data-split>
              {work.title}
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-bone-2" data-reveal>
            {work.intro}
          </p>
        </div>

        <ul className="gutter mx-auto mt-8 flex w-full max-w-page flex-wrap gap-x-6 gap-y-3 lg:mt-5" aria-label={work.label}>
          {kinds.map((k) => (
            <li key={k} className="flex items-center gap-2.5 text-sm text-bone-2">
              <span className={`h-3.5 w-6 rounded-full border ${badgeStyle[k]}`} aria-hidden="true" />
              {work.legend[k]}
            </li>
          ))}
        </ul>

        <ol data-hscroll-track className="hs-track gutter mt-8 md:mt-10 lg:mt-6">
          {projects.map((p, n) => (
            <li key={p.slug} className="hs-card">
              <Link
                href={`/${locale}/work/${p.slug}`}
                data-cursor="view"
                className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-ink-2/60 transition-colors duration-500 hover:border-bone-3"
              >
                <div className="relative">
                  <CardArt slug={p.slug} className="aspect-[16/9] w-full lg:aspect-auto lg:h-[21vh]" />
                  <span className="eyebrow absolute left-5 top-5 text-bone">{String(n + 1).padStart(2, '0')}</span>
                  <OwnershipBadge dict={dict} project={p} className="absolute right-4 top-4" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="eyebrow">{year(p.startDate)}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.5rem,2vw,2rem)] leading-[1.1] tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-bone-2 lg:line-clamp-2">{p.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.techStack.slice(0, 4).map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="eyebrow mt-auto pt-6 text-bone transition-colors group-hover:text-signal">
                    {work.open} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="gutter mx-auto mt-8 flex w-full max-w-page items-center gap-6 lg:mt-6" aria-hidden="true">
          <span className="eyebrow shrink-0">{work.hint}</span>
          <span className="relative h-px flex-1 bg-line">
            <span data-hscroll-progress className="absolute inset-0 origin-left scale-x-0 bg-signal" />
          </span>
        </div>
      </div>
    </section>
  );
}
