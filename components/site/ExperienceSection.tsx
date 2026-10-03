import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Experience, Project } from '@/types';
import { formatPeriod, year } from '@/lib/format';

type Props = {
  dict: Dictionary;
  locale: string;
  experience: Experience[];
  /** Projects built in each job, keyed by experience id. */
  projectsByJob: Record<string, Project[]>;
};

/** Native <details> rows: expandable without any JavaScript. */
export function ExperienceSection({ dict, locale, experience, projectsByJob }: Props) {
  const { experience: copy, toolbox } = dict;
  return (
    <section id="experience" className="border-t border-line py-20 md:py-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">
            <span className="text-signal">{copy.index}</span> / {copy.label}
          </p>
          <div className="lg:col-span-8">
            <h2 className="display-xl" data-split>
              {copy.title}
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-bone-2" data-reveal>
              {copy.intro}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-line md:mt-16">
          {experience.map((e, n) => {
            const current = e.endDate === 'Present';
            const projects = projectsByJob[e.id] ?? [];
            return (
              <details key={e.id} className="exp-row border-b border-line" open={n === 0} data-reveal>
                <summary className="grid cursor-pointer grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 transition-colors hover:text-signal md:py-8">
                  <span className="col-span-10 col-start-1 row-start-1 flex flex-wrap items-center gap-2 md:col-span-3">
                    <span className="font-mono text-xs text-bone-2">{formatPeriod(e.startDate, e.endDate, locale, copy.present)}</span>
                    {e.type ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[0.7rem] ${
                          e.type === 'freelance' ? 'border-dashed border-bone/60 text-bone' : 'border-bone/40 text-bone'
                        }`}
                      >
                        {copy.types[e.type]}
                      </span>
                    ) : null}
                    {current ? (
                      <span className="rounded-full bg-signal px-2.5 py-1 font-mono text-[0.7rem] text-ink">{copy.current}</span>
                    ) : null}
                  </span>
                  <span className="exp-plus col-span-2 col-start-11 row-start-1 justify-self-end text-2xl font-light leading-none text-bone-2 md:col-span-1 md:col-start-12" aria-hidden="true">
                    +
                  </span>
                  <span className="col-span-12 font-display text-[clamp(1.4rem,2.2vw,2.1rem)] leading-tight tracking-[-0.02em] md:col-span-4 md:col-start-4 md:row-start-1">
                    {e.company}
                  </span>
                  <span className="col-span-12 text-bone-2 md:col-span-4 md:col-start-8 md:row-start-1">{e.position}</span>
                </summary>

                <div className="grid grid-cols-12 gap-4 pb-10">
                  <div className="col-span-12 md:col-span-9 md:col-start-4">
                    <p className="eyebrow">{e.location}</p>
                    <p className="mt-4 max-w-3xl leading-relaxed text-bone">{e.description}</p>
                    <ul className="mt-5 max-w-3xl space-y-3 text-bone-2">
                      {e.responsibilities.map((r) => (
                        <li key={r} className="flex gap-4 leading-relaxed">
                          <span className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {e.techStack.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>

                    {projects.length ? (
                      <div className="mt-8">
                        <p className="eyebrow">{copy.projects}</p>
                        <ul className="mt-3 border-t border-line">
                          {projects.map((p) => (
                            <li key={p.slug}>
                              <Link
                                href={`/${locale}/work/${p.slug}`}
                                className="group flex items-baseline gap-4 border-b border-line py-3.5 transition-colors hover:text-signal"
                              >
                                <span className="w-10 shrink-0 font-mono text-xs text-bone-3">{year(p.startDate)}</span>
                                <span className="flex-1">{p.title}</span>
                                <span aria-hidden="true" className="text-bone-2 transition-transform group-hover:translate-x-1">
                                  →
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </details>
            );
          })}
        </div>

        <div className="mt-20 grid gap-8 md:mt-28 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-2">{toolbox.label}</p>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-10">
            {toolbox.groups.map((g) => (
              <div key={g.name} className="border-t border-line pt-4" data-reveal>
                <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-bone-2">{g.name}</dt>
                <dd className="mt-2 leading-relaxed text-bone">{g.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
