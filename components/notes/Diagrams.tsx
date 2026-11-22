import type { ReactNode } from 'react';
import type { DiagramId } from '@/data/notes';

/**
 * Article diagrams as inline SVG in the site palette: no image requests, sharp at any size.
 * Black and white with one accent: the signal colour marks the main path, so the eye knows where to start.
 */
const C = {
  line: 'hsl(220 12% 38%)',
  bone: 'hsl(40 30% 92%)',
  dim: 'hsl(220 9% 68%)',
  signal: 'hsl(187 96% 58%)',
  fill: 'hsl(222 22% 9%)',
};

/** Rough width of monospace text: Latin glyphs are about 0.6em wide, CJK glyphs a full em. */
function textWidth(text: string, size: number) {
  let w = 0;
  for (const ch of text) w += /[⺀-鿿＀-￯]/.test(ch) ? size : size * 0.6;
  return w;
}

/** The largest font size up to `max` at which every line fits in `room` pixels. */
function fit(lines: string[], max: number, room: number) {
  const widest = Math.max(...lines.map((l) => textWidth(l, 1)));
  return Math.min(max, Math.floor((room / widest) * 10) / 10);
}

type BoxProps = { x: number; y: number; w: number; h: number; title: string; sub?: string; sub2?: string; accent?: boolean; dashed?: boolean; n?: number };

function Box({ x, y, w, h, title, sub, sub2, accent, dashed, n }: BoxProps) {
  const lines = [sub, sub2].filter(Boolean) as string[];
  const titleSize = fit([title], 13.5, w - 20);
  const subSize = lines.length ? fit(lines, 11.5, w - 16) : 11.5;
  const step = subSize + 3.5;
  const top = y + h / 2 - (lines.length * step) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill={C.fill} stroke={accent ? C.signal : C.line} strokeWidth={accent ? 1.5 : 1} strokeDasharray={dashed ? '5 5' : undefined} />
      {accent ? <rect x={x} y={y} width={w} height={h} rx={9} fill={C.signal} fillOpacity={0.07} /> : null}
      <text x={x + w / 2} y={top + 4} textAnchor="middle" fontSize={titleSize} fontWeight={600} fill={accent ? C.signal : C.bone}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={top + 21 + i * step} textAnchor="middle" fontSize={subSize} fill={C.dim}>
          {line}
        </text>
      ))}
      {n ? (
        <g>
          <circle cx={x + 16} cy={y} r={9} fill={C.fill} stroke={accent ? C.signal : C.line} />
          <text x={x + 16} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight={600} fill={accent ? C.signal : C.dim}>
            {n}
          </text>
        </g>
      ) : null}
    </g>
  );
}

/** A small label with a backing plate, so it stays legible where it crosses a line. */
function Tag({ x, y, text, anchor = 'middle', accent }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; accent?: boolean }) {
  const w = textWidth(text, 11) + 10;
  const left = anchor === 'start' ? x - 5 : anchor === 'end' ? x - w + 5 : x - w / 2;
  return (
    <g>
      <rect x={left} y={y - 11.5} width={w} height={16} rx={4} fill={C.fill} fillOpacity={0.92} />
      <text x={x} y={y} textAnchor={anchor} fontSize="11" fill={accent ? C.signal : C.dim}>
        {text}
      </text>
    </g>
  );
}

type ArrowProps = { id: string; points: [number, number][]; label?: string; at?: [number, number]; dashed?: boolean; both?: boolean; accent?: boolean; anchor?: 'start' | 'middle' | 'end' };

function Arrow({ id, points, label, at, dashed, both, accent, anchor = 'middle' }: ArrowProps) {
  const d = points.map(([px, py], i) => `${i ? 'L' : 'M'}${px} ${py}`).join(' ');
  const marker = accent ? `${id}-head-a` : `${id}-head`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={accent ? C.signal : C.dim}
        strokeWidth={accent ? 1.6 : 1.2}
        strokeOpacity={accent ? 0.9 : 1}
        strokeDasharray={dashed ? '4 5' : undefined}
        markerEnd={`url(#${marker})`}
        markerStart={both ? `url(#${marker})` : undefined}
      />
      {label && at ? <Tag x={at[0]} y={at[1]} text={label} anchor={anchor} accent={accent} /> : null}
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
          <pattern id={`${id}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill={C.line} fillOpacity={0.45} />
          </pattern>
          {[
            [`${id}-head`, C.dim],
            [`${id}-head-a`, C.signal],
          ].map(([mid, color]) => (
            <marker key={mid} id={mid} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 1 L9 5 L0 9 z" fill={color} />
            </marker>
          ))}
        </defs>
        <rect width={width} height={height} fill={`url(#${id}-dots)`} />
        {children}
      </svg>
    </div>
  );
}

type DiagramProps = { label: string; locale: string };

function BBookArchitecture({ label }: DiagramProps) {
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

      <Arrow id={id} points={[[180, 49], [240, 49]]} accent />
      <Arrow id={id} points={[[440, 49], [590, 49], [590, 140]]} label="quotes" at={[598, 100]} anchor="start" accent />
      <Arrow id={id} points={[[180, 172], [240, 172]]} accent />
      <Arrow id={id} points={[[420, 172], [480, 172]]} accent />
      <Arrow id={id} points={[[590, 204], [590, 262]]} both />
      <Arrow id={id} points={[[500, 204], [410, 262]]} label="every transition" at={[395, 236]} anchor="end" />
      <Arrow id={id} points={[[240, 291], [180, 291]]} label="reads" at={[210, 283]} />
      <Arrow id={id} points={[[260, 78], [140, 140]]} dashed label="streaming" at={[150, 104]} anchor="end" />
    </Frame>
  );
}

