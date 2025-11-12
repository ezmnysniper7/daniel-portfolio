'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/${locale}/projects/${project.slug}`}>
        <Card hover className="group h-full relative overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:glow hover:-translate-y-2 hover:rotate-1">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>

          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 shimmer"></div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {project.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-t-lg relative">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Floating icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 relative z-10">
            {/* Date and Category Badge */}
            {project.startDate && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{project.startDate} - {project.endDate}</span>
                </div>
                {project.featured && (
                  <Badge size="sm" variant="accent" className="animate-pulse-glow">
                    Featured
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold group-hover:gradient-text transition-all duration-300 group-hover:scale-105 transform-gpu mb-1">
                  {project.title}
                </h3>
                {project.role && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {project.role}
                  </p>
                )}
              </div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-45 transition-all duration-500 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
              {project.description}
            </p>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-4 space-y-1">
                {project.highlights.slice(0, 2).map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-clamp-1">{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack with staggered animation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 5).map((tech, i) => (
                <div key={tech} style={{ transitionDelay: `${i * 50}ms` } as React.CSSProperties}>
                  <Badge
                    size="sm"
                    className="group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                  >
                    {tech}
                  </Badge>
                </div>
              ))}
              {project.techStack.length > 5 && (
                <Badge size="sm" variant="accent" className="group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  +{project.techStack.length - 5} more
                </Badge>
              )}
            </div>

            {/* Metrics with animated icons */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                {project.metrics.map((metric, i) => (
                  <span key={i} className="flex items-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    <svg
                      className="w-3 h-3 mr-1 text-green-500 group-hover:scale-150 group-hover:rotate-12 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {metric}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Multiple gradient border effects */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
          </div>

          {/* Sparkle effect */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.5s' } as React.CSSProperties}></div>
        </Card>
      </Link>
    </motion.div>
  );
}
