/** Line illustrations for services and highlights: inline SVG, inherits the text colour. */
type IconName = 'chart' | 'card' | 'browser' | 'phone' | 'servers' | 'search' | 'layers' | 'send';

const paths: Record<IconName, React.ReactNode> = {
  // candlesticks on a baseline
  chart: (
    <>
      <path d="M3 21h18" />
      <path d="M7 4v3M7 13v4" />
      <rect x="5.5" y="7" width="3" height="6" rx="0.6" />
      <path d="M12 7v3M12 16v3" />
      <rect x="10.5" y="10" width="3" height="6" rx="0.6" />
      <path d="M17 3v2M17 10v3" />
      <rect x="15.5" y="5" width="3" height="5" rx="0.6" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19" />
      <rect x="5.5" y="13" width="4" height="3" rx="0.6" />
      <path d="M14 15h4" />
    </>
  ),
  browser: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M2.5 8.5h19" />
      <circle cx="5.5" cy="6.25" r="0.6" />
      <circle cx="7.75" cy="6.25" r="0.6" />
      <path d="M6 12.5h6M6 15.5h9" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
      <path d="M9.5 7h5M9.5 10h3" />
    </>
  ),
  servers: (
    <>
      <rect x="3" y="3.5" width="18" height="7" rx="1.8" />
      <rect x="3" y="13.5" width="18" height="7" rx="1.8" />
      <circle cx="7" cy="7" r="0.7" />
      <circle cx="7" cy="17" r="0.7" />
      <path d="M11 7h6M11 17h6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
      <path d="M8 10.5h5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 10 14" />
      <path d="m21 3-7 18-4-7-7-4z" />
    </>
  ),
};

export function Icon({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const serviceIcons: Record<string, IconName> = {
  'crypto-trading-systems': 'chart',
  'payment-integration': 'card',
  'web-development': 'browser',
  'mobile-app-development': 'phone',
  'backend-development': 'servers',
};

export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  return <Icon name={serviceIcons[slug] ?? 'servers'} className={className} />;
}

/** Icons for the four "Now" highlights, in order: payments, debugging, building, shipping. */
export const NOW_ICONS: IconName[] = ['card', 'search', 'layers', 'send'];
