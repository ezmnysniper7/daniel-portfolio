import type { CSSProperties, ReactNode } from 'react';

/**
 * Project pictures: small labelled diagrams of what each system does, drawn in inline SVG
 * (no image requests, crisp at any size, same visual language as the hero graph and the article diagrams).
 * Every claim in a picture comes from that project's case study.
 */
export function CardArt({ slug, locale = 'en', className = '' }: { slug: string; locale?: string; className?: string }) {
  const zh = locale === 'zh-CN';
  return (
    <div className={`art ${className}`} aria-hidden="true">
      <div className={`absolute inset-0 ${bgFor(slug)}`}>{svgFor(slug, zh)}</div>
    </div>
  );
}

function bgFor(slug: string) {
  switch (slug) {
    case 'tradersflow':
      return 'art-chart';
    case 'dan':
      return 'art-grid';
    case 'cfi-broker-payments-crypto-backend':
    case 'octopus-payment-microservice':
    case 'solvemy':
    case 'ocean-park-ticketing':
      return 'art-plain';
    default:
      return 'art-route';
  }
}

const signal = 'hsl(187 96% 58%)';
const bone = 'hsl(40 30% 92%)';
const text = 'hsl(40 10% 80%)';
const dim = 'hsl(220 9% 64%)';
const ink = 'hsl(224 30% 5%)';

const frame = 'absolute inset-0 h-full w-full';
const travel = (px: number) => ({ '--travel': `${px}px` }) as CSSProperties;

type LabelProps = { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; fill?: string };
function Label({ x, y, children, anchor = 'middle', size = 13, fill = text }: LabelProps) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} className="font-mono">
      {children}
    </text>
  );
}

