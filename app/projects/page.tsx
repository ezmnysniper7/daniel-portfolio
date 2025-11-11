import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my work including payment systems, e-commerce platforms, and enterprise applications.',
};

export default function ProjectsPage() {
  return (
    <Section>
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            A showcase of my work across payment systems, enterprise platforms, and full-stack applications.
            Each project demonstrates my commitment to building scalable, secure, and user-friendly solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
