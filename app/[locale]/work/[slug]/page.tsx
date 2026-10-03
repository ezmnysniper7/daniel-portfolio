import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { allSlugs, getProjects, SELECTED_SLUGS } from '@/data/projects';
import { getServices, serviceForProject } from '@/data/services';
import { formatPeriod } from '@/lib/format';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { CardArt } from '@/components/site/CardArt';
import { OwnershipBadge } from '@/components/site/WorkSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbNode, graph, pageMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjects(locale).find((p) => p.slug === slug);
  if (!project) return {};
  const by = locale === 'zh-CN' ? '曾祈荣 Daniel Chen' : 'Daniel Chen';
  const kind = locale === 'zh-CN' ? '案例' : 'Case study';
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${project.title}: ${kind} | ${by}`,
    description: project.description,
    keywords: project.techStack.slice(0, 8),
  });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const projects = getProjects(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { caseStudy: copy } = dict;
  const order = [...SELECTED_SLUGS, ...projects.map((p) => p.slug).filter((s) => !SELECTED_SLUGS.includes(s))];
  const nextSlug = order[(order.indexOf(slug) + 1) % order.length];
  const next = projects.find((p) => p.slug === nextSlug)!;

  const meta = [
    { label: copy.role, value: project.role },
    { label: copy.type, value: copy.typeValue[project.ownership ?? 'side'].replace('{company}', project.company ?? '') },
    { label: copy.period, value: formatPeriod(project.startDate, project.endDate, locale, dict.experience.present) },
    { label: copy.status, value: project.status },
  ].filter((m) => m.value);

  const featured = SELECTED_SLUGS.includes(slug);
  const related = getServices(locale).find((s) => s.slug === serviceForProject(slug))!;
  const jsonLd = graph(
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: project.title, path: `/${locale}/work/${slug}` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path={`/work/${slug}`} />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <Link
            href={featured ? `/${locale}#work` : `/${locale}#experience`}
            className="eyebrow link-underline hero-fade -my-3 inline-block py-3 text-bone"
            style={i(0)}
          >
            <span aria-hidden="true">←</span> {featured ? copy.back : copy.backHistory}
          </Link>
          <div className="hero-fade mt-10 md:mt-12" style={i(0)}>
            <OwnershipBadge dict={dict} project={project} />
          </div>
          <h1 className="display-hero mt-5">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {project.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-8 max-w-3xl text-lg leading-relaxed text-bone-2 md:text-2xl" style={i(1)}>
            {project.description}
          </p>

          <dl className="hero-fade mt-14 grid gap-x-8 gap-y-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4" style={i(2)}>
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow">{m.label}</dt>
                <dd className="mt-2 leading-snug text-bone">{m.value}</dd>
              </div>
            ))}
          </dl>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="hero-fade mt-10 inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-signal"
              style={i(3)}
            >
              {copy.visit} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </section>

        <div className="gutter mx-auto max-w-page" data-reveal>
          <CardArt slug={project.slug} className="h-[42vh] min-h-[16rem] rounded-[1.25rem] border border-line md:h-[60vh]" />
        </div>

        {project.longDescription ? (
          <section className="gutter mx-auto max-w-page py-24 md:py-32">
            <p className="max-w-5xl font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.25] tracking-[-0.015em]" data-reveal>
              {project.longDescription}
            </p>
          </section>
        ) : (
          <div className="py-12" />
        )}

        {project.responsibilities?.length ? (
          <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.built}</h2>
              <ol className="lg:col-span-9">
                {project.responsibilities.map((r, n) => (
                  <li key={r} className="grid grid-cols-12 gap-4 border-b border-line py-6 first:pt-0" data-reveal>
                    <span className="col-span-2 font-mono text-xs text-signal md:col-span-1">{String(n + 1).padStart(2, '0')}</span>
                    <span className="col-span-10 leading-relaxed text-bone md:col-span-11 md:text-lg">{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {project.highlights.length ? (
          <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.stories}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:col-span-9">
                {project.highlights.map((h) => (
                  <p key={h} className="rounded-[1.25rem] border border-line bg-ink-2/60 p-6 leading-relaxed text-bone-2 md:p-8" data-reveal>
                    {h}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {project.metrics?.length ? (
          <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.numbers}</h2>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-9">
                {project.metrics.map((m) => (
                  <li key={m} className="border-b border-line py-5 font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight tracking-[-0.015em]" data-reveal>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="eyebrow lg:col-span-3">{copy.stack}</h2>
            <ul className="flex flex-wrap gap-2 lg:col-span-9" data-reveal>
              {project.techStack.map((t) => (
                <li key={t} className="chip text-[0.78rem]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="gutter mx-auto max-w-page border-t border-line py-16 md:py-20">
          <Link
            href={`/${locale}/services/${related.slug}`}
            className="group grid items-baseline gap-4 rounded-[1.25rem] border border-line bg-ink-2/60 p-7 transition-colors duration-500 hover:border-bone-3 md:grid-cols-12 md:p-9"
            data-reveal
          >
            <span className="eyebrow md:col-span-3">{copy.related}</span>
            <span className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight transition-colors duration-500 group-hover:text-signal md:col-span-6">
              {related.title}
            </span>
            <span className="eyebrow text-bone md:col-span-3 md:justify-self-end">
              {copy.relatedCta} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </section>

        <section className="border-t border-line">
          <Link
            href={`/${locale}/work/${next.slug}`}
            data-cursor="view"
            className="gutter group mx-auto block max-w-page py-24 md:py-36"
          >
            <span className="eyebrow">{copy.next}</span>
            <span className="display-xl mt-6 block transition-colors duration-500 group-hover:text-signal">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </section>
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
