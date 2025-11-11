'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Experience } from '@/types';
import { formatDate, calculateDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        'relative flex flex-col md:flex-row group',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      )}
    >
      {/* Timeline dot with enhanced effects */}
      <motion.div
        whileHover={{ scale: 1.5 }}
        className="absolute left-0 md:left-1/2 w-8 h-8 -ml-4 mt-1.5 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 border-4 border-white dark:border-gray-900 z-10 transition-all duration-300 shadow-2xl shadow-blue-500/50 cursor-pointer"
      >
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-white/50 dark:bg-gray-900/50 animate-pulse"></div>
      </motion.div>

      {/* Multiple pulsing rings around dot */}
      <div className="absolute left-0 md:left-1/2 w-8 h-8 -ml-4 mt-1.5 rounded-full bg-blue-500/20 z-0 animate-ping opacity-0 group-hover:opacity-100" />
      <div className="absolute left-0 md:left-1/2 w-12 h-12 -ml-6 mt-0.5 rounded-full bg-purple-500/10 z-0 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.2s' } as React.CSSProperties} />

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-1/2" />

      {/* Content card with 3D effect */}
      <motion.div
        whileHover={{ scale: 1.02, rotateY: isEven ? 2 : -2 }}
        className={cn(
          'ml-8 md:ml-0 md:w-1/2',
          isEven ? 'md:pr-12' : 'md:pl-12'
        )}
      >
        <Card className="p-6 group-hover:shadow-2xl group-hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-700"></div>

          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 shimmer"></div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            {/* Date with animated icon */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 group-hover:text-blue-500 transition-colors">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                {calculateDuration(experience.startDate, experience.endDate)}
              </span>
            </div>

            {/* Position & Company with enhanced styling */}
            <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all transform group-hover:scale-105">
              {experience.position}
            </h3>
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 mb-3 inline-flex items-center gap-2 transition-all group/link"
              >
                <span className="font-semibold">{experience.company}</span>
                <svg className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <h4 className="text-lg text-blue-600 dark:text-blue-400 mb-3 font-semibold">{experience.company}</h4>
            )}

            {/* Location with icon */}
            {experience.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{experience.location}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {experience.description}
            </p>

            {/* Responsibilities */}
            {experience.responsibilities.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Key Responsibilities
                </h5>
                <ul className="space-y-2">
                  {experience.responsibilities.slice(0, 4).map((resp, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-sm flex gap-3 group/item"
                    >
                      <span className="text-blue-500 flex-shrink-0 font-bold group-hover/item:scale-125 transition-transform">▪</span>
                      <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Achievements
                </h5>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-sm flex gap-3 group/item"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all"
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
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack with enhanced badges */}
            <div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Technologies
              </h5>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech, i) => (
                  <div key={tech} style={{ transitionDelay: `${i * 30}ms` } as React.CSSProperties}>
                    <Badge size="sm" className="group-hover:scale-110 transition-all duration-300 hover:shadow-lg cursor-pointer">
                      {tech}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.3s' } as React.CSSProperties}></div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
