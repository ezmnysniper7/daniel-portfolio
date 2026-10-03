import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Service } from '@/data/services';

/** Landing-page summary of the services; each row links to its own landing page. */
export function ServicesSection({ locale, dict, services }: { locale: string; dict: Dictionary; services: Service[] }) {
  const { services: copy } = dict;
  return (
    <section id="services" className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">
            <span className="text-signal">{copy.index}</span> / {copy.label}
          </p>
          <div className="lg:col-span-8">
            <h2 className="display-xl" data-split>
              {copy.title}
            </h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-bone-2" data-reveal>
              {copy.intro}
            </p>
          </div>
        </div>

        <ul className="mt-14 border-t border-line md:mt-20">
          {services.map((s, n) => (
            <li key={s.slug} data-reveal>
              <Link
                href={`/${locale}/services/${s.slug}`}
                data-cursor="view"
                className="group grid gap-3 border-b border-line py-8 transition-colors md:grid-cols-12 md:items-baseline md:py-10"
              >
                <span className="font-mono text-xs text-signal md:col-span-1">0{n + 1}</span>
                <h3 className="display-lg transition-colors duration-500 group-hover:text-signal md:col-span-5">{s.title}</h3>
                <p className="max-w-md leading-relaxed text-bone-2 md:col-span-5">{s.short}</p>
                <span className="eyebrow text-bone md:col-span-1 md:justify-self-end" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
          <li data-reveal>
            <Link
              href={`/${locale}/hire`}
              className="group grid gap-3 border-b border-line py-8 transition-colors md:grid-cols-12 md:items-baseline md:py-10"
            >
              <span className="font-mono text-xs text-bone-3 md:col-span-1">+</span>
              <h3 className="display-lg transition-colors duration-500 group-hover:text-signal md:col-span-5">{copy.hireTitle}</h3>
              <p className="max-w-md leading-relaxed text-bone-2 md:col-span-5">{copy.hireBody}</p>
              <span className="eyebrow text-bone md:col-span-1 md:justify-self-end" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
