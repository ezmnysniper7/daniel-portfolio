import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { getProjectsForJob } from '@/data/projects';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactCta } from '@/components/site/ContactCta';
import { ExperienceSection } from '@/components/site/ExperienceSection';
import { MethodSection } from '@/components/site/MethodSection';
import { ToolboxSection } from '@/components/site/ToolboxSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbNode, graph, pageMetadata, personNode, profilePageNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { about } = getDictionary(locale);
  return pageMetadata({ locale, path: '/about', title: about.metaTitle, description: about.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.about;
  const experience = getExperience(locale);
  const projectsByJob = Object.fromEntries(experience.map((e) => [e.id, getProjectsForJob(locale, e.id)]));

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    profilePageNode(locale, '/about'),
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/about` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/about" />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <p className="eyebrow hero-fade" style={i(0)}>
            {copy.eyebrow}
          </p>
          <h1 className="display-xl mt-8 max-w-[20ch]">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {copy.title}
              </span>
            </span>
          </h1>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="hero-fade space-y-6 text-lg leading-relaxed text-bone-2 md:text-xl lg:col-span-7" style={i(1)}>
              {copy.intro.map((p, n) => (
                <p key={n} className={n === 0 ? 'text-bone' : ''}>
                  {p}
                </p>
              ))}
            </div>
            <aside className="hero-fade lg:col-span-4 lg:col-start-9" style={i(2)}>
              <h2 className="eyebrow">{copy.factsLabel}</h2>
              <dl className="mt-4 border-t border-line">
                {copy.facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-5 gap-3 border-b border-line py-3.5">
                    <dt className="col-span-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-bone-3">{f.label}</dt>
                    <dd className="col-span-3 text-[0.95rem] leading-snug text-bone">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <MethodSection dict={dict} />
        <ExperienceSection dict={dict} locale={locale} experience={experience} projectsByJob={projectsByJob} />
        <ToolboxSection dict={dict} />

        <section className="gutter mx-auto max-w-page border-t border-line py-16 md:py-20">
          <Link
            href={`/${locale}/hire`}
            className="group grid items-baseline gap-4 rounded-[1.25rem] border border-dashed border-line p-7 transition-colors duration-500 hover:border-bone-3 md:grid-cols-12 md:p-9"
            data-reveal
          >
            <span className="font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight transition-colors duration-500 group-hover:text-signal md:col-span-4">
              {copy.recruitersTitle}
            </span>
            <span className="leading-relaxed text-bone-2 md:col-span-6">{copy.recruitersBody}</span>
            <span className="eyebrow text-bone md:col-span-2 md:justify-self-end">
              {copy.recruitersLink} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </section>

        <ContactCta title={copy.ctaTitle} body={copy.ctaBody} button={copy.ctaButton} need="build" orEmail={dict.form.orEmail} subject={copy.emailSubject} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
