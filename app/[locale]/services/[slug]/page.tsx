import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { getServices, serviceSlugs } from '@/data/services';
import { getProjects } from '@/data/projects';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactCta } from '@/components/site/ContactCta';
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
          <h1 className="display-hero mt-10 md:mt-14">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {service.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-8 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-2xl" style={i(1)}>
            {service.intro}
          </p>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.offeringsLabel}</h2>
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

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.proofLabel}</h2>
            <ul className="lg:col-span-9">
              {service.proof.map((p) => {
                const project = p.slug ? projects.find((x) => x.slug === p.slug) : undefined;
                const href = project ? `/${locale}/work/${project.slug}` : p.anchor ? `/${locale}#${p.anchor}` : `/${locale}`;
                return (
                  <li key={p.text} data-reveal>
                    <Link
                      href={href}
                      className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-6 transition-colors hover:text-signal"
                    >
                      <span className="col-span-12 font-mono text-xs uppercase tracking-[0.12em] text-bone-3 md:col-span-3">
                        {project ? project.title : p.anchor === 'now' ? 'CFI Financial' : 'danielchen.tech'}
                      </span>
                      <span className="col-span-11 leading-relaxed md:col-span-8 md:text-lg">{p.text}</span>
                      <span className="col-span-1 justify-self-end" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

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

        <ContactCta title={copy.ctaTitle} body={copy.ctaBody} button={copy.ctaButton} topic="project" orEmail={dict.form.orEmail} subject={`${copy.emailSubject}: ${service.title}`} />

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
