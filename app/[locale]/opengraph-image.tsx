import { ImageResponse } from 'next/og';
import { siteMetadata } from '@/data/metadata';

export const alt = `${siteMetadata.name}: software engineer for crypto, trading, payments, websites and apps`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#090b10',
          backgroundImage:
            'radial-gradient(circle at 78% 22%, rgba(19,152,173,0.55), transparent 45%), radial-gradient(circle at 12% 92%, rgba(18,58,86,0.8), transparent 50%)',
          color: '#efebe3',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: '#a9a49b' }}>
          Daniel Chen · Senior Backend Engineer
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 96, lineHeight: 1, letterSpacing: -3 }}>
          <span>Backend systems</span>
          <span>for money that</span>
          <span style={{ color: '#2ee6f9' }}>has to add up.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#a9a49b' }}>
          <span>Crypto & trading systems · Payments · Websites & apps · Kuala Lumpur</span>
          <span style={{ color: '#efebe3' }}>Open to projects and roles</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