function Mt5AccessRoutes({ label }: DiagramProps) {
  const id = 'mt5routes';
  return (
    <Frame id={id} width={720} height={300} label={label}>
      <Box x={20} y={115} w={170} h={70} title="Your backend" sub="any language · Linux" />
      <Box x={270} y={24} w={200} h={64} title="MT5 Web API" sub="HTTPS · JSON commands" sub2="one round trip per read" />
      <Box x={270} y={206} w={200} h={72} title="Windows service" sub="Manager API connection" sub2="pumped cache in memory" accent />
      <Box x={540} y={115} w={160} h={70} title="MT5 trade server" sub="one broker" />

      <Arrow id={id} points={[[190, 135], [270, 62]]} label="HTTPS per request" at={[226, 84]} anchor="end" />
      <Arrow id={id} points={[[470, 56], [540, 132]]} />
      <Arrow id={id} points={[[190, 165], [270, 236]]} label="HTTP · API key" at={[226, 220]} anchor="end" accent />
      <Arrow id={id} points={[[470, 242], [540, 168]]} label="manager login" at={[512, 226]} anchor="start" accent />
      <text x={370} y={150} textAnchor="middle" fontSize="11" fill={C.dim}>
        low-volume reads and writes
      </text>
      <text x={370} y={166} textAnchor="middle" fontSize="11" fill={C.dim}>
        above, fast reads and monitoring below
      </text>
    </Frame>
  );
}

function DepositToMt5Flow({ label }: DiagramProps) {
  const id = 'deposit';
  return (
    <Frame id={id} width={720} height={330} label={label}>
      <Box x={20} y={20} w={150} h={58} title="Payment provider" sub="webhook" n={1} />
      <Box x={198} y={20} w={150} h={58} title="Verify signature" sub="on the raw body" n={2} />
      <Box x={376} y={20} w={150} h={58} title="Store the event" sub="unique provider key" n={3} />
      <Box x={554} y={20} w={146} h={58} title="Credit row" sub="status: pending" n={4} />

      <Box x={20} y={136} w={150} h={58} title="Claim" sub="one atomic UPDATE" accent n={5} />
      <Box x={198} y={136} w={180} h={58} title="MT5 balance operation" sub="your reference" sub2="in the comment" n={6} />
      <Box x={554} y={136} w={146} h={58} title="Done" sub="deal ticket stored" n={7} />
      <Box x={198} y={248} w={180} h={58} title="Unknown" sub="look up the deal" sub2="by reference" dashed />
      <Box x={20} y={248} w={150} h={58} title="Reconciliation" sub="compares provider," sub2="credits and MT5" />

      <Arrow id={id} points={[[170, 49], [198, 49]]} accent />
      <Arrow id={id} points={[[348, 49], [376, 49]]} accent />
      <Arrow id={id} points={[[526, 49], [554, 49]]} accent />
      <Arrow id={id} points={[[627, 78], [627, 106], [95, 106], [95, 136]]} accent />
      <Arrow id={id} points={[[170, 165], [198, 165]]} accent />
      <Arrow id={id} points={[[378, 165], [554, 165]]} label="success" at={[466, 157]} accent />
      <Arrow id={id} points={[[288, 194], [288, 248]]} dashed label="timeout or crash" at={[296, 226]} anchor="start" />
      <Arrow id={id} points={[[378, 277], [627, 277], [627, 194]]} dashed label="deal found" at={[502, 269]} />
    </Frame>
  );
}

function InvestorPortalArchitecture({ label }: DiagramProps) {
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

      <Arrow id={id} points={[[160, 49], [205, 70]]} accent />
      <Arrow id={id} points={[[160, 123], [205, 102]]} accent />
      <Arrow id={id} points={[[355, 86], [400, 86]]} accent />
      <Arrow id={id} points={[[550, 86], [590, 86]]} accent />
      <Arrow id={id} points={[[645, 126], [645, 170], [475, 170], [475, 216]]} accent />
      <Arrow id={id} points={[[400, 251], [355, 251]]} label="posts once" at={[378, 206]} accent />
      <Arrow id={id} points={[[205, 251], [160, 251]]} accent />
      <Arrow id={id} points={[[590, 251], [550, 251]]} />
    </Frame>
  );
}

