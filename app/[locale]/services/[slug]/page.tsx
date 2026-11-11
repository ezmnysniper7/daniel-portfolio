import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { getServices, serviceSlugs } from '@/data/services';
import { getProjects } from '@/data/projects';
import { formatNoteDate, getNotes } from '@/data/notes';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactCta } from '@/components/site/ContactCta';
import { EngagementSection } from '@/components/site/EngagementSection';
import { ServiceIcon } from '@/components/site/Icons';
import { OwnershipBadge } from '@/components/site/WorkSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbNode, faqNode, graph, pageMetadata, personNode, serviceNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServices(locale).find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.metaTitle,
    description: service.metaDescription,
    image: `/services/${slug}`,
  });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function ServicePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const copy = dict.servicesPage;
  const services = getServices(locale);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const projects = getProjects(locale);
  const notes = getNotes(locale).filter((n) => n.service === slug);
  const primary = service.tier === 'primary';

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    serviceNode(locale, slug),
    faqNode(service.faqs),
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/services` },
      { name: service.title, path: `/${locale}/services/${slug}` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path={`/services/${slug}`} />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <nav aria-label="Breadcrumb" className="eyebrow hero-fade flex flex-wrap gap-2" style={i(0)}>
            <Link href={`/${locale}`} className="link-underline -my-3 inline-block py-3 hover:text-bone">
              {dict.crumbs.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/services`} className="link-underline -my-3 inline-block py-3 hover:text-bone">
              {copy.eyebrow}
            </Link>
          </nav>
          <span className="hero-fade mt-10 flex h-14 w-14 items-center justify-center rounded-full border border-line text-signal md:mt-12" style={i(0)}>
            <ServiceIcon slug={slug} className="h-7 w-7" />
          </span>
          <h1 className="display-xl mt-6 max-w-[20ch]">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {service.headline ?? service.title}
              </span>
            </span>
          </h1>
          {service.audience ? (
            <p className="hero-fade eyebrow mt-7 flex items-center gap-2.5 text-bone" style={i(1)}>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
              {service.audience}
            </p>
          ) : null}
          <p className="hero-fade mt-7 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-2xl" style={i(1)}>
            {service.intro}
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={i(2)}>
            <a
              href="#contact"
              data-contact-need={slug === 'fintech-technical-partner' ? 'lead' : 'build'}
              data-track="cta_service_contact"
              data-magnetic
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-signal"
            >
              {copy.ctaButton}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <a href="#proof" className="link-underline eyebrow py-3 text-bone">
              {copy.proofLabel} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{service.offeringsLabel ?? copy.offeringsLabel}</h2>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
              {service.offerings.map((o) => (
                <li key={o.title} className="border-t border-line py-6" data-reveal>
                  <h3 className="font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight tracking-[-0.015em]">{o.title}</h3>
                  <p className="mt-3 leading-relaxed text-bone-2">{o.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {service.capability ? (
          // Kept visibly apart from the list above: this is work proposed, not work delivered.
          <section className="gutter mx-auto max-w-page pb-20 md:pb-28">
            <div className="rounded-[1.25rem] border border-dashed border-signal/40 bg-signal/[0.03] p-7 md:p-10" data-reveal>
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow text-signal">{copy.capabilityLabel}</p>
                  <h2 className="display-lg mt-4">{service.capability.title}</h2>
                  <p className="mt-4 inline-flex rounded-full border border-dashed border-signal/60 px-3 py-1.5 font-mono text-[0.72rem] text-signal">
                    {copy.capabilityNote}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className="max-w-3xl text-lg leading-relaxed text-bone">{service.capability.intro}</p>
                  <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                    {service.capability.items.map((item) => (
                      <li key={item.title} className="border-t border-line py-5">
                        <h3 className="font-display text-xl leading-tight">{item.title}</h3>
                        <p className="mt-2 leading-relaxed text-bone-2">{item.body}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-line pt-5 leading-relaxed text-bone-2">
                    <span className="mr-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone-3">{copy.caveatLabel}</span>
                    {service.capability.caveat}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section id="proof" className="gutter mx-auto max-w-page scroll-mt-24 border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.proofLabel}</h2>
            <ul className="lg:col-span-9">
              {service.proof.map((p) => {
                const project = p.slug ? projects.find((x) => x.slug === p.slug) : undefined;
                const body = (
                  <>
                    <span className="col-span-12 flex flex-col items-start gap-2 md:col-span-4">
                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-bone-3">{project ? project.title : p.label}</span>
                      {project ? <OwnershipBadge dict={dict} project={project} /> : null}
                    </span>
                    <span className="col-span-11 leading-relaxed md:col-span-7 md:text-lg">{p.text}</span>
                    <span className="col-span-1 justify-self-end" aria-hidden="true">
                      {project ? '→' : ''}
                    </span>
                  </>
                );
                const row = 'grid grid-cols-12 items-baseline gap-4 border-b border-line py-6';
                return (
                  <li key={p.text} data-reveal>
                    {project ? (
                      <Link href={`/${locale}/work/${project.slug}`} className={`group ${row} transition-colors hover:text-signal`}>
                        {body}
                      </Link>
                    ) : (
                      <div className={row}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {primary ? <EngagementSection dict={dict} /> : null}

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.processLabel}</h2>
            <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
              {copy.process.map((p, n) => (
                <li key={p.title} className="border-t border-line py-6" data-reveal>
                  <span className="font-mono text-xs text-signal">0{n + 1}</span>
                  <h3 className="mt-3 font-display text-[clamp(1.3rem,2vw,1.8rem)] leading-tight">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-bone-2">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {notes.length ? (
          <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.notesLabel}</h2>
              <ul className="border-t border-line lg:col-span-9">
                {notes.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/${locale}/notes/${n.slug}`}
                      className="group flex flex-col gap-x-4 gap-y-1 border-b border-line py-4 transition-colors hover:text-signal sm:flex-row sm:items-baseline"
                    >
                      <span className="w-24 shrink-0 font-mono text-[0.75rem] text-bone-3">{formatNoteDate(n.date, locale)}</span>
                      <span className="flex-1 md:text-lg">{n.title}</span>
                      <span className="font-mono text-[0.72rem] text-bone-3">{dict.notes.basis[n.basis]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.faqLabel}</h2>
            <dl className="lg:col-span-9">
              {service.faqs.map((f) => (
                <div key={f.q} className="border-b border-line py-6 first:pt-0" data-reveal>
                  <dt className="text-lg text-bone md:text-xl">{f.q}</dt>
                  <dd className="mt-3 max-w-3xl leading-relaxed text-bone-2">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ContactCta
          title={copy.ctaTitle}
          body={copy.ctaBody}
          button={copy.ctaButton}
          need={slug === 'fintech-technical-partner' ? 'lead' : 'build'}
          orEmail={dict.form.orEmail}
          subject={`${copy.emailSubject}: ${service.title}`}
        />

        <section className="gutter mx-auto max-w-page border-t border-line py-16 md:py-20">
          <h2 className="eyebrow">{copy.otherServices}</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {services
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${locale}/services/${s.slug}`}
                    className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-bone-3 hover:text-signal"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
