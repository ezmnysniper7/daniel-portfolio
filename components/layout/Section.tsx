import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, id }, ref) => {
    return (
      <section ref={ref} id={id} className={cn('py-16 md:py-24', className)}>
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
