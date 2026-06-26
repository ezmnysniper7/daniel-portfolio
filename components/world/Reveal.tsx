'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  /** Travel distance in px before settling */
  y?: number;
  /** Render as inline-block (useful for words / chips) */
  as?: 'div' | 'span';
}

/**
 * In-view fade + slide wrapper. Honors prefers-reduced-motion (renders static).
 * Used across both worlds for consistent, gentle section entrances.
 */
export function Reveal({ children, delay = 0, y = 18, as = 'div', ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = as === 'span' ? motion.span : motion.div;

  if (reduce) {
    const Tag = as === 'span' ? 'span' : 'div';
    return <Tag {...(rest as Record<string, unknown>)}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
