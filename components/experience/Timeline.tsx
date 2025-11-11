import { Experience } from '@/types';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

      <div className="space-y-12">
        {experiences.map((exp, idx) => (
          <TimelineItem key={exp.id} experience={exp} index={idx} />
        ))}
      </div>
    </div>
  );
}
