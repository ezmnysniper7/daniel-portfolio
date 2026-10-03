import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Project } from '@/types';
import { CardArt } from './CardArt';
import { year } from '@/lib/format';

type Props = { locale: string; dict: Dictionary; projects: Project[]; archive: Project[] };

/**
 * Without JS (and on touch / narrow screens) the rail is a native swipe carousel.
 * On desktop with motion allowed, the section pins and vertical scroll drives the rail.
 */
export function WorkSection({ locale, dict, projects, archive }: Props) {
  const { work } = dict;
  return (
    <section id="work" className="relative border-t border-line">
      <div data-hscroll className="flex flex-col justify-center overflow-hidden py-24 md:py-32 lg:min-h-screen lg:py-14">
        <div className="gutter mx-auto flex w-full max-w-page flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">
              <span className="text-signal">{work.index}</span> / {work.label}
            </p>
            <h2 className="display-xl mt-6 max-w-[16ch] lg:max-w-none lg:text-[clamp(2.6rem,4.4vw,4.75rem)]" data-split>
              {work.title}
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-bone-2" data-reveal>
            {work.intro}
          </p>
        </div>

        <ol data-hscroll-track className="hs-track gutter mt-12 md:mt-16 lg:mt-12">
          {projects.map((p, n) => (
            <li key={p.slug} className="hs-card">
              <Link
                href={`/${locale}/work/${p.slug}`}
                data-cursor="view"
                className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-ink-2/60 transition-colors duration-500 hover:border-bone-3"
              >
                <div className="relative">
                  <CardArt slug={p.slug} className="aspect-[16/10] w-full lg:aspect-auto lg:h-[25vh]" />
                  <span className="eyebrow absolute left-5 top-5 text-bone">{String(n + 1).padStart(2, '0')}</span>
                  <span className="chip absolute right-5 top-4 bg-ink/70 text-bone">
                    {p.kind === 'side' ? work.side : p.company}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="eyebrow">
                    {year(p.startDate)}
                    {p.kind === 'side' && p.company && p.company !== work.side ? ` · ${p.company}` : ''}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,2.3vw,2.3rem)] leading-[1.05] tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-bone-2">{p.description}</p>
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

        <div className="gutter mx-auto mt-8 flex w-full max-w-page items-center gap-6" aria-hidden="true">
          <span className="eyebrow shrink-0">{work.hint}</span>
          <span className="relative h-px flex-1 bg-line">
            <span data-hscroll-progress className="absolute inset-0 origin-left scale-x-0 bg-signal" />
          </span>
        </div>
      </div>

      <div className="gutter mx-auto max-w-page pb-24 md:pb-32">
        <p className="eyebrow">{work.archive}</p>
        <ul className="mt-6 border-t border-line">
          {archive.map((p) => (
            <li key={p.slug} data-reveal>
              <Link
                href={`/${locale}/work/${p.slug}`}
                className="group grid grid-cols-12 items-baseline gap-3 border-b border-line py-4 transition-colors hover:text-signal md:py-5"
              >
                <span className="col-span-2 font-mono text-xs text-bone-3 md:col-span-1">{year(p.startDate)}</span>
                <span className="col-span-10 text-base md:col-span-6 md:text-lg">{p.title}</span>
                <span className="col-span-10 col-start-3 text-sm text-bone-2 md:col-span-3 md:col-start-auto">{p.company}</span>
                <span className="hidden text-right font-mono text-[0.68rem] text-bone-3 md:col-span-2 md:block">
                  {p.techStack.slice(0, 2).join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
