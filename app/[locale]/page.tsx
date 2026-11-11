import type { Metadata } from 'next';
import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { getSelectedProjects } from '@/data/projects';
import { getServices } from '@/data/services';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { NowSection } from '@/components/site/NowSection';
import { WorkSection } from '@/components/site/WorkSection';
import { ServicesSection } from '@/components/site/ServicesSection';
import { EngagementSection } from '@/components/site/EngagementSection';
import { StatsSection } from '@/components/site/StatsSection';
import { ExperienceGlance } from '@/components/site/ExperienceGlance';
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
  const experience = getExperience(locale).filter((e) => e.type !== 'internship');

  const jsonLd = graph(
    websiteNode(locale),
    {
      ...personNode(locale),
      makesOffer: services.filter((s) => s.tier === 'primary').map((s) => ({ '@type': 'Offer', itemOffered: serviceNode(locale, s.slug) })),
    },
    profilePageNode(locale, '')
  );

  // Order follows a founder's questions: what do you build, can you prove it, how do we start, where does it come from.
  return (
    <>
      <Header locale={locale} dict={dict} path="" />
      <main>
        <Hero dict={dict} />
        <ServicesSection locale={locale} dict={dict} services={services} />
        <WorkSection locale={locale} dict={dict} projects={getSelectedProjects(locale)} />
        <EngagementSection dict={dict} />
        <NowSection dict={dict} locale={locale} />
        <StatsSection dict={dict} locale={locale} />
        <ExperienceGlance dict={dict} locale={locale} experience={experience} />
        <NotesSection locale={locale} dict={dict} notes={getNotes(locale).slice(0, 7)} />
      </main>
      <Footer dict={dict} locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}
