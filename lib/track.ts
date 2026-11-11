/**
 * Privacy-friendly event tracking. Sends to Vercel Web Analytics when it is enabled
 * (no cookies, no personal data); otherwise does nothing.
 */
type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    va?: (event: 'event' | 'beforeSend' | 'pageview', properties?: unknown) => void;
  }
}

export function track(name: string, props?: Props) {
  if (typeof window === 'undefined') return;
  try {
    window.va?.('event', { name, data: props });
  } catch {
    // Analytics must never break the page.
  }
}
