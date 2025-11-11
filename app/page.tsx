import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { SkillsOverview } from '@/components/home/SkillsOverview';
import { siteMetadata } from '@/data/metadata';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';

export default function Home() {
  return (
    <>
      <Hero
        name={siteMetadata.name}
        title={siteMetadata.title}
        tagline={siteMetadata.tagline}
      />
      <FeaturedProjects projects={projects} />
      <SkillsOverview skills={skills} />
    </>
  );
}
