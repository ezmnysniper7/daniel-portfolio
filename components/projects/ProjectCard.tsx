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
      <Card hover className="group h-full relative overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:glow">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        {project.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-lg relative">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl md:text-2xl font-semibold group-hover:gradient-text transition-all duration-300">
              {project.title}
            </h3>
            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {project.description}
          </p>

          {/* Tech Stack with gradient background */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                size="sm"
                className="group-hover:scale-110 transition-transform duration-300"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge size="sm" variant="accent" className="group-hover:scale-110 transition-transform duration-300">
                +{project.techStack.length - 4} more
              </Badge>
            )}
          </div>

          {/* Metrics with animated icons */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              {project.metrics.map((metric, index) => (
                <span key={index} className="flex items-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  <svg
                    className="w-4 h-4 mr-1 text-green-500 group-hover:scale-125 transition-transform"
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

        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
        </div>
      </Card>
    </Link>
  );
}
