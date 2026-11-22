import type { Metadata } from 'next';
import { getDictionary } from '@/data/dictionary';
import { getSelectedProjects } from '@/data/projects';
import { getServices } from '@/data/services';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { WorkSection } from '@/components/site/WorkSection';
import { ServicesSection } from '@/components/site/ServicesSection';
import { EngagementSection } from '@/components/site/EngagementSection';
import { Footer } from '@/components/site/Footer';
import { NotesSection } from '@/components/site/NotesSection';
import { getNotes } from '@/data/notes';
import { JsonLd } from '@/components/seo/JsonLd';
import { graph, pageMetadata, personNode, profilePageNode, serviceNode, websiteNode } from '@/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const { meta } = getDictionary(locale);
  return pageMetadata({ locale, path: '', title: meta.title, description: meta.description, keywords: meta.keywords });
}

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const services = getServices(locale);

  const jsonLd = graph(
    websiteNode(locale),
    {
      ...personNode(locale),
      makesOffer: services.filter((s) => s.tier === 'primary').map((s) => ({ '@type': 'Offer', itemOffered: serviceNode(locale, s.slug) })),
    },
    profilePageNode(locale, '')
  );

  // Short on purpose: what I build, proof, how we start, then contact. Work history and the current role are on /about.
  return (
    <>
      <Header locale={locale} dict={dict} path="" />
      <main>
        <Hero dict={dict} />
        <ServicesSection locale={locale} dict={dict} services={services} />
        <WorkSection locale={locale} dict={dict} projects={getSelectedProjects(locale).slice(0, 3)} compact />
        <EngagementSection dict={dict} />
        <NotesSection locale={locale} dict={dict} notes={getNotes(locale).slice(0, 4)} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
