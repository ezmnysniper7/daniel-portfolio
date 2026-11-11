import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const ink = '#090b10';
const bone = '#efebe3';
const dim = '#9a978f';
const signal = '#2ee6f9';

// A small system graph in the corner: the site's motif, not a logo.
const nodes: [number, number, boolean][] = [
  [60, 150, false],
  [170, 60, true],
  [300, 130, false],
  [210, 230, false],
  [360, 250, true],
  [120, 300, false],
];
const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [0, 3],
];

/**
 * One share image for every page: what the page is, its title, and the site.
 * Text is always English: the bundled font has no Chinese glyphs.
 */
export function renderOg({ kind, title, footer }: { kind: string; title: string; footer?: string }) {
  const size = title.length <= 30 ? 84 : title.length <= 56 ? 68 : title.length <= 90 ? 56 : 46;
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 68px',
          backgroundColor: ink,
          backgroundImage: 'radial-gradient(circle at 88% 10%, rgba(46,230,249,0.20), transparent 42%), radial-gradient(circle at 5% 100%, rgba(30,70,110,0.55), transparent 48%)',
          color: bone,
        }}
      >
        <svg width="300" height="257" viewBox="0 0 420 360" style={{ position: 'absolute', right: 44, bottom: 96, opacity: 0.5 }}>
          {edges.map(([a, b], n) => (
            <line key={n} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#5b6472" strokeWidth="1.5" />
          ))}
          {nodes.map(([x, y, hub], n) => (
            <circle key={n} cx={x} cy={y} r={hub ? 9 : 6} fill={hub ? signal : bone} />
          ))}
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, letterSpacing: 5, textTransform: 'uppercase' }}>
          <div style={{ display: 'flex' }}>
            <span>Daniel Chen</span>
            <span style={{ color: dim, marginLeft: 14 }}>/ builds</span>
          </div>
          <span style={{ color: signal }}>{kind}</span>
        </div>

        <div style={{ display: 'flex', fontSize: size, lineHeight: 1.06, letterSpacing: -2, maxWidth: 800 }}>{title}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, color: dim }}>
          <span style={{ color: bone }}>danielchenbuilds.com</span>
          <span>{footer ?? 'MT5 integrations · Trading platforms · Payment systems'}</span>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
