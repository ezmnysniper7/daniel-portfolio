import type { CSSProperties } from 'react';
import type { Dictionary } from '@/data/dictionary';
import { EDGES, FLOWS, NODES } from '@/lib/system-graph';
import { FlowTabs } from './FlowTabs';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

/** Static front view of the system: shown without JS, with reduced motion, or until WebGL takes over. */
function SystemFallback({ dict }: { dict: Dictionary }) {
  return (
    <svg viewBox="-2.7 -2.2 5.4 4.4" className="system-fallback absolute inset-0 h-full w-full" aria-hidden="true">
      {EDGES.map(([a, b], e) => (
        <line
          key={e}
          className="sys-edge"
          data-f={FLOWS.filter((f) => f.edges.some(([edge]) => edge === e)).map((f) => f.id).join(' ')}
          data-rev={FLOWS.filter((f) => f.edges.some(([edge, dir]) => edge === e && dir === -1)).map((f) => f.id).join(' ')}
          x1={NODES[a].x}
          y1={-NODES[a].y}
          x2={NODES[b].x}
          y2={-NODES[b].y}
          stroke="hsl(220 12% 55% / 0.35)"
          strokeWidth="0.012"
        />
      ))}
      {NODES.map((node) => (
        <g
          key={node.id}
          className="sys-node"
          data-f={FLOWS.filter((f) => f.edges.some(([edge]) => EDGES[edge].includes(NODES.indexOf(node)))).map((f) => f.id).join(' ')}
        >
          <circle cx={node.x} cy={-node.y} r={node.hub ? 0.2 : 0.14} fill={node.hub ? 'hsl(187 96% 58% / 0.16)' : 'hsl(40 30% 92% / 0.08)'} />
          <circle cx={node.x} cy={-node.y} r={node.hub ? 0.06 : 0.045} fill={node.hub ? 'hsl(187 96% 58%)' : 'hsl(40 30% 92%)'} />
          {/* The right-most node carries its label on the left, so it is never cut off by the edge. */}
          <text
            x={node.x > 1.9 ? node.x - 0.13 : node.x + 0.13}
            y={-node.y - 0.1}
            textAnchor={node.x > 1.9 ? 'end' : 'start'}
            fontSize="0.13"
            fill="hsl(40 8% 66%)"
            className="hidden md:inline"
          >
            {dict.system.nodes[node.id]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Hero({ dict }: { dict: Dictionary }) {
  const { hero, system } = dict;
  return (
    <section
      id="top"
      data-system
      data-flow={FLOWS[0].id}
      className="hero relative flex flex-col lg:min-h-[88svh] lg:justify-center"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* The graph is drawn by the page-wide WebGL space, positioned over this anchor. */}
      <div
        data-system-anchor
        role="img"
        aria-label={system.label}
        className="system relative h-[30svh] min-h-[220px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[54%]"
      >
        <SystemFallback dict={dict} />
      </div>
      {/* Real buttons, outside the picture: choose a flow and the graph plays it. */}
      <div className="gutter relative z-20 lg:absolute lg:bottom-[7vh] lg:right-0 lg:w-[54%] lg:pl-[8%]">
        <FlowTabs ids={FLOWS.map((f) => f.id)} captions={system.flows} label={system.flowsLabel} />
      </div>
      <div data-system-labels className="system-labels pointer-events-none fixed inset-0 -z-[5] hidden md:block" aria-hidden="true">
        {NODES.map((node) => (
          <span key={node.id} data-system-label className={`system-label${node.hub ? ' is-hub' : ''}`}>
            {system.nodes[node.id]}
          </span>
        ))}
      </div>

      <div className="gutter relative z-10 mx-auto w-full max-w-page pb-16 pt-10 lg:py-32">
        <div className="hero-copy lg:max-w-[48%]">
          <h1 className="display-hero">
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
          <p className="hero-fade mt-7 max-w-[34rem] text-[1.1rem] leading-relaxed text-bone-2 md:text-[1.2rem]" style={i(1)}>
            {hero.sub}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={i(2)}>
            <a
              href="#contact"
              data-track="cta_hero_contact"
              data-magnetic
              className="inline-flex items-center rounded-full bg-bone px-6 py-3.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-signal"
            >
              {hero.cta}
            </a>
            <a href="#work" data-track="cta_hero_work" className="link-underline py-3 text-[0.95rem] text-bone">
              {hero.cta2}
            </a>
          </div>
          <div className="hero-fade mt-14 md:mt-16" style={i(3)}>
            <p className="text-sm text-bone-3">{hero.proofLabel}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.95rem] text-bone-2">
              {hero.proof.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
