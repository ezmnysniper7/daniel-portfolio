'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
  label: string;
  closeLabel: string;
  links: { href: string; label: string }[];
};

/** Phones only: the header has room for one link, so the rest of the site sits behind this button. */
export function MobileMenu({ label, closeLabel, links }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap uppercase text-bone"
      >
        <span aria-hidden="true" className="relative block h-2.5 w-4">
          <span className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
          <span className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
        </span>
        {open ? closeLabel : label}
      </button>
      {open ? (
        <div id="site-menu" className="absolute inset-x-0 top-full border-y border-line bg-ink">
          <ul className="gutter py-2">
            {links.map((l) => (
              <li key={l.href} className="border-b border-line last:border-b-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center justify-between font-sans text-lg normal-case tracking-normal text-bone"
                >
                  {l.label}
                  <span aria-hidden="true" className="text-bone-3">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
