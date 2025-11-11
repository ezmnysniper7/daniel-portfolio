import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card hover className="group h-full">
        {project.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-blue-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} size="sm">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge size="sm" variant="accent">
                +{project.techStack.length - 4} more
              </Badge>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              {project.metrics.map((metric, index) => (
                <span key={index} className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-green-500"
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
                  {metric}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
