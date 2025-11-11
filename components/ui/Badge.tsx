import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
  accent: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-300 hover:scale-110 hover:shadow-md',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
