'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Rental } from '@/types';
import { Card } from '@/components/ui/Card';
import { WhatsAppButton } from './WhatsAppButton';

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-line bg-paper-2/40 py-2.5">
      <span className="text-accent">{icon}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-ink-3">{label}</span>
    </div>
  );
}

export function RentalCard({ rental }: { rental: Rental }) {
  const t = useTranslations('property.featured');
  const beds = rental.bedrooms === 0 ? 'Studio' : String(rental.bedrooms);

  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      {/* Image / placeholder */}
      <div className="relative aspect-[16/11] overflow-hidden border-b border-line bg-gradient-to-br from-accent/10 via-paper-2 to-accent-2/10">
        {rental.imageUrl ? (
          <Image
            src={rental.imageUrl}
            alt={rental.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 90 50" className="h-16 w-28 opacity-50" fill="none" aria-hidden="true">
              <path d="M45 8 18 28v18h54V28L45 8Z" stroke="hsl(var(--accent))" strokeWidth="1.6" strokeLinejoin="round" />
              <rect x="38" y="34" width="14" height="12" stroke="hsl(var(--accent-2))" strokeWidth="1.4" />
            </svg>
          </div>
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
          {t('forRent')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-3">{rental.propertyType}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          {rental.title}
        </h3>
        <p className="mt-1 text-sm text-ink-2">{rental.area}</p>

        <p className="mt-4 font-display text-3xl font-semibold text-accent">
          {rental.currency ?? 'RM'} {rental.monthlyRent.toLocaleString()}
          <span className="ml-1 text-base font-normal text-ink-3">{t('perMonth')}</span>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Spec
            label={t('beds')}
            value={beds}
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12V7a2 2 0 012-2h14a2 2 0 012 2v5m-18 0v5m18-5v5M6 12V9h12v3" />
              </svg>
            }
          />
          <Spec
            label={t('baths')}
            value={String(rental.bathrooms)}
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM7 12V6a2 2 0 012-2 2 2 0 012 2" />
              </svg>
            }
          />
          <Spec
            label={t('size')}
            value={`${rental.sizeSqft.toLocaleString()}`}
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
              </svg>
            }
          />
        </div>

        {rental.tags && rental.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {rental.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-paper-2/40 px-2.5 py-1 text-xs text-ink-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex-1" />
        <WhatsAppButton
          message={`Hi Daniel, I'm interested in "${rental.title}" (${rental.area}). Is it still available?`}
          label={t('enquire')}
          size="sm"
          className="w-full"
        />
      </div>
    </Card>
  );
}
