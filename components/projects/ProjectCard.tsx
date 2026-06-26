'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Link href={`/${locale}/engineer/projects/${project.slug}`} className="block h-full">
      <Card hover className="group flex h-full flex-col overflow-hidden">
        {project.imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {project.featured && <Badge variant="accent" size="sm">Featured</Badge>}
                {project.category && (
                  <Badge variant="mono" size="sm" className="capitalize">
                    {project.category}
                  </Badge>
                )}
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{project.title}</h3>
              {project.role && (
                <p className="mt-2 font-mono text-sm text-accent">{project.role}</p>
              )}
            </div>

            <span className="rounded-full border border-line p-2 text-ink-3 transition-colors group-hover:border-accent group-hover:text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-ink-2">{project.description}</p>

          {project.highlights.length > 0 && (
            <ul className="mt-5 space-y-2">
              {project.highlights.slice(0, 2).map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-7 text-ink-2">
                  <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="mono" size="sm">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 5 && (
              <Badge variant="accent" size="sm">
                +{project.techStack.length - 5}
              </Badge>
            )}
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ink-3">
                Outcome
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.metrics.slice(0, 3).map((metric) => (
                  <span key={metric} className="text-sm font-medium text-ink-2">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
