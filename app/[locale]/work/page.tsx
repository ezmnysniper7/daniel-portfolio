import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { getProjects, getProjectsForJob, getSelectedProjects, SELECTED_SLUGS } from '@/data/projects';
import { year } from '@/lib/format';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { WorkCard, WorkLegend } from '@/components/site/WorkSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { absolute, breadcrumbNode, graph, pageMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { workPage: copy } = getDictionary(locale);
  return pageMetadata({ locale, path: '/work', title: copy.metaTitle, description: copy.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function WorkPage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.workPage;
  const featured = getSelectedProjects(locale);
  const experience = getExperience(locale);
  // Everything else, grouped under the job it was built in.
  const groups = experience
    .map((e) => ({ job: e, projects: getProjectsForJob(locale, e.id).filter((p) => !SELECTED_SLUGS.includes(p.slug)) }))
    .filter((g) => g.projects.length);

  const jsonLd = graph(
    {
      '@type': 'CollectionPage',
      name: copy.title,
      url: absolute(`/${locale}/work`),
      inLanguage: locale,
      hasPart: getProjects(locale).map((p) => ({ '@type': 'CreativeWork', name: p.title, url: absolute(`/${locale}/work/${p.slug}`) })),
    },
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/work` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/work" />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-12 pt-36 md:pb-16 md:pt-44">
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
          <p className="hero-fade mt-8 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-xl" style={i(1)}>
            {copy.intro}
          </p>
          <WorkLegend dict={dict} className="hero-fade mt-8" />
        </section>

        <section className="gutter mx-auto max-w-page pb-20 md:pb-28">
          <h2 className="eyebrow">{copy.featuredLabel}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, n) => (
              <li key={p.slug} className={n === 0 ? 'md:col-span-2' : ''} data-reveal>
                <WorkCard locale={locale} dict={dict} project={p} wide={n === 0} />
              </li>
            ))}
          </ul>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <h2 className="eyebrow">{copy.allLabel}</h2>
          <div className="mt-8">
            {groups.map(({ job, projects }) => (
              <div key={job.id} className="grid gap-x-10 gap-y-4 border-t border-line py-8 lg:grid-cols-12" data-reveal>
                <div className="lg:col-span-4">
                  <h3 className="font-display text-2xl leading-tight">{job.company}</h3>
                  <p className="mt-1.5 text-sm text-bone-2">
                    {job.position}
                    {job.type ? <span className="text-bone-3"> · {dict.experience.types[job.type]}</span> : null}
                  </p>
                </div>
                <ul className="lg:col-span-8">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/${locale}/work/${p.slug}`}
                        className="group flex items-baseline gap-4 border-b border-line py-3.5 transition-colors first:pt-0 hover:text-signal"
                      >
                        <span className="w-10 shrink-0 font-mono text-xs text-bone-3">{year(p.startDate)}</span>
                        <span className="flex-1">
                          <span className="block">{p.title}</span>
                          <span className="mt-1 line-clamp-1 block text-sm text-bone-3">{p.description}</span>
                        </span>
                        <span aria-hidden="true" className="text-bone-2 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
