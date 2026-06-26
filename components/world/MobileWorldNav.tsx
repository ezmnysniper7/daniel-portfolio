'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const icons: Record<string, ReactNode> = {
  home: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  projects: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  listings: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
    </svg>
  ),
  about: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  contact: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

export function MobileWorldNav({ world }: { world: 'engineer' | 'property' }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const tNav = useTranslations('nav');
  const tProp = useTranslations('propertyNav');

  const base = `/${locale}/${world}`;
  const stripped = pathname.replace(/^\/(en|zh-CN)/, '') || '/';

  const links =
    world === 'engineer'
      ? [
          { href: base, label: tNav('home'), icon: icons.home, match: `/${world}` },
          { href: `${base}/projects`, label: tNav('projects'), icon: icons.projects, match: `/${world}/projects` },
          { href: `${base}/about`, label: tNav('about'), icon: icons.about, match: `/${world}/about` },
          { href: `${base}/contact`, label: tNav('contact'), icon: icons.contact, match: `/${world}/contact` },
        ]
      : [
          { href: base, label: tProp('home'), icon: icons.home, match: `/${world}` },
          { href: `${base}/listings`, label: tProp('listings'), icon: icons.listings, match: `/${world}/listings` },
          { href: `${base}/contact`, label: tProp('contact'), icon: icons.contact, match: `/${world}/contact` },
        ];

  const [isExpanded, setIsExpanded] = useState(true);
  const [shouldHide, setShouldHide] = useState(false);
  const lastScrollYRef = useRef(0);

  const isActive = (match: string) => {
    if (match === `/${world}`) return stripped === `/${world}` || stripped === `/${world}/`;
    return stripped.startsWith(match);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollYRef.current && y > 100) setShouldHide(true);
      else if (y < lastScrollYRef.current) setShouldHide(false);
      lastScrollYRef.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = () => {
    setIsExpanded((v) => !v);
    setShouldHide(false);
  };

  return (
    <motion.div
      className="pointer-events-none fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 md:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: shouldHide ? 100 : 0, opacity: shouldHide ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="pointer-events-auto relative">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.nav
              key="expanded"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="rounded-full border border-line bg-paper/95 px-2 py-2 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-1">
                  {links.map((link) => {
                    const active = isActive(link.match);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group relative flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2"
                      >
                        {active && (
                          <motion.div
                            layoutId={`mtab-${world}`}
                            className="absolute inset-0 rounded-full bg-accent/12"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div
                          className={cn(
                            'relative transition-colors',
                            active ? 'text-accent' : 'text-ink-3 group-hover:text-accent'
                          )}
                        >
                          {link.icon}
                        </div>
                        <span
                          className={cn(
                            'relative whitespace-nowrap text-[9px] font-medium transition-colors',
                            active ? 'font-semibold text-accent' : 'text-ink-3'
                          )}
                        >
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={toggle}
                className="absolute -top-10 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper/95 text-ink-3 shadow-lg transition-colors hover:text-accent"
                aria-label="Collapse navigation"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.nav>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggle}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
              aria-label="Expand navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
