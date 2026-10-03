import type { Dictionary } from '@/data/dictionary';
import type { Experience } from '@/types';
import { formatPeriod } from '@/lib/format';

type Props = { dict: Dictionary; locale: string; experience: Experience[] };

/** Native <details> rows: expandable without any JavaScript. */
export function ExperienceSection({ dict, locale, experience }: Props) {
  const { experience: copy, toolbox } = dict;
  return (
    <section id="experience" className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">
            <span className="text-signal">{copy.index}</span> / {copy.label}
          </p>
          <h2 className="display-xl lg:col-span-8" data-split>
            {copy.title}
          </h2>
        </div>

        <div className="mt-14 border-t border-line md:mt-20">
          {experience.map((e, n) => (
            <details key={e.id} className="exp-row border-b border-line" open={n === 0} data-reveal>
              <summary className="grid cursor-pointer grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 transition-colors hover:text-signal md:py-9">
                <span className="col-span-12 font-mono text-xs text-bone-3 md:col-span-3 lg:col-span-2">
                  {formatPeriod(e.startDate, e.endDate, locale, copy.present)}
                </span>
                <span className="col-span-10 font-display text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight tracking-[-0.02em] md:col-span-4 lg:col-span-4">
                  {e.company}
                </span>
                <span className="hidden text-bone-2 md:col-span-4 md:block lg:col-span-5">{e.position}</span>
                <span className="exp-plus col-span-2 justify-self-end text-2xl font-light leading-none text-bone-2 md:col-span-1" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="grid grid-cols-12 gap-4 pb-12">
                <div className="col-span-12 md:col-span-9 md:col-start-4 lg:col-start-3 lg:col-span-9">
                  <p className="text-bone-2 md:hidden">{e.position}</p>
                  <p className="eyebrow mt-2 md:mt-0">
                    {e.location}
                    {e.type ? ` · ${copy.types[e.type]}` : ''}
                  </p>
                  <p className="mt-5 max-w-3xl leading-relaxed text-bone">{e.description}</p>
                  <ul className="mt-6 max-w-3xl space-y-3 text-bone-2">
                    {e.responsibilities.map((r) => (
                      <li key={r} className="flex gap-4 leading-relaxed">
                        <span className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-7 flex flex-wrap gap-1.5">
                    {e.techStack.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-2">{toolbox.label}</p>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-10">
            {toolbox.groups.map((g) => (
              <div key={g.name} className="border-t border-line pt-4" data-reveal>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-bone-3">{g.name}</dt>
                <dd className="mt-2 leading-relaxed text-bone">{g.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
