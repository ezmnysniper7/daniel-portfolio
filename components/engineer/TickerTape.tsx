'use client';

import { cn } from '@/lib/utils';

type Tick = { sym: string; delta: string; up: boolean };

// Decorative "market" strip — Daniel's stack quoted like trading symbols.
const TICKS: Tick[] = [
  { sym: 'GO', delta: '+2.4%', up: true },
  { sym: 'K8S', delta: '+1.1%', up: true },
  { sym: 'TS', delta: '+3.0%', up: true },
  { sym: 'NEXT', delta: '+1.8%', up: true },
  { sym: 'PAYMENTS', delta: '+4.2%', up: true },
  { sym: 'REDIS', delta: '-0.6%', up: false },
  { sym: 'POSTGRES', delta: '+0.9%', up: true },
  { sym: 'AWS', delta: '+1.4%', up: true },
  { sym: 'DOCKER', delta: '+0.7%', up: true },
  { sym: 'JAVA', delta: '-0.3%', up: false },
  { sym: 'SPRING', delta: '+1.2%', up: true },
  { sym: 'REACT', delta: '+2.1%', up: true },
  { sym: 'MT5', delta: '+5.6%', up: true },
  { sym: 'UPTIME', delta: '99.9%', up: true },
];

function Row({ ticks }: { ticks: Tick[] }) {
  return (
    <>
      {ticks.map((t, i) => (
        <span key={`${t.sym}-${i}`} className="inline-flex items-center gap-2 px-5 font-mono text-xs">
          <span className="font-semibold text-ink-2">{t.sym}</span>
          <span className={cn(t.up ? 'text-up' : 'text-down')}>
            {t.up ? '▲' : '▼'} {t.delta}
          </span>
          <span className="text-line">|</span>
        </span>
      ))}
    </>
  );
}

export function TickerTape() {
  return (
    <div className="relative z-10 border-y border-line/70 bg-panel/40 py-2 backdrop-blur-sm">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          <Row ticks={TICKS} />
          <Row ticks={TICKS} />
        </div>
      </div>
    </div>
  );
}
