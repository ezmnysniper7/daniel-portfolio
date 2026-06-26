'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface VisitorCountProps {
  initialCount: number;
  enabled: boolean;
}

const SESSION_KEY = 'portfolio-visitor-counted-v1';

export function VisitorCount({ initialCount, enabled }: VisitorCountProps) {
  const t = useTranslations('home.hero');
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!enabled) return;

    const alreadyCounted = window.sessionStorage.getItem(SESSION_KEY);
    if (alreadyCounted) return;

    const increment = async () => {
      try {
        const response = await fetch('/api/visitors', { method: 'POST' });
        if (!response.ok) return;

        const data = await response.json();
        if (typeof data.count === 'number') {
          setCount(data.count);
          window.sessionStorage.setItem(SESSION_KEY, '1');
        }
      } catch {
        // Keep the last known count if the increment request fails.
      }
    };

    void increment();
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-line bg-panel/60 p-5 backdrop-blur">
      <p className="font-mono text-xl font-semibold text-accent">
        {new Intl.NumberFormat().format(count)}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-2">{t('visitors')}</p>
    </div>
  );
}
