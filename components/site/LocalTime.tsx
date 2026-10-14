'use client';

import { useEffect, useState } from 'react';

const format = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Kuala_Lumpur',
});

/** Live Kuala Lumpur time, updated on the minute. Empty until hydrated, so the static HTML never shows a stale time. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(format.format(new Date()));
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return <span className={className}>{time}</span>;
}
