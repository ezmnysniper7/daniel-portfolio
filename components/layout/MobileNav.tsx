'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function MobileNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('nav');
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/(en|zh-CN)/, '');

  const navLinks = [
    {
      href: `/${locale}`,
      label: t('home'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: `/${locale}/projects`,
      label: t('projects'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      href: `/${locale}/about`,
      label: t('about'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      href: `/${locale}/contact`,
      label: t('contact'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return currentPath === '' || currentPath === '/';
    }
    return currentPath.startsWith(href.replace(`/${locale}`, ''));
  };

  // Smart scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling down and past 100px, hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShouldHide(true);
      }
      // If scrolling up, show navbar
      else if (currentScrollY < lastScrollY) {
        setShouldHide(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setShouldHide(false); // When manually toggling, show it
  };

  return (
    <motion.div
      className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: shouldHide ? 100 : 0,
        opacity: shouldHide ? 0 : 1
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="relative pointer-events-auto">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.nav
              key="expanded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Main navbar container */}
              <div className="bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-full shadow-2xl px-2 py-2">
                <div className="flex items-center gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-all duration-200 group"
                      >
                        {/* Active indicator background */}
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-full"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        <div className={cn(
                          "relative transition-all duration-200",
                          active
                            ? "text-blue-500 dark:text-blue-400 scale-110"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500 group-hover:scale-110"
                        )}>
                          {link.icon}
                        </div>

                        <span className={cn(
                          "relative text-[8px] font-medium transition-all duration-200 whitespace-nowrap",
                          active
                            ? "text-blue-500 dark:text-blue-400 font-bold"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500"
                        )}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Collapse button */}
              <button
                onClick={toggleExpanded}
                className="absolute -top-10 right-2 w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label="Collapse navigation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.nav>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleExpanded}
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
              aria-label="Expand navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
