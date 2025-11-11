'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/projects/${project.slug}`}>
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
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
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
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl md:text-2xl font-semibold group-hover:gradient-text transition-all duration-300 group-hover:scale-105 transform-gpu">
                {project.title}
              </h3>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-45 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack with staggered animation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 4).map((tech, i) => (
                <div key={tech} style={{ transitionDelay: `${i * 50}ms` } as React.CSSProperties}>
                  <Badge
                    size="sm"
                    className="group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg"
                  >
                    {tech}
                  </Badge>
                </div>
              ))}
              {project.techStack.length > 4 && (
                <Badge size="sm" variant="accent" className="group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  +{project.techStack.length - 4} more
                </Badge>
              )}
            </div>

            {/* Metrics with animated icons */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                {project.metrics.map((metric, i) => (
                  <span key={i} className="flex items-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500 group-hover:scale-150 group-hover:rotate-12 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}
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
