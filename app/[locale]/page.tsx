import type { Metadata } from 'next';
import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { getArchiveProjects, getSelectedProjects } from '@/data/projects';
import { getServices } from '@/data/services';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { NowSection } from '@/components/site/NowSection';
import { WorkSection } from '@/components/site/WorkSection';
import { ServicesSection } from '@/components/site/ServicesSection';
import { StatsSection } from '@/components/site/StatsSection';
import { MethodSection } from '@/components/site/MethodSection';
import { ExperienceSection } from '@/components/site/ExperienceSection';
import { Footer } from '@/components/site/Footer';
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
    { ...personNode(locale), makesOffer: services.map((s) => ({ '@type': 'Offer', itemOffered: serviceNode(locale, s.slug) })) },
    profilePageNode(locale, '')
  );

  return (
    <>
      <Header locale={locale} dict={dict} path="" home />
      <main>
        <Hero dict={dict} locale={locale} />
        <NowSection dict={dict} />
        <WorkSection
          locale={locale}
          dict={dict}
          projects={getSelectedProjects(locale)}
          archive={getArchiveProjects(locale)}
        />
        <ServicesSection locale={locale} dict={dict} services={services} />
        <StatsSection dict={dict} locale={locale} />
        <MethodSection dict={dict} />
        <ExperienceSection dict={dict} locale={locale} experience={getExperience(locale)} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
