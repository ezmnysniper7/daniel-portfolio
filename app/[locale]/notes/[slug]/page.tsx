import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { formatNoteDate, getNotes, noteSlugs } from '@/data/notes';
import { getServices } from '@/data/services';
import { siteMetadata } from '@/data/metadata';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ServiceIcon } from '@/components/site/Icons';
import { JsonLd } from '@/components/seo/JsonLd';
import { absolute, breadcrumbNode, graph, pageMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => noteSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = getNotes(locale).find((n) => n.slug === slug);
  if (!note) return {};
  const by = locale === 'zh-CN' ? '曾祈荣 Daniel Chen' : 'Daniel Chen';
  const meta = pageMetadata({
    locale,
    path: `/notes/${slug}`,
    title: `${note.title} | ${by}`,
    description: note.description,
    keywords: note.tags,
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: 'article', publishedTime: note.date, authors: [siteMetadata.name], tags: note.tags },
  };
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function NotePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const copy = dict.notes;
  const notes = getNotes(locale);
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();
  const service = getServices(locale).find((s) => s.slug === note.service);
  const others = notes.filter((n) => n.slug !== slug).slice(0, 3);
  const url = absolute(`/${locale}/notes/${slug}`);

  const jsonLd = graph(
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: note.title,
      description: note.description,
      url,
      mainEntityOfPage: url,
      datePublished: note.date,
      dateModified: note.date,
      inLanguage: locale,
      keywords: note.tags.join(', '),
      image: absolute(`/${locale}/opengraph-image`),
      author: { '@type': 'Person', '@id': absolute('/#person'), name: siteMetadata.name, url: absolute(`/${locale}`) },
      publisher: { '@type': 'Person', '@id': absolute('/#person'), name: siteMetadata.name },
    },
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.label, path: `/${locale}/notes` },
      { name: note.title, path: `/${locale}/notes/${slug}` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path={`/notes/${slug}`} />
      <main id="top">
        <article className="gutter mx-auto max-w-page pb-16 pt-36 md:pt-44">
          <nav aria-label="Breadcrumb" className="eyebrow hero-fade flex flex-wrap gap-2" style={i(0)}>
            <Link href={`/${locale}`} className="link-underline -my-3 inline-block py-3 hover:text-bone">
              {dict.crumbs.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/notes`} className="link-underline -my-3 inline-block py-3 hover:text-bone">
              {copy.label}
            </Link>
          </nav>
          <h1 className="hero-fade mt-10 max-w-4xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.025em]" style={i(1)}>
            {note.title}
          </h1>
          <p className="hero-fade mt-6 font-mono text-[0.75rem] text-bone-3" style={i(2)}>
            {copy.by} · <time dateTime={note.date}>{formatNoteDate(note.date, locale)}</time> · {copy.minutes.replace('{n}', String(note.minutes))}
          </p>

          <div className="mt-12 max-w-[68ch] text-[1.075rem] leading-[1.8] text-bone-2">
            {note.body.map((block, n) => {
              if ('h2' in block)
                return (
                  <h2 key={n} className="mt-12 font-display text-[clamp(1.35rem,2vw,1.75rem)] leading-snug text-bone">
                    {block.h2}
                  </h2>
                );
              if ('list' in block)
                return (
                  <ul key={n} className="mt-5 space-y-3">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-4">
                        <span className="mt-[0.85em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={n} className="mt-5 first:mt-0">
                  {block.p}
                </p>
              );
            })}
          </div>

          <ul className="mt-10 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </article>

        {service ? (
          <section className="gutter mx-auto max-w-page pb-16">
            <Link
              href={`/${locale}/services/${service.slug}`}
              className="group flex flex-col gap-4 rounded-[1.25rem] border border-line bg-ink-2/60 p-7 transition-colors duration-500 hover:border-bone-3 md:flex-row md:items-center md:justify-between md:p-9"
            >
              <span className="flex items-center gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-bone transition-colors group-hover:border-signal group-hover:text-signal">
                  <ServiceIcon slug={service.slug} className="h-5 w-5" />
                </span>
                <span>
                  <span className="eyebrow block">{copy.related}</span>
                  <span className="mt-1 block font-display text-[clamp(1.3rem,2vw,1.8rem)] transition-colors group-hover:text-signal">
                    {service.title}
                  </span>
                </span>
              </span>
              <span className="text-sm text-bone">
                {dict.services.more} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </section>
        ) : null}

        <section className="gutter mx-auto max-w-page border-t border-line py-16 md:py-20">
          <h2 className="eyebrow">{copy.more}</h2>
          <ul className="mt-6">
            {others.map((n) => (
              <li key={n.slug}>
                <Link href={`/${locale}/notes/${n.slug}`} className="group flex items-baseline gap-4 border-b border-line py-4 transition-colors hover:text-signal">
                  <span className="w-24 shrink-0 font-mono text-[0.75rem] text-bone-3">{formatNoteDate(n.date, locale)}</span>
                  <span className="flex-1">{n.title}</span>
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
