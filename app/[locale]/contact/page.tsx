import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getDictionary } from '@/data/dictionary';
import { siteMetadata } from '@/data/metadata';
import { Header } from '@/components/site/Header';
import { DirectContact, Footer } from '@/components/site/Footer';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { absolute, breadcrumbNode, graph, pageMetadata, personNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { contactPage: copy } = getDictionary(locale);
  return pageMetadata({ locale, path: '/contact', title: copy.metaTitle, description: copy.metaDescription });
}

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const copy = dict.contactPage;

  const jsonLd = graph(
    websiteNode(locale),
    personNode(locale),
    { '@type': 'ContactPage', url: absolute(`/${locale}/contact`), inLanguage: locale, name: copy.title, mainEntity: { '@id': absolute('/#person') } },
    breadcrumbNode([
      { name: dict.crumbs.home, path: `/${locale}` },
      { name: copy.eyebrow, path: `/${locale}/contact` },
    ])
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="/contact" />
      <main id="top">
        {/* The header button points at #contact on every page; here that is the form itself. */}
        <section id="contact" className="gutter mx-auto max-w-page pb-20 pt-36 md:pb-28 md:pt-44">
          <p className="eyebrow hero-fade" style={i(0)}>
            {copy.eyebrow}
          </p>
          <h1 className="display-xl mt-8 max-w-[18ch]">
            <span className="line-mask">
              <span className="hero-line" style={i(0)}>
                {copy.title}
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-8 max-w-2xl text-lg leading-relaxed text-bone-2 md:text-xl" style={i(1)}>
            {copy.intro}
          </p>

          <div className="hero-fade mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10" style={i(2)}>
            <div className="lg:col-span-7">
              <ContactForm copy={dict.form} locale={locale} email={siteMetadata.email} />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="eyebrow">{copy.nextLabel}</h2>
              <ol className="mt-4 border-t border-line">
                {copy.next.map((step, n) => (
                  <li key={step} className="flex gap-4 border-b border-line py-4 leading-relaxed text-bone-2">
                    <span className="mt-[0.2em] font-mono text-xs text-signal">0{n + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <h2 className="eyebrow mt-12">{copy.directLabel}</h2>
              <div className="mt-4">
                <DirectContact dict={dict} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer dict={dict} locale={locale} form={false} />
      <JsonLd data={jsonLd} />
    </>
  );
}
