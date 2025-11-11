import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Experience } from '@/types';
import { formatDate, calculateDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        'relative flex flex-col md:flex-row group',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      )}
    >
      {/* Timeline dot with pulse effect */}
      <div className="absolute left-0 md:left-1/2 w-6 h-6 -ml-3 mt-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white dark:border-gray-900 z-10 group-hover:scale-125 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/50" />

      {/* Pulsing ring around dot */}
      <div className="absolute left-0 md:left-1/2 w-6 h-6 -ml-3 mt-1.5 rounded-full bg-blue-500/30 z-0 animate-ping opacity-0 group-hover:opacity-100" />

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-1/2" />

      {/* Content card */}
      <div
        className={cn(
          'ml-8 md:ml-0 md:w-1/2',
          isEven ? 'md:pr-12' : 'md:pl-12'
        )}
      >
        <Card className="p-6 group-hover:shadow-2xl group-hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 shimmer"></div>
          </div>

          <div className="relative z-10">
            {/* Date */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">
              {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
              <span className="ml-2 text-xs">
                ({calculateDuration(experience.startDate, experience.endDate)})
              </span>
            </div>

            {/* Position & Company */}
            <h3 className="text-xl font-semibold mb-1 group-hover:gradient-text transition-all">{experience.position}</h3>
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-500 hover:text-purple-600 mb-3 inline-block transition-colors"
              >
                {experience.company} →
              </a>
            ) : (
              <h4 className="text-lg text-blue-500 mb-3 group-hover:text-purple-600 transition-colors">{experience.company}</h4>
            )}

            {/* Location */}
            {experience.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                📍 {experience.location}
              </p>
            )}

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {experience.description}
            </p>

            {/* Responsibilities */}
            {experience.responsibilities.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Key Responsibilities:
                </h5>
                <ul className="space-y-2">
                  {experience.responsibilities.slice(0, 4).map((resp, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-blue-500 flex-shrink-0">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Achievements:
                </h5>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <svg
                        className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"
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
                      <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Technologies:
              </h5>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech) => (
                  <Badge key={tech} size="sm" className="group-hover:scale-105 transition-transform">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
