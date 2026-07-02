import { PropertyMeta } from '@/types';

/**
 * Property-agent profile. PLACEHOLDER VALUES, Daniel to update:
 *  - renNumber: real REN/agency registration number
 *  - agency: agency name (if any)
 *  - whatsapp: digits-only intl number used for wa.me links
 */
export const propertyMeta: PropertyMeta = {
  name: 'Daniel Chen',
  renNumber: 'Available on request', // TODO: add real REN number
  agency: '', // TODO: agency name (optional)
  areas: ['Kuala Lumpur', 'Petaling Jaya', 'Mont Kiara', 'Bangsar', 'Subang Jaya', 'Cyberjaya'],
  languages: ['English', '中文', 'Bahasa Malaysia'],
  whatsapp: '601172603063', // wa.me format (no '+'); from +60 11 7260 3063
  email: 'chendaniel150701@gmail.com',
  phone: '+601172603063',
};

/** Build a wa.me link with an optional pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${propertyMeta.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
