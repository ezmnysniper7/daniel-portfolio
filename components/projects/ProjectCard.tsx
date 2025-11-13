'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, MouseEvent, useState, useEffect } from 'react';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tilt effect - DISABLED ON MOBILE for performance
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
      ref={ref}
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: isMobile ? 0.15 : 0.5, delay: isMobile ? 0 : index * 0.1 }}
      viewport={{ once: true, margin: isMobile ? '-50px' : '0px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: isMobile ? 'flat' : 'preserve-3d',
      }}
    >
      <Link href={`/${locale}/projects/${project.slug}`}>
        <Card
          hover
          className="group h-full relative overflow-hidden border-2 border-transparent hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-gray-900/60 dark:via-gray-900/40 dark:to-transparent backdrop-blur-xl pointer-events-none"></div>

          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>

          {/* Shimmer effect overlay - Disabled on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
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

          {project.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-t-lg relative" style={{ transform: isMobile ? 'none' : 'translateZ(20px)' }}>
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className={isMobile ? "object-cover" : "object-cover group-hover:scale-110 transition-all duration-700"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading={index < 3 ? "eager" : "lazy"}
                quality={isMobile ? 75 : 90}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

              {/* Floating icon on hover with 3D effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ transform: 'translateZ(40px)' }}
              >
                <motion.div
                  className="bg-white/90 dark:bg-gray-900/90 rounded-full p-4 backdrop-blur-md shadow-2xl border border-white/20"
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          )}

          <div className="p-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
            {/* Date and Category Badge */}
            {project.startDate && (
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{project.startDate} - {project.endDate}</span>
                </motion.div>
                {project.featured && (
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                    <Badge size="sm" variant="accent" className="shadow-lg shadow-green-500/50">
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <motion.h3
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {project.title}
                </motion.h3>
                {project.role && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {project.role}
                  </p>
                )}
              </div>
              <motion.svg
                className="w-6 h-6 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                whileHover={{ x: 5, y: -5, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="mb-4 space-y-2">
                {project.highlights.slice(0, 2).map((highlight, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: isMobile ? 0 : i * 0.1, duration: isMobile ? 0.1 : 0.3 }}
                  >
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-clamp-1">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tech Stack with enhanced animations */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 5).map((tech) => (
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
              {project.techStack.length > 5 && (
                <motion.div whileHover={{ scale: 1.15, y: -2 }}>
                  <Badge size="sm" variant="accent" className="shadow-md hover:shadow-lg">
                    +{project.techStack.length - 5} more
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Metrics with animated icons */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-4 backdrop-blur-sm">
                {project.metrics.map((metric, i) => (
                  <motion.span
                    key={i}
                    className="flex items-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors font-medium"
                    whileHover={{ scale: 1.1, x: 2 }}
                  >
                    <motion.svg
                      className="w-3 h-3 mr-1.5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      whileHover={{ scale: 1.5, rotate: 12 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </motion.svg>
                    {metric}
                  </motion.span>
                ))}
              </div>
            )}
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
            className="absolute top-6 left-6 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
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
            className="absolute bottom-6 right-6 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
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
      </Link>
    </motion.div>
  );
}
