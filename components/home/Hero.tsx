'use client';

import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

interface HeroProps {
  name: string;
  title: string;
  tagline: string;
  availableForWork: boolean;
}

export function Hero({ name, title, tagline, availableForWork }: HeroProps) {
  const t = useTranslations('home');
  const params = useParams();
  const locale = params.locale as string;
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use translated name
  const displayName = t('name');

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

  // Parallax effect based on scroll - DISABLED ON MOBILE for performance
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0.95]);

  // Enhanced stagger animations for children - Much faster on mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.03 : 0.12,
        delayChildren: isMobile ? 0 : 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: isMobile ? { opacity: 0 } : { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: isMobile ? 0.2 : 0.8,
        ease: isMobile ? 'easeOut' : [0.6, 0.05, 0.01, 0.9] as any
      }
    }
  };

  const nameVariants = {
    hidden: isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotateX: -15, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: isMobile ? 0.2 : 1.2,
        ease: isMobile ? 'easeOut' : [0.6, 0.05, 0.01, 0.9] as any,
        delay: isMobile ? 0 : 0.2
      }
    }
  };

  return (
    <Section
      ref={ref}
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Animated gradient background with glass effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30" />

        {/* Floating gradient orbs with parallax - Simplified on mobile */}
        <motion.div
          style={{ y: isMobile ? 0 : y }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div
            className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/40 to-cyan-400/40 dark:from-blue-600/30 dark:to-cyan-600/30 rounded-full blur-3xl"
            animate={isMobile ? {} : {
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-purple-400/40 to-pink-400/40 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full blur-3xl"
            animate={isMobile ? {} : {
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-400/40 to-blue-400/40 dark:from-indigo-600/30 dark:to-blue-600/30 rounded-full blur-3xl"
            animate={isMobile ? {} : {
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Mesh pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container className="relative z-10">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Availability badge with glow */}
            {availableForWork && (
              <motion.div variants={itemVariants} className="mb-8">
                <motion.span
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold shadow-2xl shadow-emerald-500/50 backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  {t('availableForWork')}
                </motion.span>
              </motion.div>
            )}

            {/* Greeting text */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                {t('greeting')}
              </span>
            </motion.div>

            {/* Main name with 3D effect */}
            <motion.h1
              variants={nameVariants}
              className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {displayName}
              </motion.span>
            </motion.h1>

            {/* Title with gradient */}
            <motion.p
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-200 dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
            >
              {t('title')}
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-14 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {t('tagline')}
            </motion.p>

            {/* CTA buttons with enhanced effects */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  href={`/${locale}/projects`}
                  variant="primary"
                  size="lg"
                  className="group relative overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-purple-500/40 px-10 py-4 text-lg font-semibold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t('viewProjects')}
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </span>

                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  href={`/${locale}/contact`}
                  variant="secondary"
                  size="lg"
                  className="group px-10 py-4 text-lg font-semibold backdrop-blur-sm border-2"
                >
                  <span className="flex items-center gap-2">
                    {t('contactMe')}
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      whileHover={{ rotate: 15 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </motion.svg>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated scroll indicator */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {t('scrollToExplore')}
              </span>
              <motion.svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Decorative gradient line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </Section>
  );
}