function LedgerEntries({ label }: DiagramProps) {
  const id = 'ledger';
  return (
    <Frame id={id} width={720} height={250} label={label}>
      <Box x={170} y={20} w={380} h={56} title="Transaction: card deposit" sub="idempotency key = provider event id" accent />
      <Box x={40} y={150} w={250} h={76} title="Provider clearing account" sub="entry: -100.00 USD" />
      <Box x={430} y={150} w={250} h={76} title="User wallet account" sub="entry: +100.00 USD" />

      <Arrow id={id} points={[[280, 76], [165, 150]]} accent />
      <Arrow id={id} points={[[440, 76], [555, 150]]} accent />
      <Arrow id={id} points={[[290, 188], [430, 188]]} label="100.00 USD" at={[360, 180]} />
      <text x={360} y={212} textAnchor="middle" fontSize="11" fill={C.dim}>
        entries sum to zero
      </text>
    </Frame>
  );
}

const RISK_TEXT = {
  en: { equity: 'Equity', limit: 'Loss limit', hourly: 'Hourly job', fast: 'Every few seconds', miss: 'both checks miss the breach', caught: 'caught on the next check', breach: 'breach', time: 'time →' },
  zh: { equity: '净值', limit: '亏损上限', hourly: '每小时任务', fast: '每几秒检查', miss: '两次检查都错过了违规', caught: '下一次检查即发现', breach: '违规', time: '时间 →' },
};

/** An illustrative equity line that dips below the loss limit between two hourly checks. */
function RiskCheckTiming({ label, locale }: DiagramProps) {
  const id = 'riskcheck';
  const t = locale === 'zh-CN' ? RISK_TEXT.zh : RISK_TEXT.en;
  const x0 = 170;
  const x1 = 700;
  const X = (u: number) => x0 + u * (x1 - x0);
  const limit = 132;
  const floor = 178;
  const path: [number, number][] = [
    [0, 62], [0.12, 70], [0.24, 84], [0.34, 96], [0.43, 142], [0.48, 158], [0.53, 152], [0.58, 112], [0.7, 80], [0.84, 90], [1, 68],
  ].map(([u, y]) => [X(u), y]);

  // Where the line crosses the limit, and the stretch below it.
  const crossings: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const [ax, ay] = path[i - 1];
    const [bx, by] = path[i];
    if ((ay - limit) * (by - limit) < 0) crossings.push(ax + ((limit - ay) / (by - ay)) * (bx - ax));
  }
  const [inX, outX] = crossings;
  const below: [number, number][] = [[inX, limit], ...path.filter(([px, py]) => px > inX && px < outX && py > limit), [outX, limit]];

  const hourly = [0.16, 0.82].map(X);
  const fast = Array.from({ length: 31 }, (_, i) => X(i / 30));
  const firstCatch = fast.find((fx) => fx > inX) ?? inX;
  const rowA = 218;
  const rowB = 258;

  return (
    <Frame id={id} width={720} height={300} label={label}>
      {/* Chart */}
      <line x1={x0} y1={floor} x2={x1} y2={floor} stroke={C.line} />
      <line x1={x0} y1={limit} x2={x1} y2={limit} stroke={C.bone} strokeOpacity={0.55} strokeDasharray="6 5" />
      <rect x={inX} y={limit} width={outX - inX} height={floor - limit} fill={C.signal} fillOpacity={0.09} />
      <polyline points={path.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.bone} strokeWidth={1.8} strokeLinejoin="round" />
      <polyline points={below.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.signal} strokeWidth={2.4} strokeLinejoin="round" />
      <text x={20} y={66} fontSize="12" fontWeight={600} fill={C.bone}>
        {t.equity}
      </text>
      <text x={20} y={136} fontSize="12" fontWeight={600} fill={C.bone}>
        {t.limit}
      </text>
      <Tag x={(inX + outX) / 2} y={floor - 8} text={t.breach} accent />
      <text x={x1} y={floor + 15} textAnchor="end" fontSize="10.5" fill={C.dim}>
        {t.time}
      </text>

      {/* Hourly job: two checks, both outside the dip */}
      <text x={20} y={rowA + 4} fontSize="11.5" fill={C.dim}>
        {t.hourly}
      </text>
      <line x1={x0} y1={rowA} x2={x1} y2={rowA} stroke={C.line} strokeOpacity={0.6} />
      {hourly.map((hx) => (
        <g key={hx}>
          <line x1={hx} y1={floor} x2={hx} y2={rowA} stroke={C.dim} strokeOpacity={0.35} strokeDasharray="2 4" />
          <circle cx={hx} cy={rowA} r={5} fill={C.fill} stroke={C.bone} strokeWidth={1.5} />
        </g>
      ))}
      <Tag x={(inX + outX) / 2} y={rowA + 4} text={t.miss} />

      {/* Monitor: a check every few seconds */}
      <text x={20} y={rowB + 4} fontSize="11.5" fill={C.signal}>
        {t.fast}
      </text>
      <line x1={x0} y1={rowB} x2={x1} y2={rowB} stroke={C.line} strokeOpacity={0.6} />
      {fast.map((fx) => {
        const inside = fx > inX && fx < outX;
        return <circle key={fx} cx={fx} cy={rowB} r={fx === firstCatch ? 5 : 2.6} fill={inside ? C.signal : C.dim} fillOpacity={inside ? 1 : 0.7} />;
      })}
      <line x1={firstCatch} y1={rowB - 6} x2={firstCatch} y2={limit + 4} stroke={C.signal} strokeOpacity={0.7} strokeDasharray="2 4" />
      <Tag x={firstCatch + 12} y={rowB + 26} text={t.caught} anchor="start" accent />
    </Frame>
  );
}

