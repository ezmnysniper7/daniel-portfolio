import { Experience } from '@/types';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-accent via-line to-transparent md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-8 md:space-y-10">
        {experiences.map((experience, index) => (
          <TimelineItem key={experience.id} experience={experience} index={index} />
        ))}
      </div>
    </div>
  );
}
