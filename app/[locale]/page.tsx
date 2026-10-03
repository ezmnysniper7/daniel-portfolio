import { getDictionary } from '@/data/dictionary';
import { getExperience } from '@/data/experience';
import { getArchiveProjects, getSelectedProjects } from '@/data/projects';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { NowSection } from '@/components/site/NowSection';
import { WorkSection } from '@/components/site/WorkSection';
import { StatsSection } from '@/components/site/StatsSection';
import { MethodSection } from '@/components/site/MethodSection';
import { ExperienceSection } from '@/components/site/ExperienceSection';
import { Footer } from '@/components/site/Footer';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} path="" home />
      <main>
        <Hero dict={dict} />
        <NowSection dict={dict} />
        <WorkSection
          locale={locale}
          dict={dict}
          projects={getSelectedProjects(locale)}
          archive={getArchiveProjects(locale)}
        />
        <StatsSection dict={dict} locale={locale} />
        <MethodSection dict={dict} />
        <ExperienceSection dict={dict} locale={locale} experience={getExperience(locale)} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
