import type { Dictionary } from '@/data/dictionary';

/** Ways to engage. No prices on purpose: each one is quoted after a first call. */
export function EngagementSection({ dict }: { dict: Dictionary }) {
  const { engagement: copy } = dict;
  return (
    <section id="engagement" className="border-t border-line py-20 md:py-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-4">{copy.label}</p>
          <div className="lg:col-span-8">
            <h2 className="display-xl">{copy.title}</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-bone-2">{copy.intro}</p>
          </div>
        </div>

        {/* Plain rows, not boxes: four options to read, nothing to decode. */}
        <ul className="mt-12 grid gap-x-12 border-t border-line md:mt-16 md:grid-cols-2">
          {copy.models.map((m) => (
            <li key={m.title} className="border-b border-line py-7">
              <h3 className="font-display text-[clamp(1.3rem,1.75vw,1.65rem)] leading-tight tracking-[-0.015em]">{m.title}</h3>
              <p className="mt-1.5 text-sm text-bone-3">{m.tag}</p>
              <p className="mt-3 leading-relaxed text-bone-2">{m.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
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
