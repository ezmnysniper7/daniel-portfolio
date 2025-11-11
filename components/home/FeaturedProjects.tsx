import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  if (featured.length === 0) {
    return null;
  }

  return (
    <Section className="bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/projects" variant="secondary">
            View All Projects
          </Button>
        </div>
      </Container>
    </Section>
  );
}
