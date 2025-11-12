'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('nav');

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

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
    >
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl px-4 py-3">
        <div className="flex items-center justify-around">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center gap-1 group"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className={cn(
                  "relative z-10 transition-all duration-200",
                  active
                    ? "text-blue-500 scale-110"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500 group-hover:scale-105"
                )}>
                  {link.icon}
                </div>

                <span className={cn(
                  "text-xs font-medium transition-all duration-200 relative z-10",
                  active
                    ? "text-blue-500 font-semibold"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500"
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
