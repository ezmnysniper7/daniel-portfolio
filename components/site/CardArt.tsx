/**
 * Project visuals drawn with CSS and inline SVG: no image requests, crisp at any size.
 */
export function CardArt({ slug, className = '' }: { slug: string; className?: string }) {
  return (
    <div className={`art ${className}`} aria-hidden="true">
      <div className={`absolute inset-0 ${bgFor(slug)}`}>
        {svgFor(slug)}
      </div>
    </div>
  );
}

function bgFor(slug: string) {
  switch (slug) {
    case 'solvemy':
      return 'art-map';
    case 'tradersflow':
      return 'art-chart';
    case 'dan':
      return 'art-grid';
    case 'octopus-payment-microservice':
      return 'art-rings';
    case 'ocean-park-ticketing':
      return 'art-lines';
    default:
      return 'art-route';
  }
}

const stroke = 'hsl(187 96% 58%)';
const bone = 'hsl(40 30% 92%)';

function svgFor(slug: string) {
  switch (slug) {
    case 'solvemy':
      return (
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="125" r="78" fill="none" stroke={stroke} strokeOpacity="0.55" strokeDasharray="3 6" />
          <circle cx="200" cy="125" r="40" fill="none" stroke={stroke} strokeOpacity="0.3" />
          <path d="M200 102c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill={bone} />
          <circle cx="200" cy="118" r="5" fill="hsl(224 30% 5%)" />
        </svg>
      );
    case 'tradersflow':
      return (
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="196" x2="400" y2="196" stroke={bone} strokeOpacity="0.5" strokeDasharray="4 6" />
          <polyline
            points="0,150 30,138 60,146 90,118 120,126 150,98 180,108 210,84 240,96 270,124 300,158 330,184 352,200 380,210 400,214"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="352" cy="200" r="5" fill={bone} />
        </svg>
      );
    case 'dan':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[9rem] leading-none text-bone/90 md:text-[11rem]">蛋</span>
        </div>
      );
    case 'octopus-payment-microservice':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-signal/60 px-4 py-2 font-mono text-xs tracking-[0.2em] text-signal">
            HMAC-SHA256
          </span>
        </div>
      );
    case 'ocean-park-ticketing':
      return (
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {[0, 1, 2, 3].map((n) => (
            <path
              key={n}
              d={`M0 ${110 + n * 22} C 70 ${80 + n * 22}, 130 ${140 + n * 22}, 200 ${110 + n * 22} S 330 ${80 + n * 22}, 400 ${110 + n * 22}`}
              fill="none"
              stroke={n === 1 ? stroke : bone}
              strokeOpacity={n === 1 ? 0.9 : 0.25}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M80 175 C 140 60, 200 220, 250 120 S 320 60, 320 75"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
          <circle cx="80" cy="175" r="5" fill={bone} />
          <circle cx="250" cy="120" r="4" fill={stroke} />
          <circle cx="320" cy="75" r="5" fill={bone} />
        </svg>
      );
  }
}
