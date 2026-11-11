import type { Dictionary } from '@/data/dictionary';

/** Ways to engage. No prices on purpose: each one is quoted after a first call. */
export function EngagementSection({ dict }: { dict: Dictionary }) {
  const { engagement: copy } = dict;
  return (
    <section id="engagement" className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">{copy.label}</p>
          <div className="lg:col-span-8">
            <h2 className="display-xl">{copy.title}</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-bone-2">{copy.intro}</p>
          </div>
        </div>

        <ol className="mt-14 grid gap-5 md:mt-16 md:grid-cols-2">
          {copy.models.map((m, n) => (
            <li key={m.title} className="flex flex-col rounded-[1.25rem] border border-line bg-ink-2/60 p-7 md:p-9" data-reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <span className="font-mono text-xs text-signal">0{n + 1}</span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone-3">{m.tag}</span>
              </div>
              <h3 className="mt-4 font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight tracking-[-0.015em]">{m.title}</h3>
              <p className="mt-3 leading-relaxed text-bone-2">{m.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 lg:grid-cols-12" data-reveal>
          <p className="max-w-2xl leading-relaxed text-bone lg:col-span-7">{copy.pricing}</p>
          <ul className="space-y-2.5 text-bone-2 lg:col-span-4 lg:col-start-9">
            {copy.principles.map((p) => (
              <li key={p} className="flex gap-4 leading-relaxed">
                <span className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
