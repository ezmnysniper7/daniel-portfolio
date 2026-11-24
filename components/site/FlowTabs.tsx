'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The controls for the hero's system graph: pick a message flow and watch it travel.
 * The WebGL scene listens for the choice; without WebGL the static graph highlights the same path in CSS.
 */
export function FlowTabs({ ids, captions, label }: { ids: string[]; captions: string[]; label: string }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  // "Deposit: client app → API" becomes a button name and a path.
  const flows = captions.map((c) => {
    const [name, ...rest] = c.split(/[:：]\s*/);
    return { name, path: rest.join(': ') };
  });

  // The scene cycles through the flows on its own; follow it.
  useEffect(() => {
    const onChange = (e: Event) => setActive((e as CustomEvent<number>).detail);
    window.addEventListener('system:flowchange', onChange);
    return () => window.removeEventListener('system:flowchange', onChange);
  }, []);

  useEffect(() => {
    ref.current?.closest<HTMLElement>('[data-system]')?.setAttribute('data-flow', ids[active]);
  }, [active, ids]);

  return (
    <div ref={ref} className="flow-tabs">
      <div role="group" aria-label={label} className="flex flex-wrap gap-x-5 gap-y-1">
        {flows.map((f, n) => (
          <button
            key={ids[n]}
            type="button"
            aria-pressed={n === active}
            onClick={() => {
              setActive(n);
              window.dispatchEvent(new CustomEvent('system:flow', { detail: n }));
            }}
            className="flow-tab"
          >
            {f.name}
          </button>
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.75rem] leading-relaxed text-bone-3" aria-live="polite">
        {flows[active]?.path}
      </p>
    </div>
  );
}
