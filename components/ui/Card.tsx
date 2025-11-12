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
        'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg',
        hover && 'transition-all duration-500 hover:shadow-2xl hover:border-gray-300/50 dark:hover:border-gray-600/50 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}
