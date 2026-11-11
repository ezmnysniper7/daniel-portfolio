import type { ReactNode } from 'react';
import type { DiagramId } from '@/data/notes';

/** Article diagrams as inline SVG in the site palette: no image requests, sharp at any size. */
const C = {
  line: 'hsl(220 12% 38%)',
  bone: 'hsl(40 30% 92%)',
  dim: 'hsl(220 9% 68%)',
  signal: 'hsl(187 96% 58%)',
  fill: 'hsl(222 22% 9%)',
};

type BoxProps = { x: number; y: number; w: number; h: number; title: string; sub?: string; sub2?: string; accent?: boolean; dashed?: boolean };

function Box({ x, y, w, h, title, sub, sub2, accent, dashed }: BoxProps) {
  const lines = [sub, sub2].filter(Boolean) as string[];
  const top = y + h / 2 - (lines.length * 15) / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill={C.fill}
        stroke={accent ? C.signal : C.line}
        strokeWidth={accent ? 1.5 : 1}
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <text x={x + w / 2} y={top + 4} textAnchor="middle" fontSize="13.5" fontWeight={600} fill={accent ? C.signal : C.bone}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={top + 21 + i * 15} textAnchor="middle" fontSize="11.5" fill={C.dim}>
          {line}
        </text>
      ))}
    </g>
  );
}

type ArrowProps = { id: string; points: [number, number][]; label?: string; at?: [number, number]; dashed?: boolean; both?: boolean; anchor?: 'start' | 'middle' | 'end' };

