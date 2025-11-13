'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Experience } from '@/types';
import { formatDate, calculateDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, MouseEvent, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  const t = useTranslations('experience');
  const locale = useLocale();
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D Tilt effect - DISABLED ON MOBILE for performance
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? ['0deg', '0deg'] : ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? ['0deg', '0deg'] : ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: isMobile ? 0.15 : 0.6, delay: isMobile ? 0 : index * 0.1 }}
      viewport={{ once: true, margin: isMobile ? '-50px' : '0px' }}
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

      {/* Content card with 3D tilt effect */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'ml-8 md:ml-0 md:w-1/2',
          isEven ? 'md:pr-12' : 'md:pl-12'
        )}
      >
        <Card className="p-6 group-hover:shadow-2xl group-hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-gray-900/60 dark:via-gray-900/40 dark:to-transparent backdrop-blur-xl pointer-events-none"></div>

          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700"></div>

          {/* Shimmer effect overlay - Disabled on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </div>
          )}

          {/* Corner accent with glow - Disabled on mobile */}
          {!isMobile && (
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          )}

          <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
            {/* Date with animated icon */}
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 group-hover:text-blue-500 transition-colors"
              whileHover={{ x: 5 }}
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {formatDate(experience.startDate, 'long', locale)} - {experience.endDate === 'Present' ? t('present') : formatDate(experience.endDate, 'long', locale)}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full backdrop-blur-sm">
                {calculateDuration(experience.startDate, experience.endDate, locale)}
              </span>
            </motion.div>

            {/* Position & Company with enhanced styling */}
            <motion.h3
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {experience.position}
            </motion.h3>
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 mb-3 inline-flex items-center gap-2 transition-all group/link"
              >
                <span className="font-semibold">{experience.company}</span>
                <motion.svg
                  className="w-4 h-4"
                  whileHover={{ x: 2, y: -2 }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </motion.svg>
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
                  {t('responsibilities')}
                </h5>
                <ul className="space-y-2">
                  {experience.responsibilities.slice(0, 4).map((resp, i) => (
                    <motion.li
                      key={i}
                      initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: isMobile ? 0 : i * 0.1, duration: isMobile ? 0.1 : 0.3 }}
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
                  {t('achievements')}
                </h5>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: isMobile ? 0 : i * 0.1, duration: isMobile ? 0.1 : 0.3 }}
                      viewport={{ once: true }}
                      className="text-sm flex gap-3 group/item"
                    >
                      <motion.svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        whileHover={{ scale: 1.25, rotate: 12 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack with enhanced animations */}
            <div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {t('techStack')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech) => (
                  <motion.div
                    key={tech}
                    whileHover={{ scale: 1.15, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Badge
                      size="sm"
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-md hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />

          {/* Sparkle effects */}
          <motion.div
            className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: 0.5,
            }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
}
