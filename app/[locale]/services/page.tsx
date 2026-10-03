import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/data/dictionary';
import { getServices } from '@/data/services';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactCta } from '@/components/site/ContactCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbNode, faqNode, graph, pageMetadata, personNode, serviceNode, websiteNode, absolute } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { servicesPage: copy } = getDictionary(locale);
  return pageMetadata({ locale, path: '/services', title: copy.metaTitle, description: copy.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function ServicesPage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.servicesPage;
  const services = getServices(locale);

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    {
      '@type': 'ItemList',
      name: copy.title,
      url: absolute(`/${locale}/services`),
      itemListElement: services.map((s, n) => ({ '@type': 'ListItem', position: n + 1, item: serviceNode(locale, s.slug) })),
    },
    faqNode(copy.faqs),
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/services` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/services" />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <p className="eyebrow hero-fade" style={i(0)}>
            {copy.eyebrow}
          </p>
          <h1 className="display-xl mt-8 max-w-[22ch]">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {copy.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-8 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-xl" style={i(1)}>
            {copy.intro}
          </p>
        </section>

        <section className="gutter mx-auto max-w-page pb-20 md:pb-28">
          <h2 className="eyebrow">{copy.listLabel}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {services.map((s, n) => (
              <li key={s.slug} data-reveal>
                <Link
                  href={`/${locale}/services/${s.slug}`}
                  data-cursor="view"
                  className="group flex h-full flex-col rounded-[1.25rem] border border-line bg-ink-2/60 p-7 transition-colors duration-500 hover:border-bone-3 md:p-9"
                >
                  <span className="font-mono text-xs text-signal">0{n + 1}</span>
                  <h3 className="display-lg mt-5 transition-colors duration-500 group-hover:text-signal">{s.title}</h3>
                  <p className="mt-4 leading-relaxed text-bone-2">{s.short}</p>
                  <span className="eyebrow mt-auto pt-8 text-bone">
                    {dict.services.more} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
            <li data-reveal>
              <Link
                href={`/${locale}/hire`}
                className="group flex h-full flex-col rounded-[1.25rem] border border-dashed border-line p-7 transition-colors duration-500 hover:border-bone-3 md:p-9"
              >
                <span className="font-mono text-xs text-bone-3">+</span>
                <h3 className="display-lg mt-5 transition-colors duration-500 group-hover:text-signal">{dict.services.hireTitle}</h3>
                <p className="mt-4 leading-relaxed text-bone-2">{dict.services.hireBody}</p>
                <span className="eyebrow mt-auto pt-8 text-bone">
                  {dict.nav.hire} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.processLabel}</h2>
            <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
              {copy.process.map((p, n) => (
                <li key={p.title} className="border-t border-line py-6" data-reveal>
                  <span className="font-mono text-xs text-signal">0{n + 1}</span>
                  <h3 className="mt-3 font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight tracking-[-0.015em]">{p.title}</h3>
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
              {copy.faqs.map((f) => (
                <div key={f.q} className="border-b border-line py-6 first:pt-0" data-reveal>
                  <dt className="text-lg text-bone md:text-xl">{f.q}</dt>
                  <dd className="mt-3 max-w-3xl leading-relaxed text-bone-2">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ContactCta title={copy.ctaTitle} body={copy.ctaBody} button={copy.ctaButton} subject={copy.emailSubject} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
