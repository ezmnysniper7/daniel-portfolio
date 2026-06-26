'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'surface-card',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
