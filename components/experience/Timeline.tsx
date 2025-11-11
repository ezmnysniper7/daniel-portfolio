import { Experience } from '@/types';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line with gradient */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 rounded-full opacity-50" />

      {/* Animated glow line behind */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20 -translate-x-1/2 blur-sm animate-pulse" />

      <div className="space-y-12">
        {experiences.map((exp, idx) => (
          <TimelineItem key={exp.id} experience={exp} index={idx} />
        ))}
      </div>
    </div>
  );
}
