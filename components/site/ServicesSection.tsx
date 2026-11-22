import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Service } from '@/data/services';

/** Landing-page summary: the core services as one quiet list. Everything else lives on the services page. */
export function ServicesSection({ locale, dict, services }: { locale: string; dict: Dictionary; services: Service[] }) {
  const { services: copy } = dict;
  const primary = services.filter((s) => s.tier === 'primary');
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">{copy.label}</p>
          <div className="lg:col-span-8">
            <h2 className="display-xl">{copy.title}</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-bone-2">{copy.intro}</p>
          </div>
        </div>

        <ul className="mt-12 border-t border-line md:mt-16">
          {primary.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${locale}/services/${s.slug}`}
                className="group grid gap-1.5 border-b border-line py-5 md:grid-cols-12 md:items-baseline md:gap-8 md:py-6"
              >
                <h3 className="font-display text-[clamp(1.3rem,1.75vw,1.65rem)] leading-tight tracking-[-0.015em] transition-colors duration-300 group-hover:text-signal md:col-span-5">
                  {s.title}
                </h3>
                <p className="leading-relaxed text-bone-2 md:col-span-7">{s.short}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <Link href={`/${locale}/services`} className="eyebrow link-underline inline-block py-3 text-bone">
            {copy.all} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
