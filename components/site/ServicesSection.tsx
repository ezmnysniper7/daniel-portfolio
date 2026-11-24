import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import type { Service } from '@/data/services';
import { TraceSection } from './Trace';

/** Home page: the core services as a plain list of links. Descriptions live on the services page. */
export function ServicesSection({ locale, dict, services }: { locale: string; dict: Dictionary; services: Service[] }) {
  const primary = services.filter((s) => s.tier === 'primary');
  return (
    <TraceSection id="services" title={dict.nav.services} link={{ href: `/${locale}/services`, label: dict.services.all }}>
      <ul className="grid gap-x-12 border-t border-line md:grid-cols-2">
        {primary.map((s) => (
          <li key={s.slug} className="border-b border-line">
            <Link href={`/${locale}/services/${s.slug}`} className="block py-4 text-[1.05rem] text-bone-2 transition-colors duration-300 hover:text-bone">
              <h3 className="font-[450]">{s.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </TraceSection>
  );
}
