import type { Dictionary } from '@/data/dictionary';

export function MethodSection({ dict }: { dict: Dictionary }) {
  const { method } = dict;
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="gutter mx-auto max-w-page">
        <p className="eyebrow">
          <span className="text-signal">{method.index}</span> / {method.label}
        </p>
        <ol className="mt-12 md:mt-16">
          {method.items.map((m, n) => (
            <li key={m.title} className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:items-baseline md:py-10" data-reveal>
              <span className="font-mono text-xs text-signal md:col-span-1">0{n + 1}</span>
              <h3 className="display-lg md:col-span-6">{m.title}</h3>
              <p className="max-w-md leading-relaxed text-bone-2 md:col-span-5">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
