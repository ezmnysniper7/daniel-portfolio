import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { projects } from '@/data/projects';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <Section>
      <Container size="md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {project.role && <span>Role: {project.role}</span>}
            {project.startDate && (
              <span>
                {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
              </span>
            )}
            {project.category && (
              <span className="capitalize">{project.category}</span>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="secondary" size="sm">
                View on GitHub →
              </Button>
            )}
            {project.demoUrl && (
              <Button href={project.demoUrl} variant="primary" size="sm">
                Live Demo →
              </Button>
            )}
          </div>
        </div>

        {/* Image */}
        {project.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full" />
          </div>
        )}

        {/* Long Description */}
        {project.longDescription && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.longDescription}
            </p>
          </div>
        )}

        {/* Responsibilities */}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What I Built</h2>
            <ul className="space-y-2">
              {project.responsibilities.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Key Achievements</h2>
            <ul className="space-y-2">
              {project.highlights.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="accent">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <Button href="/projects" variant="secondary">
            ← Back to Projects
          </Button>
        </div>
      </Container>
    </Section>
  );
}