function Box({ x, y, w, h, accent = false }: { x: number; y: number; w: number; h: number; accent?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx="10" fill={ink} fillOpacity="0.7" stroke={accent ? signal : bone} strokeOpacity={accent ? 0.9 : 0.5} />;
}

function svgFor(slug: string, zh: boolean) {
  switch (slug) {
    // Every account is checked against its loss limit about every 5 seconds; a breach is caught at the line.
    case 'tradersflow':
      return (
        <>
          <svg viewBox="0 0 400 250" className={frame} preserveAspectRatio="xMidYMid meet">
            <line x1="20" y1="178" x2="380" y2="178" stroke={bone} strokeOpacity="0.55" strokeDasharray="4 6" />
            <Label x={20} y={170} anchor="start" fill={dim}>
              {zh ? '亏损上限' : 'loss limit'}
            </Label>
            <Label x={20} y={98} anchor="start" fill={dim}>
              {zh ? '账户净值' : 'equity'}
            </Label>
            {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320].map((x) => (
              <line key={x} x1={x} y1="216" x2={x} y2="224" stroke={x === 320 ? signal : dim} strokeOpacity={x === 320 ? 1 : 0.6} strokeWidth={x === 320 ? 2 : 1} />
            ))}
            <Label x={20} y={243} anchor="start" size={12} fill={dim}>
              {zh ? '约每 5 秒检查一次' : 'checked about every 5 s'}
            </Label>
          </svg>
          <svg viewBox="0 0 400 250" className={`art-wipe ${frame}`} preserveAspectRatio="xMidYMid meet">
            <polyline
              points="20,120 50,108 80,116 110,90 140,98 170,72 200,82 230,60 260,84 290,128 320,178"
              fill="none"
              stroke={signal}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="320" cy="178" r="9" fill={signal} fillOpacity="0.2" />
            <circle cx="320" cy="178" r="4.5" fill={bone} />
            <Label x={308} y={200} anchor="end" fill={bone}>
              {zh ? '上报违规' : 'breach reported'}
            </Label>
          </svg>
        </>
      );

    // The client portal and the back office each own their data and exchange changes as RabbitMQ messages;
    // three wallet methods are live as deposit methods through Checkout.com.
    case 'cfi-broker-payments-crypto-backend': {
      const pills: [string, number, number][] = [
        ['Apple Pay', 24, 82],
        ['Google Pay', 114, 88],
        ['Benefit', 210, 68],
      ];
      return (
        <svg viewBox="0 -10 400 250" className={frame} preserveAspectRatio="xMidYMid meet">
          <line x1="152" y1="62" x2="248" y2="62" stroke={signal} strokeOpacity="0.7" strokeDasharray="3 6" />
          <Box x={24} y={36} w={128} h={52} />
          <Label x={88} y={67}>{zh ? '客户门户' : 'Client portal'}</Label>
          <Box x={248} y={36} w={128} h={52} />
          <Label x={312} y={67}>{zh ? '后台系统' : 'Back office'}</Label>
          <circle cx="200" cy="62" r="15" fill={ink} stroke={signal} />
          <circle cx="200" cy="62" r="4" fill={signal} />
          <Label x={200} y={100} size={12} fill={signal}>
            RabbitMQ
          </Label>
          <circle className="art-packet" style={travel(88)} cx="156" cy="62" r="3.5" fill={signal} />

          <path d="M88 150 V96 M82 104 l6 -8 6 8" fill="none" stroke={bone} strokeOpacity="0.5" />
          {pills.map(([name, x, w]) => (
            <g key={name}>
              <rect x={x} y={150} width={w} height={28} rx="14" fill={ink} fillOpacity="0.7" stroke={bone} strokeOpacity="0.4" />
              <Label x={x + w / 2} y={168} size={12}>
                {name}
              </Label>
            </g>
          ))}
          <Label x={24} y={206} anchor="start" size={12} fill={dim}>
            {zh ? '通过 Checkout.com 入金' : 'deposits via Checkout.com'}
          </Label>
        </svg>
      );
    }

    // Every request is signed with HMAC-SHA256; a captured request cannot be sent again.
    case 'octopus-payment-microservice':
      return (
        <svg viewBox="0 0 400 250" className={frame} preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0 24)">
          <rect x="134" y="22" width="132" height="30" rx="15" fill="none" stroke={signal} strokeOpacity="0.6" />
          <text x="200" y="42" textAnchor="middle" fontSize="12" fill={signal} letterSpacing="2" className="font-mono">
            HMAC-SHA256
          </text>

          <Box x={20} y={84} w={100} h={96} />
          <Label x={70} y={137}>{zh ? '商户' : 'Merchant'}</Label>
          <Box x={280} y={84} w={100} h={96} accent />
          <Label x={330} y={137}>{zh ? '支付网关' : 'Gateway'}</Label>

          <Label x={200} y={100} size={12}>
            {zh ? '签名请求' : 'signed request'}
          </Label>
          <path d="M120 110 H278 M270 104 l8 6 -8 6" fill="none" stroke={signal} />
          <circle className="art-packet" style={travel(150)} cx="124" cy="110" r="3.5" fill={signal} />

          <path d="M120 154 H250" fill="none" stroke={dim} strokeDasharray="4 5" />
          <path d="M255 148 l12 12 M267 148 l-12 12" fill="none" stroke={bone} strokeWidth="1.5" />
          <Label x={194} y={176} size={12} fill={dim}>
            {zh ? '重放请求被拒绝' : 'replay rejected'}
          </Label>
          </g>
        </svg>
      );

    // One Go service behind a website and two mobile apps.
    case 'solvemy':
      return (
        <svg viewBox="0 0 400 250" className={frame} preserveAspectRatio="xMidYMid meet">
          <rect x="42" y="34" width="88" height="58" rx="6" fill={ink} fillOpacity="0.7" stroke={bone} strokeOpacity="0.5" />
          <path d="M42 46 H130" stroke={bone} strokeOpacity="0.5" />
          <rect x="179" y="28" width="42" height="68" rx="8" fill={ink} fillOpacity="0.7" stroke={bone} strokeOpacity="0.5" />
          <rect x="293" y="28" width="42" height="68" rx="8" fill={ink} fillOpacity="0.7" stroke={bone} strokeOpacity="0.5" />
          <Label x={86} y={114}>{zh ? '网站' : 'Web'}</Label>
          <Label x={200} y={114}>Android</Label>
          <Label x={314} y={114}>iOS</Label>

          <path className="art-march" d="M86 124 L160 170 M200 124 V170 M314 124 L240 170" fill="none" stroke={signal} strokeOpacity="0.75" strokeDasharray="3 6" />
          <Box x={104} y={170} w={192} h={56} accent />
          <Label x={200} y={194} fill={bone}>
            {zh ? '一个 Go 服务' : 'One Go service'}
          </Label>
          <Label x={200} y={213} size={12} fill={dim}>
            PostgreSQL + PostGIS
          </Label>
        </svg>
      );

    // A ticket order, an Octopus payment, then automated reconciliation.
    case 'ocean-park-ticketing':
      return (
        <svg viewBox="0 0 400 250" className={`art-wipe ${frame}`} preserveAspectRatio="xMidYMid meet">
          <Box x={12} y={92} w={110} h={60} />
          <Label x={67} y={127} size={12}>
            {zh ? '门票订单' : 'Ticket order'}
          </Label>
          <path d="M122 122 H142 M136 117 l6 5 -6 5" fill="none" stroke={signal} />
          <Box x={144} y={92} w={124} h={60} />
          <Label x={206} y={127} size={12}>
            {zh ? '八达通支付' : 'Octopus payment'}
          </Label>
          <path d="M268 122 H288 M282 117 l6 5 -6 5" fill="none" stroke={signal} />
          <Box x={290} y={92} w={98} h={60} accent />
          <Label x={339} y={127} size={12} fill={bone}>
            {zh ? '自动对账' : 'Reconciled'}
          </Label>
          <Label x={339} y={174} size={11} fill={dim}>
            {zh ? '与票务系统核对' : 'matched with TAS'}
          </Label>
        </svg>
      );

    case 'dan':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[9rem] leading-none text-bone/90 md:text-[11rem]">蛋</span>
        </div>
      );

    default:
      return (
        <svg viewBox="0 0 400 250" className={frame} preserveAspectRatio="xMidYMid slice">
          <path d="M80 175 C 140 60, 200 220, 250 120 S 320 60, 320 75" fill="none" stroke={signal} strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
          <circle cx="80" cy="175" r="5" fill={bone} />
          <circle cx="250" cy="120" r="4" fill={signal} />
          <circle cx="320" cy="75" r="5" fill={bone} />
        </svg>
      );
  }
}
