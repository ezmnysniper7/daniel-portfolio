import { EngineerHero } from '@/components/engineer/EngineerHero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { SkillsOverview } from '@/components/home/SkillsOverview';
import { siteMetadata } from '@/data/metadata';
import { getProjects } from '@/data/projects';
import { skills } from '@/data/skills';
import { getVisitorCount, isVisitorCounterConfigured } from '@/lib/visitors';

export default async function EngineerHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = getProjects(locale);
  const visitorCounterEnabled = isVisitorCounterConfigured();
  const initialVisitorCount = visitorCounterEnabled ? await getVisitorCount() : 0;

  return (
    <>
      <EngineerHero
        availableForWork={siteMetadata.availableForWork ?? false}
        initialVisitorCount={initialVisitorCount}
        visitorCounterEnabled={visitorCounterEnabled}
      />
      <FeaturedProjects projects={projects} />
      <SkillsOverview skills={skills} />
    </>
  );
}
