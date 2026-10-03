import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { EDGES, NODES } from '@/lib/system-graph';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

/** Static front view of the system: shown without JS, with reduced motion, or until WebGL takes over. */
function SystemFallback({ dict }: { dict: Dictionary }) {
  return (
    <svg viewBox="-2.7 -2.2 5.4 4.4" className="system-fallback absolute inset-0 h-full w-full" aria-hidden="true">
      {EDGES.map(([a, b], e) => (
        <line
          key={e}
          x1={NODES[a].x}
          y1={-NODES[a].y}
          x2={NODES[b].x}
          y2={-NODES[b].y}
          stroke="hsl(220 12% 55% / 0.35)"
          strokeWidth="0.012"
        />
      ))}
      {NODES.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={-node.y} r={node.hub ? 0.2 : 0.14} fill={node.hub ? 'hsl(187 96% 58% / 0.16)' : 'hsl(40 30% 92% / 0.08)'} />
          <circle cx={node.x} cy={-node.y} r={node.hub ? 0.06 : 0.045} fill={node.hub ? 'hsl(187 96% 58%)' : 'hsl(40 30% 92%)'} />
          <text x={node.x + 0.13} y={-node.y - 0.1} fontSize="0.13" fill="hsl(40 8% 66%)" className="hidden md:inline">
            {dict.system.nodes[node.id]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Hero({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { hero, system } = dict;
  return (
    <section
      id="top"
      data-system
      data-flows={JSON.stringify(system.flows)}
      className="hero relative flex flex-col lg:min-h-[88svh] lg:justify-center"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* The graph is drawn by the page-wide WebGL space, positioned over this anchor. */}
      <div
        data-system-anchor
        role="img"
        aria-label={system.label}
        className="system relative h-[34svh] min-h-[240px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]"
      >
        <SystemFallback dict={dict} />
        <p className="system-caption absolute bottom-6 right-[var(--gutter)] hidden items-center gap-2.5 font-mono text-[0.75rem] text-bone-2 md:flex lg:bottom-[8vh]" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="uppercase tracking-[0.12em] text-signal">{system.live}</span>
          <span data-system-caption>{system.flows[0]}</span>
        </p>
      </div>
      <div data-system-labels className="system-labels pointer-events-none fixed inset-0 -z-[5] hidden md:block" aria-hidden="true">
        {NODES.map((node) => (
          <span key={node.id} data-system-label className={`system-label${node.hub ? ' is-hub' : ''}`}>
            {system.nodes[node.id]}
          </span>
        ))}
      </div>

      <div className="gutter relative z-10 mx-auto w-full max-w-page pb-16 pt-6 lg:py-32">
        <div className="lg:max-w-[46%]">
          <p className="eyebrow hero-fade" style={i(0)}>
            {hero.eyebrow}
          </p>
          <h1 className="display-hero mt-6">
            {hero.lines.map((line, n) => (
              <span key={line} className="line-mask">
                <span className="hero-line whitespace-nowrap" style={i(n)}>
                  {line}
                </span>
                {/* keeps the lines apart in the text search engines read */}
                {n < hero.lines.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-xl text-base leading-relaxed text-bone-2 md:text-lg" style={i(1)}>
            {hero.sub}
          </p>
          <p className="hero-fade eyebrow mt-8 flex items-center gap-2.5" style={i(2)}>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
            {hero.status}
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" style={i(3)}>
            <a
              href="#work"
              data-magnetic
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-signal"
            >
              {hero.cta}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
            <Link href={`/${locale}/services`} className="link-underline eyebrow py-3 text-bone">
              {hero.cta2} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
