'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 relative overflow-hidden',
  secondary:
    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 shadow-md hover:shadow-xl relative overflow-hidden',
  ghost:
    'bg-transparent text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-gray-100 dark:hover:from-blue-950 dark:hover:to-purple-950 relative',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
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
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  const MotionComponent = motion.div;

  const content = (
    <MotionComponent
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={classes}
    >
      {/* Shimmer effect for primary button */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Ripple effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileHover={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            variant === 'primary'
              ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </MotionComponent>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block"
    >
      {content}
    </button>
  );
}
