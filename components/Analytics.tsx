'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { track } from '@/lib/track';

/**
 * On for the production site (next.config.js sets NEXT_PUBLIC_ANALYTICS=vercel there), off locally and on previews.
 * Web Analytics must also be enabled for the project in Vercel, or the script is not served.
 * Pageviews come from Vercel's script; this adds the few events worth knowing about:
 * clicks on anything marked data-track, and email, WhatsApp and LinkedIn clicks.
 */
export function Analytics() {
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS === 'vercel';

  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('a, button');
      if (!el) return;
      const page = window.location.pathname;
      const name = el.dataset.track;
      if (name) return track(name, { page });
      const href = el.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) return track('email_click', { page });
      if (href.includes('wa.me/')) return track('whatsapp_click', { page });
      if (href.includes('linkedin.com')) return track('linkedin_click', { page });
      // Moving from a service page to its evidence is the journey that matters most.
      if (page.includes('/services/') && href.includes('/work/')) return track('service_to_case_study', { page, to: href });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <Script id="va-init" strategy="afterInteractive">
        {`window.va = window.va || function () { (window.vaq = window.vaq || []).push([].slice.call(arguments)); };`}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
