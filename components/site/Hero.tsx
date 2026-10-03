import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { hero } = dict;
  return (
    <section id="top" data-hero className="relative flex flex-col overflow-hidden md:min-h-[88svh]">
      <div className="hero-bg absolute inset-0" aria-hidden="true">
        <canvas data-shader className="hero-canvas absolute inset-0 h-full w-full" />
      </div>
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="hero-fadeout absolute inset-x-0 bottom-0 h-48" aria-hidden="true" />

      <div
        data-hero-content
        className="gutter relative z-10 mx-auto flex w-full max-w-page flex-1 flex-col justify-end pb-14 pt-28 md:pb-[9vh] md:pt-32"
      >
        <p className="eyebrow hero-fade" style={i(0)}>
          {hero.eyebrow}
        </p>
        <h1 className="display-hero mt-6">
          {hero.lines.map((line, n) => (
            <span key={line} className="line-mask">
              <span className="hero-line whitespace-nowrap" style={i(n)}>
                {line}
              </span>
              {/* keeps the lines apart in the text search engines read */}
              {n < hero.lines.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
          <p className="hero-fade max-w-xl text-base leading-relaxed text-bone-2 md:col-span-7 md:text-lg lg:col-span-6" style={i(1)}>
            {hero.sub}
          </p>
          <div className="hero-fade flex flex-col gap-5 md:col-span-5 md:items-end lg:col-span-4 lg:col-start-9" style={i(2)}>
            <p className="eyebrow flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              {hero.status}
            </p>
            <a
              href="#work"
              data-magnetic
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-signal"
            >
              {hero.cta}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
            <Link href={`/${locale}/services`} className="link-underline eyebrow w-fit py-3 text-bone" data-magnetic>
              {hero.cta2} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
