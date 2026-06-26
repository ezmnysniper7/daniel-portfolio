'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Experience } from '@/types';
import { calculateDuration, cn, formatDate } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  const t = useTranslations('experience');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const isEven = index % 2 === 0;
  const responsibilities = experience.responsibilities.slice(0, 3);
  const achievements = experience.achievements?.slice(0, 2) ?? [];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true, margin: '-80px' }}
      className={cn('relative md:flex', isEven ? 'md:flex-row' : 'md:flex-row-reverse')}
    >
      <div className="hidden md:block md:w-1/2" />

      <div className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-paper bg-accent shadow-[0_0_0_6px_hsl(var(--accent)/0.14)] md:left-1/2" />

      <div className={cn('pl-10 md:w-1/2 md:pl-0', isEven ? 'md:pr-10' : 'md:pl-10')}>
        <Card hover className="p-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-ink-3">
            <span>
              {formatDate(experience.startDate, 'long', locale)} -{' '}
              {experience.endDate === 'Present'
                ? t('present')
                : formatDate(experience.endDate, 'long', locale)}
            </span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>{calculateDuration(experience.startDate, experience.endDate, locale)}</span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold text-ink">{experience.position}</h3>

          {experience.companyUrl ? (
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-base font-medium text-accent transition-colors hover:brightness-110"
            >
              {experience.company}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <p className="mt-2 text-base font-medium text-accent">{experience.company}</p>
          )}

          {experience.location && <p className="mt-2 text-sm text-ink-3">{experience.location}</p>}

          <p className="mt-5 text-sm leading-7 text-ink-2">{experience.description}</p>

          {responsibilities.length > 0 && (
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
                {t('responsibilities')}
              </h4>
              <ul className="mt-3 space-y-3">
                {responsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex gap-3 text-sm leading-7 text-ink-2">
                    <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
                {t('achievements')}
              </h4>
              <ul className="mt-3 space-y-3">
                {achievements.map((achievement) => (
                  <li key={achievement} className="flex gap-3 text-sm leading-7 text-ink-2">
                    <span className="mt-1 text-up">+</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t('techStack')}
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {experience.techStack.map((tech) => (
                <Badge key={tech} variant="mono" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
