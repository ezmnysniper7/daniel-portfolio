import type { Dictionary } from '@/data/dictionary';

export function ToolboxSection({ dict }: { dict: Dictionary }) {
  const { toolbox } = dict;
  return (
    <section className="gutter mx-auto max-w-page border-t border-line py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 className="eyebrow lg:col-span-3">{toolbox.label}</h2>
        <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-9">
          {toolbox.groups.map((g) => (
            <div key={g.name} className="border-t border-line pt-4" data-reveal>
              <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-bone-2">{g.name}</dt>
              <dd className="mt-2 leading-relaxed text-bone">{g.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
