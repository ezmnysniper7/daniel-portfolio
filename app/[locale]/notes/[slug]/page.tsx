import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/data/dictionary';
import { formatNoteDate, getNoteSlugs, getNotes, noteLocales, noteSeoTitles } from '@/data/notes';
import { getServices } from '@/data/services';
import { siteMetadata } from '@/data/metadata';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ServiceIcon } from '@/components/site/Icons';
import { NoteBody } from '@/components/notes/NoteBody';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleNode, breadcrumbNode, graph, pageMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getNoteSlugs(locale).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = getNotes(locale).find((n) => n.slug === slug);
  if (!note) return {};
  const by = locale === 'zh-CN' ? '曾祈荣 Daniel Chen' : 'Daniel Chen';
  const meta = pageMetadata({
    locale,
    path: `/notes/${slug}`,
    title: `${(locale === 'en' && noteSeoTitles[slug]) || note.title} | ${by}`,
    description: note.description,
    keywords: note.tags,
    image: `/notes/${slug}`,
    available: noteLocales(slug),
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: note.date,
      modifiedTime: note.updated ?? note.date,
      authors: [siteMetadata.name],
      tags: note.tags,
    },
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
  // Same topic first, then the newest of the rest.
  const others = [...notes.filter((n) => n.slug !== slug && n.service === note.service), ...notes.filter((n) => n.slug !== slug && n.service !== note.service)].slice(0, 4);

  const jsonLd = graph(
    articleNode({
      // Long pieces with code are technical articles; the short ones stay blog posts.
      type: note.body.some((b) => 'code' in b) ? 'TechArticle' : 'BlogPosting',
      locale,
      path: `/notes/${slug}`,
      headline: note.title,
      description: note.description,
      published: note.date,
      modified: note.updated,
      keywords: note.tags,
      image: `/notes/${slug}`,
    }),
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.label, path: `/${locale}/notes` },
      { name: note.title, path: `/${locale}/notes/${slug}` },
    ])
  );

  return (
    <>
      {/* A note without a version in the other language switches to that language's notes index. */}
      <Header locale={locale} dict={dict} path={noteLocales(slug).length > 1 ? `/notes/${slug}` : '/notes'} />
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
          <p
            className={`hero-fade mt-10 inline-flex rounded-full border px-3 py-1.5 font-mono text-[0.72rem] ${
              note.basis === 'design' ? 'border-dashed border-signal/60 text-signal' : 'border-line text-bone-2'
            }`}
            style={i(0)}
          >
            {copy.basis[note.basis]}
          </p>
          <h1 className="hero-fade mt-5 max-w-4xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.025em]" style={i(1)}>
            {note.title}
          </h1>
          <p className="hero-fade mt-6 font-mono text-[0.75rem] text-bone-3" style={i(2)}>
            <Link href={`/${locale}/about`} className="hover:text-bone">
              {copy.by}
            </Link>{' '}
            · <time dateTime={note.date}>{formatNoteDate(note.date, locale)}</time>
            {note.updated ? (
              <>
                {' '}
                · {copy.updated} <time dateTime={note.updated}>{formatNoteDate(note.updated, locale)}</time>
              </>
            ) : null}{' '}
            · {copy.minutes.replace('{n}', String(note.minutes))}
          </p>

          <NoteBody blocks={note.body} locale={locale} />

          <ul className="mt-12 flex flex-wrap gap-2">
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
              data-track="note_to_service"
              className="group flex flex-col gap-4 rounded-[1.25rem] border border-line bg-ink-2/60 p-7 transition-colors duration-500 hover:border-bone-3 md:flex-row md:items-center md:justify-between md:p-9"
            >
              <span className="flex items-center gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-bone transition-colors group-hover:border-signal group-hover:text-signal">
                  <ServiceIcon slug={service.slug} className="h-5 w-5" />
                </span>
                <span>
                  <span className="eyebrow block">{copy.related}</span>
                  <span className="mt-1 block font-display text-[clamp(1.3rem,2vw,1.8rem)] transition-colors group-hover:text-signal">{service.title}</span>
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
                <Link
                  href={`/${locale}/notes/${n.slug}`}
                  className="group flex flex-col gap-x-4 gap-y-1 border-b border-line py-4 transition-colors hover:text-signal sm:flex-row sm:items-baseline"
                >
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
