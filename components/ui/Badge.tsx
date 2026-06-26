import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'mono' | 'up' | 'down';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'border-line bg-paper-2/70 text-ink-2',
  accent: 'border-accent/30 bg-accent/10 text-accent',
  mono: 'border-line bg-paper-2/60 text-ink-2 font-mono tracking-tight',
  up: 'border-up/30 bg-up/10 text-up',
  down: 'border-down/30 bg-down/10 text-down',
};

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium tracking-tight',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
