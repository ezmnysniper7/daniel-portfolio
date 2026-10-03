import type { Dictionary } from '@/data/dictionary';

export function StatsSection({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { stats } = dict;
  const fmt = new Intl.NumberFormat(locale === 'zh-CN' ? 'zh-CN' : 'en-US');
  return (
    <section id="numbers" className="py-20 md:py-28">
      <div className="gutter mx-auto max-w-page">
        <p className="eyebrow">{stats.label}</p>
        <dl className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {stats.items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-3">
                <span className="block text-bone">{s.label}</span>
                <span className="mt-1 block font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone-3">{s.note}</span>
              </dt>
              <dd className="font-display text-[clamp(2.75rem,4.5vw,4.25rem)] leading-none tracking-[-0.03em] tabular-nums">
                {s.prefix ? <span className="text-bone-3">{s.prefix}</span> : null}
                {fmt.format(s.value)}
                {s.suffix ?? null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
