import type { Dictionary } from '@/data/dictionary';

export function StatsSection({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { stats } = dict;
  const fmt = new Intl.NumberFormat(locale === 'zh-CN' ? 'zh-CN' : 'en-US');
  return (
    <section id="numbers" className="border-t border-line py-24 md:py-36">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">
            <span className="text-signal">{stats.index}</span> / {stats.label}
          </p>
          <h2 className="display-xl lg:col-span-8" data-split>
            {stats.title}
          </h2>
        </div>
        <dl className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
          {stats.items.map((s) => {
            const final = fmt.format(s.value);
            return (
              <div key={s.label} className="flex flex-col-reverse border-b border-line py-9 sm:pr-8 md:py-12" data-reveal>
                <dt className="mt-4">
                  <span className="block text-bone">{s.label}</span>
                  <span className="mt-1 block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-bone-3">{s.note}</span>
                </dt>
                <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.04em] tabular-nums">
                  {s.prefix ? <span className="text-bone-3">{s.prefix}</span> : null}
                  <span
                    data-count={s.value}
                    className="inline-block"
                    style={{ minWidth: `${final.length * 0.62}em` }}
                  >
                    {final}
                  </span>
                  {s.suffix ?? null}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
