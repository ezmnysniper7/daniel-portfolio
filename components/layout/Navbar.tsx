'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container } from './Container';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';
import { useMobile } from '@/contexts/MobileContext';

export function Navbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('nav');
  const { isMobile } = useMobile();

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/(en|zh-CN)/, '');

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800",
        // Mobile: solid background. Desktop: glassmorphism
        isMobile
          ? "bg-white dark:bg-gray-900"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      )}>
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="text-xl font-bold hover:text-blue-500 transition-colors">
              DC
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-500',
                    currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
                      ? 'text-blue-500'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Mobile Top Bar */}
            <div className="flex md:hidden items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </>
  );
}
