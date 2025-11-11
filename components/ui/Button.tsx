import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const variants = {
  primary:
    'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
  ghost:
    'bg-transparent text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-gray-100 dark:hover:from-blue-950 dark:hover:to-purple-950',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';
  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
