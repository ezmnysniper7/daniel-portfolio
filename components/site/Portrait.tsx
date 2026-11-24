import { siteMetadata } from '@/data/metadata';

const base = '/images/daniel-chen-qi-rong';

/** The headshot, served as AVIF or WebP with a JPEG fallback, at the size the layout needs. */
export function Portrait({ locale, size, className = '' }: { locale: string; size: 'large' | 'small'; className?: string }) {
  const [one, two] = size === 'large' ? [320, 640] : [112, 320];
  const alt = locale === 'zh-CN' ? `${siteMetadata.nameZh} ${siteMetadata.name}` : siteMetadata.fullName;
  const set = (ext: string) => `${base}-${one}.${ext} 1x, ${base}-${two}.${ext} 2x`;
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} />
      <source type="image/webp" srcSet={set('webp')} />
      <img src={`${base}-${two}.jpg`} alt={alt} width={one} height={one} decoding="async" className={className} />
    </picture>
  );
}
