import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { SkillsOverview } from '@/components/home/SkillsOverview';
import { siteMetadata } from '@/data/metadata';
import { getProjects } from '@/data/projects';
import { skills } from '@/data/skills';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = getProjects(locale);

  return (
    <>
      <Hero
        name={siteMetadata.name}
        title={siteMetadata.title}
        tagline={siteMetadata.tagline}
        availableForWork={siteMetadata.availableForWork ?? false}
      />
      <FeaturedProjects projects={projects} />
      <SkillsOverview skills={skills} />
    </>
  );
}
