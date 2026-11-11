import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { Icon, NOW_ICONS } from './Icons';

/** Current full-time role: a short intro and four highlights, as evidence of live fintech work. */
export function NowSection({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { now } = dict;
  return (
    <section id="now" className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto grid max-w-page gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow">{now.label}</p>
          <h2 className="display-lg mt-5">{now.title}</h2>
          <p className="mt-6 max-w-md leading-relaxed text-bone-2">{now.intro}</p>
          <p className="eyebrow mt-6">{now.since}</p>
          <Link href={`/${locale}/work/cfi-broker-payments-crypto-backend`} className="link-underline mt-5 inline-block py-2 text-sm text-bone">
            {now.caseStudy} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
          {now.chapters.map((c, n) => (
            <li key={c.kicker} data-reveal>
              <p className="flex items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-signal">
                <Icon name={NOW_ICONS[n]} className="h-5 w-5" />
                {c.kicker}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.3rem,1.8vw,1.6rem)] leading-snug tracking-[-0.01em]">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-bone-2">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
