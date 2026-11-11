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
import { ContactCta } from '@/components/site/ContactCta';
import { OwnershipBadge, projectKind } from '@/components/site/WorkSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleNode, breadcrumbNode, graph, pageMetadata } from '@/lib/seo';

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
  const { caseStudy } = getDictionary(locale);
  // Long titles drop the "Case study" label so the tag stays readable in search results.
  const full = `${project.title}: ${caseStudy.kind} | ${by}`;
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: full.length > 66 ? `${project.title} | ${by}` : full,
    description: project.description,
    keywords: project.techStack.slice(0, 8),
    image: `/work/${slug}`,
  });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

const section = 'gutter mx-auto max-w-page border-t border-line py-20 md:py-28';

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const projects = getProjects(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { caseStudy: copy } = dict;
  const study = project.caseStudy;
  const order = [...SELECTED_SLUGS, ...projects.map((p) => p.slug).filter((s) => !SELECTED_SLUGS.includes(s))].filter((s) =>
    projects.some((p) => p.slug === s)
  );
  const nextSlug = order[(order.indexOf(slug) + 1) % order.length];
  const next = projects.find((p) => p.slug === nextSlug)!;

  const meta = [
    { label: copy.role, value: project.role },
    { label: copy.type, value: copy.typeValue[projectKind(project)].replace('{company}', project.company ?? '') },
    { label: copy.period, value: formatPeriod(project.startDate, project.endDate, locale, dict.experience.present) },
    { label: copy.status, value: project.status },
  ].filter((m) => m.value);

  const featured = SELECTED_SLUGS.includes(slug);
  const related = getServices(locale).find((s) => s.slug === serviceForProject(slug))!;
  const crumbs = breadcrumbNode([
    { name: dict.crumbs.home, path: `/${locale}` },
    { name: dict.workPage.eyebrow, path: `/${locale}/work` },
    { name: project.title, path: `/${locale}/work/${slug}` },
  ]);
  // Only the long write-ups are marked up as articles; short project pages are not.
  const jsonLd = study
    ? graph(
        articleNode({
          type: 'Article',
          locale,
          path: `/work/${slug}`,
          headline: project.title,
          description: project.description,
          keywords: project.tags,
          image: `/work/${slug}`,
        }),
        crumbs
      )
    : graph(crumbs);

  return (
    <>
      <Header locale={locale} dict={dict} path={`/work/${slug}`} />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-16 pt-36 md:pb-24 md:pt-44">
          <Link
            href={featured ? `/${locale}/work` : `/${locale}/about#experience`}
            className="eyebrow link-underline hero-fade -my-3 inline-block py-3 text-bone"
            style={i(0)}
          >
            <span aria-hidden="true">←</span> {featured ? copy.back : copy.backHistory}
          </Link>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-2.5 md:mt-12" style={i(0)}>
            <OwnershipBadge dict={dict} project={project} />
            {project.evidence === 'production' ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.72rem] text-bone-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                {copy.evidence.production}
              </span>
            ) : null}
          </div>
          <h1 className={`mt-5 ${study ? 'display-xl max-w-[22ch]' : 'display-hero'}`}>
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
          <CardArt slug={project.slug} className={`rounded-[1.25rem] border border-line ${study ? 'h-[30vh] min-h-[13rem] md:h-[42vh]' : 'h-[42vh] min-h-[16rem] md:h-[60vh]'}`} />
        </div>

        {project.longDescription ? (
          <section className="gutter mx-auto max-w-page py-20 md:py-28">
            <p className="max-w-5xl font-display text-[clamp(1.4rem,2.5vw,2.3rem)] leading-[1.28] tracking-[-0.015em]" data-reveal>
              {project.longDescription}
            </p>
          </section>
        ) : (
          <div className="py-12" />
        )}

        {study ? (
          <>
            <section className={section}>
              <div className="grid gap-10 lg:grid-cols-12">
                <h2 className="eyebrow lg:col-span-3">{copy.problem}</h2>
                <p className="max-w-3xl text-lg leading-relaxed text-bone md:text-xl lg:col-span-9" data-reveal>
                  {study.problem}
                </p>
              </div>
            </section>

            <section className={section}>
              <div className="grid gap-10 lg:grid-cols-12">
                <h2 className="eyebrow lg:col-span-3">{copy.complexity}</h2>
                <ul className="max-w-3xl space-y-4 text-bone-2 lg:col-span-9">
                  {study.complexity.map((c) => (
                    <li key={c} className="flex gap-4 leading-relaxed md:text-lg" data-reveal>
                      <span className="mt-[0.8em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={section}>
              <div className="grid gap-10 lg:grid-cols-12">
                <h2 className="eyebrow lg:col-span-3">{copy.architecture}</h2>
                <div className="lg:col-span-9" data-reveal>
                  <p className="max-w-3xl leading-relaxed text-bone md:text-lg">{study.architecture}</p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <li key={t} className="chip text-[0.78rem]">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        ) : null}

        {project.responsibilities?.length ? (
          <section className={section}>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h2 className="eyebrow">{copy.built}</h2>
                {study && project.role ? <p className="mt-3 text-sm leading-relaxed text-bone-2">{project.role}</p> : null}
              </div>
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

        {study ? (
          <section className={section}>
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.decisions}</h2>
              <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
                {study.decisions.map((d) => (
                  <li key={d.title} className="border-t border-line py-6" data-reveal>
                    <h3 className="font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-tight tracking-[-0.01em]">{d.title}</h3>
                    <p className="mt-3 leading-relaxed text-bone-2">{d.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {project.highlights.length ? (
          <section className={section}>
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

        {study ? (
          <section className={section}>
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.outcomes}</h2>
              <ul className="max-w-3xl lg:col-span-9">
                {study.outcomes.map((o) => (
                  <li key={o} className="flex gap-4 border-b border-line py-5 leading-relaxed text-bone first:pt-0 md:text-lg" data-reveal>
                    <span className="mt-[0.15em] font-mono text-sm text-signal" aria-hidden="true">
                      ✓
                    </span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {project.metrics?.length ? (
          <section className={section}>
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="eyebrow lg:col-span-3">{copy.numbers}</h2>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-9">
                {project.metrics.map((m) => (
                  <li key={m} className="border-b border-line py-5 font-display text-[clamp(1.3rem,2vw,1.85rem)] leading-tight tracking-[-0.015em]" data-reveal>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {study ? (
          <section className="gutter mx-auto max-w-page pb-20 md:pb-28">
            <div className="rounded-[1.25rem] border border-signal/40 bg-signal/[0.04] p-7 md:p-10" data-reveal>
              <h2 className="eyebrow text-signal">{copy.demonstrates}</h2>
              <p className="mt-5 max-w-4xl font-display text-[clamp(1.3rem,2.1vw,1.9rem)] leading-[1.3] tracking-[-0.01em]">{study.demonstrates}</p>
            </div>
          </section>
        ) : (
          <section className={section}>
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
        )}

        <section className="gutter mx-auto max-w-page border-t border-line py-16 md:py-20">
          <Link
            href={`/${locale}/services/${related.slug}`}
            data-track="case_study_to_service"
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

        {study ? (
          <ContactCta
            title={dict.servicesPage.ctaTitle}
            body={dict.servicesPage.ctaBody}
            button={copy.cta}
            need="build"
            orEmail={dict.form.orEmail}
            subject={`${dict.servicesPage.emailSubject}: ${project.title}`}
          />
        ) : null}

        <section className="border-t border-line">
          <Link href={`/${locale}/work/${next.slug}`} className="gutter group mx-auto block max-w-page py-20 md:py-28">
            <span className="eyebrow">{copy.next}</span>
            <span className="display-lg mt-6 block max-w-[26ch] transition-colors duration-500 group-hover:text-signal">
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
