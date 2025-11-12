'use client';

import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

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

  // Use translated name
  const displayName = t('name');

  // Enhanced stagger animations for children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9] as any
      }
    }
  };

  const nameVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.6, 0.05, 0.01, 0.9] as any,
        delay: 0.3
      }
    }
  };

  return (
    <Section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Particle background */}
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.2,
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.2,
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: 0.2 },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-3xl opacity-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.1,
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            opacity: { duration: 1, delay: 0.4 },
            scale: { duration: 15, repeat: Infinity, ease: "linear" },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability badge */}
          {availableForWork && (
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium shadow-2xl shadow-emerald-500/50 animate-pulse-glow">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                {t('availableForWork')}
              </span>
            </motion.div>
          )}

          {/* Main heading with stunning animation */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
          >
            <motion.span
              className="block text-gray-900 dark:text-white mb-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {t('greeting')}
            </motion.span>
            <motion.span
              variants={nameVariants}
              className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient bg-300%"
              style={{ perspective: 1000 }}
            >
              {displayName}
            </motion.span>
          </motion.h1>

          {/* Title with typing effect look */}
          <motion.p
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-700 via-blue-700 to-purple-700 dark:from-gray-200 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
          >
            {t('title')}
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {t('tagline')}
          </motion.p>

          {/* CTA buttons with stunning effects */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6"
          >
            <Button
              href={`/${locale}/projects`}
              variant="primary"
              size="lg"
              className="group relative overflow-hidden shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/50 px-8 py-4 text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('viewProjects')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
            <Button
              href={`/${locale}/contact`}
              variant="secondary"
              size="lg"
              className="group hover:glow transition-all duration-300 px-8 py-4 text-lg backdrop-blur-sm"
            >
              <span className="group-hover:scale-110 transition-transform flex items-center gap-2">
                {t('contactMe')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </Button>
          </motion.div>

          {/* Animated scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-20"
          >
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('scrollToExplore')}</span>
              <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Decorative gradient line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </Section>
  );
}
