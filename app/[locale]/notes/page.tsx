import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/data/dictionary';
import { formatNoteDate, getNotes } from '@/data/notes';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { absolute, breadcrumbNode, graph, pageMetadata, personNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { notes } = getDictionary(locale);
  return pageMetadata({ locale, path: '/notes', title: notes.metaTitle, description: notes.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function NotesPage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.notes;
  const notes = getNotes(locale);

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    {
      '@type': 'Blog',
      name: copy.metaTitle,
      url: absolute(`/${locale}/notes`),
      inLanguage: locale,
      author: { '@id': absolute('/#person') },
      blogPost: notes.map((n) => ({ '@type': 'BlogPosting', headline: n.title, url: absolute(`/${locale}/notes/${n.slug}`), datePublished: n.date })),
    },
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.label, path: `/${locale}/notes` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/notes" />
      <main id="top">
        <section className="gutter mx-auto max-w-page pb-12 pt-36 md:pt-44">
          <p className="eyebrow hero-fade" style={i(0)}>
            {copy.label}
          </p>
          <h1 className="display-hero mt-8">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {copy.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-6 max-w-2xl text-lg leading-relaxed text-bone-2" style={i(1)}>
            {copy.intro}
          </p>
        </section>

        <section className="gutter mx-auto max-w-page pb-24 md:pb-32">
          <ul className="border-t border-line">
            {notes.map((n) => (
              <li key={n.slug} data-reveal>
                <Link href={`/${locale}/notes/${n.slug}`} className="group grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8">
                  <span className="font-mono text-[0.75rem] text-bone-3 md:col-span-2">
                    {formatNoteDate(n.date, locale)}
                    <span className="block">{copy.minutes.replace('{n}', String(n.minutes))}</span>
                  </span>
                  <span className="md:col-span-10">
                    <span className="block font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-snug tracking-[-0.015em] transition-colors group-hover:text-signal">
                      {n.title}
                    </span>
                    <span className="mt-2 block max-w-3xl leading-relaxed text-bone-2">{n.description}</span>
                  </span>
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
