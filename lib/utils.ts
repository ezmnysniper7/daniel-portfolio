import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 * @param dateString - Date string in YYYY-MM format or full ISO date
 * @param format - 'long' or 'short' format
 * @param locale - Locale for formatting (e.g., 'en', 'zh-CN')
 * @returns Formatted date like "September 2024" or "Sep 2024" or "2024年9月"
 */
export function formatDate(
  dateString: string | 'Present',
  format: 'long' | 'short' = 'long',
  locale: string = 'en'
): string {
  if (dateString === 'Present') return 'Present';

  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
  };

  // Map locale to proper format for toLocaleDateString
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'zh-CN': 'zh-CN',
  };

  return date.toLocaleDateString(localeMap[locale] || locale, options);
}

/**
 * Calculate duration between two dates
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format or "Present"
 * @param locale - Locale for formatting (e.g., 'en', 'zh-CN')
 * @returns Duration string like "1 year 3 months" or "6 months" or "1年3个月"
 */
export function calculateDuration(
  startDate: string,
  endDate: string | 'Present',
  locale: string = 'en'
): string {
  const start = new Date(startDate);
  const end = endDate === 'Present' ? new Date() : new Date(endDate);

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  // Chinese formatting
  if (locale === 'zh-CN') {
    if (months < 1) return '不到一个月';
    if (months < 12) return `${months}个月`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years}年`;
    }

    return `${years}年${remainingMonths}个月`;
  }

  // English formatting (default)
  if (months < 1) return 'Less than a month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
}

/**
 * Calculate reading time for content
 * @param content - Text content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Slugify a string for URL usage
 * @param str - String to slugify
 * @returns URL-safe slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Truncate text to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}
