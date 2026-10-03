'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type MotionModule = typeof import('@/lib/motion');

let motion: MotionModule | null = null;

/**
 * Loads the motion layer after first paint so the page is readable (and the LCP is
 * done) before any animation code arrives. It starts on the first interaction, or
 * shortly after load once the intro has played. Reduced motion: never loads.
 */
export function MotionBoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const events = ['wheel', 'touchstart', 'pointerdown', 'pointermove', 'keydown', 'scroll'] as const;

    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      clearTimeout(timer);
      const ready = motion ? Promise.resolve(motion) : import('@/lib/motion');
      ready.then((m) => {
        motion = m;
        // Wait a frame so the new route's DOM is committed and laid out.
        requestAnimationFrame(() => {
          if (!cancelled) teardown = m.mountPage();
        });
      });
    };
    const onLoad = () => {
      timer = setTimeout(start, 1200);
    };

    if (motion) {
      start();
    } else {
      events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
      if (document.readyState === 'complete') onLoad();
      else window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      clearTimeout(timer);
      teardown?.();
    };
  }, [pathname]);

  return null;
}
