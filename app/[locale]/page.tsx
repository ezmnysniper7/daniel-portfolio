import type { Metadata } from 'next';
import { getDictionary } from '@/data/dictionary';
import { getSelectedProjects } from '@/data/projects';
import { getServices } from '@/data/services';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { WorkSection } from '@/components/site/WorkSection';
import { ServicesSection } from '@/components/site/ServicesSection';
import { Footer } from '@/components/site/Footer';
import { NotesSection } from '@/components/site/NotesSection';
import { ContactInvite } from '@/components/site/ContactCta';
import { Trace } from '@/components/site/Trace';
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

  // Short on purpose: who I am, proof, what I build, writing, contact. Engagement models are on the services pages; work history is on /about.
  return (
    <>
      <Header locale={locale} dict={dict} path="" />
      <main>
        <Hero dict={dict} />
        <Trace>
          <WorkSection locale={locale} dict={dict} projects={getSelectedProjects(locale).slice(0, 3)} />
          <ServicesSection locale={locale} dict={dict} services={services} />
          <NotesSection locale={locale} dict={dict} notes={getNotes(locale).slice(0, 4)} />
          <ContactInvite locale={locale} label={dict.nav.contact} title={dict.footer.lines.join(' ')} body={dict.footer.invite} button={dict.nav.cta} />
        </Trace>
      </main>
      <Footer dict={dict} locale={locale} form={false} />
      <JsonLd data={jsonLd} />
    </>
  );
}
