'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Small upward-trending sparkline with area fill — used in the CFI "what's next"
 * card. Draws itself in on mount (skipped under prefers-reduced-motion).
 */
export function Sparkline({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  // A gently rising series (0..100 width, 0..40 height; y inverted)
  const points = [38, 34, 36, 28, 30, 22, 24, 14, 18, 8, 10, 4];
  const w = 220;
  const h = 44;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => `${i * step},${(p / 40) * h}`);
  const line = `M ${coords.join(' L ')}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--up))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--up))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <motion.path
        d={line}
        stroke="hsl(var(--up))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? {} : { pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <circle cx={w} cy={(points[points.length - 1] / 40) * h} r="3" fill="hsl(var(--up))" />
    </svg>
  );
}