const LOCK_TEXT = {
  en: {
    a: ['Request A', 'read login 1001'],
    b: ['Request B', 'read login 1002'],
    lock: ['One lock', 'one SDK call at a time', 'connect and shutdown too'],
    cache: ['Pumped cache', 'Manager API'],
    check: ['Login check', 'returned = requested?'],
    use: ['Use the figures', 'run the risk rules'],
    skip: ['Skip and alert', 'no action taken'],
    waits: 'waits its turn',
    match: 'match',
    mismatch: 'mismatch',
  },
  zh: {
    a: ['请求 A', '读取账号 1001'],
    b: ['请求 B', '读取账号 1002'],
    lock: ['一把锁', '一次只执行一个 SDK 调用', '连接和关闭也加锁'],
    cache: ['推送缓存', 'Manager API'],
    check: ['账号校验', '返回 = 请求？'],
    use: ['使用数据', '执行风控规则'],
    skip: ['跳过并告警', '不做任何操作'],
    waits: '排队等待',
    match: '一致',
    mismatch: '不一致',
  },
};

/** Concurrent reads serialised behind one lock, then checked before anything acts on them. */
function SdkLockGuard({ label, locale }: DiagramProps) {
  const id = 'sdklock';
  const t = locale === 'zh-CN' ? LOCK_TEXT.zh : LOCK_TEXT.en;
  return (
    <Frame id={id} width={720} height={280} label={label}>
      <Box x={20} y={30} w={150} h={56} title={t.a[0]} sub={t.a[1]} />
      <Box x={20} y={150} w={150} h={56} title={t.b[0]} sub={t.b[1]} />
      <Box x={215} y={82} w={170} h={72} title={t.lock[0]} sub={t.lock[1]} sub2={t.lock[2]} accent />
      <Box x={418} y={88} w={120} h={60} title={t.cache[0]} sub={t.cache[1]} />
      <Box x={562} y={88} w={138} h={60} title={t.check[0]} sub={t.check[1]} accent />
      <Box x={562} y={200} w={138} h={56} title={t.use[0]} sub={t.use[1]} />
      <Box x={400} y={200} w={138} h={56} title={t.skip[0]} sub={t.skip[1]} dashed />

      <Arrow id={id} points={[[170, 58], [192, 58], [192, 108], [215, 108]]} accent />
      <Arrow id={id} points={[[170, 178], [192, 178], [192, 128], [215, 128]]} dashed />
      <Tag x={95} y={226} text={t.waits} />
      <Arrow id={id} points={[[385, 118], [418, 118]]} accent />
      <Arrow id={id} points={[[538, 118], [562, 118]]} accent />
      <Arrow id={id} points={[[640, 148], [640, 200]]} label={t.match} at={[648, 178]} anchor="start" accent />
      <Arrow id={id} points={[[590, 148], [590, 172], [469, 172], [469, 200]]} dashed label={t.mismatch} at={[530, 176]} />
    </Frame>
  );
}

const diagrams: Record<DiagramId, (props: DiagramProps) => ReactNode> = {
  'bbook-architecture': BBookArchitecture,
  'mt5-access-routes': Mt5AccessRoutes,
  'deposit-to-mt5-flow': DepositToMt5Flow,
  'investor-portal-architecture': InvestorPortalArchitecture,
  'ledger-entries': LedgerEntries,
  'risk-check-timing': RiskCheckTiming,
  'sdk-lock-guard': SdkLockGuard,
};

export function Diagram({ id, label, locale }: DiagramProps & { id: DiagramId }) {
  const Component = diagrams[id];
  return <Component label={label} locale={locale} />;
}
