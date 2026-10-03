import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { formatPeriod } from '@/lib/format';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactCta } from '@/components/site/ContactCta';
import { MethodSection } from '@/components/site/MethodSection';
import { ToolboxSection } from '@/components/site/ToolboxSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbNode, graph, pageMetadata, personNode, profilePageNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { hire } = getDictionary(locale);
  return pageMetadata({ locale, path: '/hire', title: hire.metaTitle, description: hire.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function HirePage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.hire;
  const experience = getExperience(locale).filter((e) => e.type !== 'internship');

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    profilePageNode(locale, '/hire'),
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/hire` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/hire" />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <p className="eyebrow hero-fade" style={i(0)}>
            {copy.eyebrow}
          </p>
          <h1 className="display-hero mt-8">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {copy.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-8 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-2xl" style={i(1)}>
            {copy.intro}
          </p>
          <p className="hero-fade eyebrow mt-8 flex items-center gap-2.5 text-bone" style={i(2)}>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            {copy.terms}
          </p>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.bringLabel}</h2>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
              {copy.bring.map((b) => (
                <li key={b.title} className="border-t border-line py-6" data-reveal>
                  <h3 className="font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight tracking-[-0.015em]">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-bone-2">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.rolesLabel}</h2>
            <ul className="flex flex-wrap gap-3 lg:col-span-9" data-reveal>
              {copy.roles.map((r) => (
                <li key={r} className="rounded-full border border-line px-5 py-2.5 text-bone">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.experienceLabel}</h2>
            <ul className="lg:col-span-9">
              {experience.map((e) => (
                <li key={e.id} className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5" data-reveal>
                  <span className="col-span-12 font-mono text-xs text-bone-3 md:col-span-3">
                    {formatPeriod(e.startDate, e.endDate, locale, dict.experience.present)}
                  </span>
                  <span className="col-span-12 font-display text-xl md:col-span-4 md:text-2xl">{e.company}</span>
                  <span className="col-span-12 text-bone-2 md:col-span-5">
                    {e.position}
                    {e.type ? <span className="text-bone-3"> · {dict.experience.types[e.type]}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
            <p className="lg:col-span-9 lg:col-start-4">
              <Link href={`/${locale}#experience`} className="eyebrow link-underline inline-block py-3 text-bone">
                {dict.nav.experience} <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </section>

        <MethodSection dict={dict} />
        <ToolboxSection dict={dict} />

        <ContactCta title={copy.ctaTitle} button={copy.ctaButton} topic="job" orEmail={dict.form.orEmail} subject={copy.emailSubject} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
