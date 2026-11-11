import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Experience } from '@/types';
import { formatPeriod } from '@/lib/format';

type Props = { dict: Dictionary; locale: string; experience: Experience[]; heading?: boolean };

/** Every role in one compact list, each labelled job, freelance or own product. The full history lives on the About page. */
export function ExperienceList({ dict, locale, experience }: Omit<Props, 'heading'>) {
  const { experience: copy } = dict;
  return (
    <ul>
      {experience.map((e) => (
        <li key={e.id} className="grid grid-cols-12 items-baseline gap-x-4 gap-y-1.5 border-b border-line py-5" data-reveal>
          <span className="col-span-12 flex flex-wrap items-center gap-2 md:col-span-4">
            <span className="font-mono text-xs text-bone-3">{formatPeriod(e.startDate, e.endDate, locale, copy.present)}</span>
            {e.type ? (
              <span
                className={`rounded-full border px-2.5 py-1 font-mono text-[0.7rem] ${
                  e.type === 'side'
                    ? 'border-signal bg-signal text-ink'
                    : e.type === 'freelance'
                      ? 'border-dashed border-bone/60 text-bone'
                      : 'border-bone/40 text-bone'
                }`}
              >
                {copy.types[e.type]}
              </span>
            ) : null}
          </span>
          <span className="col-span-12 font-display text-xl md:col-span-4 md:text-2xl">{e.company}</span>
          <span className="col-span-12 text-bone-2 md:col-span-4">{e.position}</span>
        </li>
      ))}
    </ul>
  );
}

export function ExperienceGlance({ dict, locale, experience }: Props) {
  const { experience: copy } = dict;
  return (
    <section id="experience" className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">{copy.label}</p>
          <div className="lg:col-span-8">
            <h2 className="display-xl">{copy.glanceTitle}</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-bone-2">{copy.glanceIntro}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-line md:mt-16">
          <ExperienceList dict={dict} locale={locale} experience={experience} />
        </div>
        <p className="mt-8">
          <Link href={`/${locale}/about#experience`} className="eyebrow link-underline inline-block py-3 text-bone">
            {copy.full} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
