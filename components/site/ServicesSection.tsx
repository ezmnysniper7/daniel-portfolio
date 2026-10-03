import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Service } from '@/data/services';
import { Icon, ServiceIcon } from './Icons';

/** Landing-page summary of the services; each row links to its own landing page. */
export function ServicesSection({ locale, dict, services }: { locale: string; dict: Dictionary; services: Service[] }) {
  const { services: copy } = dict;
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">{copy.label}</p>
          <div className="lg:col-span-8">
            <h2 className="display-xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-bone-2">
              {copy.intro}
            </p>
          </div>
        </div>

        <ul className="mt-14 border-t border-line md:mt-20">
          {services.map((s) => (
            <li key={s.slug} data-reveal>
              <Link
                href={`/${locale}/services/${s.slug}`}
                className="group grid gap-3 border-b border-line py-8 transition-colors md:grid-cols-12 md:items-center md:py-10"
              >
                <h3 className="flex items-center gap-5 md:col-span-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-bone transition-colors duration-500 group-hover:border-signal group-hover:text-signal"><ServiceIcon slug={s.slug} className="h-5 w-5" /></span>
                  <span className="display-lg transition-colors duration-500 group-hover:text-signal">{s.title}</span>
                </h3>
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
              className="group grid gap-3 border-b border-line py-8 transition-colors md:grid-cols-12 md:items-center md:py-10"
            >
              <h3 className="flex items-center gap-5 md:col-span-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-bone transition-colors duration-500 group-hover:border-signal group-hover:text-signal"><Icon name="send" className="h-5 w-5" /></span>
                <span className="display-lg transition-colors duration-500 group-hover:text-signal">{copy.hireTitle}</span>
              </h3>
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
