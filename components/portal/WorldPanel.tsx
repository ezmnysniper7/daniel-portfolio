'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorldPanelProps {
  world: 'engineer' | 'property';
  href: string;
  label: string;
  headline: string;
  desc: string;
  status: string;
  cta: string;
  meta?: string;
  index: number;
}

function EngineerMotif() {
  // Mini candlestick chart, trading energy
  const candles = [
    { x: 6, open: 30, close: 18, up: true },
    { x: 18, open: 22, close: 30, up: false },
    { x: 30, open: 26, close: 12, up: true },
    { x: 42, open: 16, close: 24, up: false },
    { x: 54, open: 28, close: 10, up: true },
    { x: 66, open: 20, close: 14, up: true },
    { x: 78, open: 18, close: 8, up: true },
  ];
  return (
    <svg viewBox="0 0 90 44" className="h-12 w-24" aria-hidden="true">
      {candles.map((c, i) => {
        const top = Math.min(c.open, c.close);
        const h = Math.max(Math.abs(c.open - c.close), 2);
        const color = c.up ? 'hsl(var(--up))' : 'hsl(var(--down))';
        return (
          <g key={i}>
            <line x1={c.x + 2.5} x2={c.x + 2.5} y1={top - 5} y2={top + h + 5} stroke={color} strokeWidth="1" />
            <rect x={c.x} y={top} width="5" height={h} rx="1" fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

function PropertyMotif() {
  // Soft arch / window, home energy
  return (
    <svg viewBox="0 0 90 44" className="h-12 w-24" aria-hidden="true" fill="none">
      <path
        d="M14 42V20a10 10 0 0 1 20 0v22"
        stroke="hsl(var(--accent))"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M14 30h20M24 20v22" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1.2" />
      <path
        d="M46 42V24l16-10 16 10v18"
        stroke="hsl(var(--accent-2))"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x="56" y="30" width="12" height="12" rx="1" stroke="hsl(var(--accent-2) / 0.6)" strokeWidth="1.2" />
    </svg>
  );
}

export function WorldPanel({
  world,
  href,
  label,
  headline,
  desc,
  status,
  cta,
  meta,
  index,
}: WorldPanelProps) {
  const reduce = useReducedMotion();
  const isEngineer = world === 'engineer';

  return (
    <motion.div
      data-world={world}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={reduce ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={reduce ? {} : { y: -6 }}
      className="group relative flex-1"
    >
      <Link
        href={href}
        className="surface-card relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden p-7 transition-shadow duration-500 hover:shadow-glow md:min-h-[26rem] md:p-9"
        aria-label={`${label}, ${cta}`}
      >
        {/* internal glow that intensifies on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: isEngineer
              ? 'radial-gradient(120% 80% at 80% 0%, hsl(var(--glow-2) / 0.18), transparent 60%)'
              : 'radial-gradient(120% 80% at 20% 0%, hsl(var(--glow-1) / 0.2), transparent 60%)',
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-[0.3em] text-accent',
                isEngineer && 'font-mono'
              )}
            >
              {label}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {status}
            </span>
          </div>
          <div className="opacity-80 transition-transform duration-500 group-hover:scale-110">
            {isEngineer ? <EngineerMotif /> : <PropertyMotif />}
          </div>
        </div>

        <div className="relative mt-8">
          <h2
            className={cn(
              'text-3xl font-semibold tracking-tight text-ink md:text-4xl',
              !isEngineer && 'font-display'
            )}
          >
            {headline}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-ink-2 md:text-base">{desc}</p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              {cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            {meta && (
              <span className={cn('text-xs text-ink-3', isEngineer && 'font-mono')}>{meta}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