function Arrow({ id, points, label, at, dashed, both, anchor = 'middle' }: ArrowProps) {
  const d = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px} ${py}`).join(' ');
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={C.dim}
        strokeWidth={1.2}
        strokeDasharray={dashed ? '4 5' : undefined}
        markerEnd={`url(#${id}-head)`}
        markerStart={both ? `url(#${id}-tail)` : undefined}
      />
      {label && at ? (
        <text x={at[0]} y={at[1]} textAnchor={anchor} fontSize="11" fill={C.dim}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Frame({ id, width, height, label, children }: { id: string; width: number; height: number; label: string; children: ReactNode }) {
  return (
    // Wide diagrams scroll sideways on a phone instead of shrinking the labels to nothing.
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="h-auto w-full min-w-[620px] font-mono"
        style={{ fontFamily: 'var(--font-mono-face), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
      >
        <defs>
          <marker id={`${id}-head`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L9 5 L0 9 z" fill={C.dim} />
          </marker>
          <marker id={`${id}-tail`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L9 5 L0 9 z" fill={C.dim} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

function BBookArchitecture({ label }: { label: string }) {
  const id = 'bbook';
  return (
    <Frame id={id} width={720} height={340} label={label}>
      <Box x={20} y={20} w={160} h={58} title="Price feeds" sub="data or liquidity providers" />
      <Box x={240} y={20} w={200} h={58} title="Quote service" sub="normalise · mark up · staleness" />
      <Box x={20} y={140} w={160} h={64} title="Client apps" sub="WebTrader · client portal" />
      <Box x={240} y={140} w={180} h={64} title="Order gateway" sub="auth · validation" sub2="idempotency keys" />
      <Box x={480} y={140} w={220} h={64} title="Execution core" sub="one writer per account" sub2="order state machine" accent />
      <Box x={20} y={262} w={160} h={58} title="Back office" sub="groups · spreads · leverage" />
      <Box x={240} y={262} w={180} h={58} title="Journal and ledger" sub="append-only · PostgreSQL" />
      <Box x={480} y={262} w={220} h={58} title="Risk" sub="margin · stop-out · exposure" />

      <Arrow id={id} points={[[180, 49], [240, 49]]} />
      <Arrow id={id} points={[[440, 49], [590, 49], [590, 140]]} label="quotes" at={[598, 100]} anchor="start" />
      <Arrow id={id} points={[[180, 172], [240, 172]]} />
      <Arrow id={id} points={[[420, 172], [480, 172]]} />
      <Arrow id={id} points={[[590, 204], [590, 262]]} both />
      <Arrow id={id} points={[[500, 204], [410, 262]]} label="every transition" at={[395, 236]} anchor="end" />
      <Arrow id={id} points={[[240, 291], [180, 291]]} label="reads" at={[210, 283]} />
      <Arrow id={id} points={[[260, 78], [140, 140]]} dashed label="streaming" at={[150, 104]} anchor="end" />
    </Frame>
  );
}

function Mt5AccessRoutes({ label }: { label: string }) {
  const id = 'mt5routes';
  return (
    <Frame id={id} width={720} height={300} label={label}>
      <Box x={20} y={115} w={170} h={70} title="Your backend" sub="any language · Linux" />
      <Box x={270} y={24} w={200} h={64} title="MT5 Web API" sub="HTTPS · JSON commands" sub2="one round trip per read" />
      <Box x={270} y={206} w={200} h={72} title="Windows service" sub="Manager API connection" sub2="pumped cache in memory" accent />
      <Box x={540} y={115} w={160} h={70} title="MT5 trade server" sub="one broker" />

      <Arrow id={id} points={[[190, 135], [270, 62]]} label="HTTPS per request" at={[226, 84]} anchor="end" />
      <Arrow id={id} points={[[470, 56], [540, 132]]} />
      <Arrow id={id} points={[[190, 165], [270, 236]]} label="HTTP · API key" at={[226, 220]} anchor="end" />
      <Arrow id={id} points={[[470, 242], [540, 168]]} label="manager login" at={[512, 226]} anchor="start" />
      <text x={370} y={150} textAnchor="middle" fontSize="11" fill={C.dim}>
        low-volume reads and writes
      </text>
      <text x={370} y={166} textAnchor="middle" fontSize="11" fill={C.dim}>
        above, fast reads and monitoring below
      </text>
    </Frame>
  );
}

function DepositToMt5Flow({ label }: { label: string }) {
  const id = 'deposit';
  return (
    <Frame id={id} width={720} height={330} label={label}>
      <Box x={20} y={20} w={150} h={58} title="Payment provider" sub="webhook" />
      <Box x={198} y={20} w={150} h={58} title="Verify signature" sub="on the raw body" />
      <Box x={376} y={20} w={150} h={58} title="Store the event" sub="unique provider key" />
      <Box x={554} y={20} w={146} h={58} title="Credit row" sub="status: pending" />

      <Box x={20} y={136} w={150} h={58} title="Claim" sub="one atomic UPDATE" accent />
      <Box x={198} y={136} w={180} h={58} title="MT5 balance operation" sub="your reference in the comment" />
      <Box x={554} y={136} w={146} h={58} title="Done" sub="deal ticket stored" />
      <Box x={198} y={248} w={180} h={58} title="Unknown" sub="look up the deal by reference" dashed />
      <Box x={20} y={248} w={150} h={58} title="Reconciliation" sub="provider · credits · MT5" />

      <Arrow id={id} points={[[170, 49], [198, 49]]} />
      <Arrow id={id} points={[[348, 49], [376, 49]]} />
      <Arrow id={id} points={[[526, 49], [554, 49]]} />
      <Arrow id={id} points={[[627, 78], [627, 106], [95, 106], [95, 136]]} />
      <Arrow id={id} points={[[170, 165], [198, 165]]} />
      <Arrow id={id} points={[[378, 165], [554, 165]]} label="success" at={[466, 157]} />
      <Arrow id={id} points={[[288, 194], [288, 248]]} dashed label="timeout or crash" at={[296, 226]} anchor="start" />
      <Arrow id={id} points={[[378, 277], [627, 277], [627, 194]]} dashed label="deal found" at={[502, 269]} />
    </Frame>
  );
}

function InvestorPortalArchitecture({ label }: { label: string }) {
  const id = 'portal';
  return (
    <Frame id={id} width={720} height={320} label={label}>
      <Box x={20} y={24} w={140} h={50} title="Broker A" sub="MT5 server" />
      <Box x={20} y={98} w={140} h={50} title="Broker B" sub="MT5 server" />
      <Box x={205} y={46} w={150} h={80} title="Broker adapters" sub="one per access route" sub2="identity: server + login" accent />
      <Box x={400} y={46} w={150} h={80} title="Sync" sub="classify deals" sub2="no data = failure" />
      <Box x={590} y={46} w={110} h={80} title="Deals store" sub="per account" />

      <Box x={400} y={216} w={150} h={70} title="Commission engine" sub="one key per" sub2="account and period" />
      <Box x={205} y={216} w={150} h={70} title="Ledger" sub="double-entry" sub2="investor and IB wallets" />
      <Box x={20} y={216} w={140} h={70} title="Dashboards" sub="investors · IBs" />
      <Box x={590} y={216} w={110} h={70} title="Back office" sub="approves runs" />

      <Arrow id={id} points={[[160, 49], [205, 70]]} />
      <Arrow id={id} points={[[160, 123], [205, 102]]} />
      <Arrow id={id} points={[[355, 86], [400, 86]]} />
      <Arrow id={id} points={[[550, 86], [590, 86]]} />
      <Arrow id={id} points={[[645, 126], [645, 170], [475, 170], [475, 216]]} />
      <Arrow id={id} points={[[400, 251], [355, 251]]} label="posts once" at={[378, 243]} />
      <Arrow id={id} points={[[205, 251], [160, 251]]} />
      <Arrow id={id} points={[[590, 251], [550, 251]]} />
    </Frame>
  );
}

function LedgerEntries({ label }: { label: string }) {
  const id = 'ledger';
  return (
    <Frame id={id} width={720} height={250} label={label}>
      <Box x={170} y={20} w={380} h={56} title="Transaction: card deposit" sub="idempotency key = provider event id" accent />
      <Box x={40} y={150} w={250} h={76} title="Provider clearing account" sub="entry: -100.00 USD" />
      <Box x={430} y={150} w={250} h={76} title="User wallet account" sub="entry: +100.00 USD" />

      <Arrow id={id} points={[[280, 76], [165, 150]]} />
      <Arrow id={id} points={[[440, 76], [555, 150]]} />
      <Arrow id={id} points={[[290, 188], [430, 188]]} label="100.00 USD" at={[360, 180]} />
      <text x={360} y={212} textAnchor="middle" fontSize="11" fill={C.dim}>
        entries sum to zero
      </text>
    </Frame>
  );
}

const diagrams: Record<DiagramId, (props: { label: string }) => ReactNode> = {
  'bbook-architecture': BBookArchitecture,
  'mt5-access-routes': Mt5AccessRoutes,
  'deposit-to-mt5-flow': DepositToMt5Flow,
  'investor-portal-architecture': InvestorPortalArchitecture,
  'ledger-entries': LedgerEntries,
};

export function Diagram({ id, label }: { id: DiagramId; label: string }) {
  const Component = diagrams[id];
  return <Component label={label} />;
}
