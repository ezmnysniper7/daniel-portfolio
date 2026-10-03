import type { Dictionary } from '@/data/dictionary';

/**
 * Without JS this is a sticky intro next to a list of chapters.
 * On desktop with motion allowed, the motion layer pins the frame and
 * scrubs through the chapters while a message travels the queue.
 */
export function NowSection({ dict }: { dict: Dictionary }) {
  const { now } = dict;
  return (
    <section id="now" data-now className="relative border-t border-line">
      <div data-now-frame className="gutter mx-auto w-full max-w-page py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
            <p className="eyebrow">
              <span className="text-signal">{now.index}</span> / {now.label}
            </p>
            <h2 className="display-lg mt-6 text-[clamp(2.2rem,4.4vw,4.4rem)]" data-split>
              {now.title}
            </h2>
            <p className="mt-7 max-w-md leading-relaxed text-bone-2" data-reveal>
              {now.intro}
            </p>
            <p className="eyebrow mt-6" data-reveal>
              {now.since}
            </p>

            <div className="mt-12 max-w-md" data-reveal aria-hidden="true">
              <div className="flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.16em] text-bone-2">
                <span>{now.bus[0]}</span>
                <span className="text-signal">{now.bus[1]}</span>
                <span>{now.bus[2]}</span>
              </div>
              <div data-now-bus className="relative mt-3 h-px bg-line">
                <span className="absolute -top-1 left-0 h-2 w-px bg-bone-3" />
                <span className="absolute -top-1 left-1/2 h-2 w-px bg-signal" />
                <span className="absolute -top-1 right-0 h-2 w-px bg-bone-3" />
                <span data-now-dot className="now-dot absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-signal shadow-[0_0_14px_hsl(187_96%_58%/0.8)]" />
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:col-span-6 lg:col-start-7">
            <div className="now-progress-track relative hidden w-px shrink-0 bg-line" aria-hidden="true">
              <span data-now-progress className="now-progress absolute inset-0 bg-signal" />
            </div>
            <ol className="now-stage flex-1">
              {now.chapters.map((c, n) => (
                <li key={c.kicker} data-now-chapter className="now-chapter border-t border-line pb-14 pt-8 first:border-t-0 first:pt-0">
                  <p className="eyebrow">
                    <span className="text-signal">0{n + 1}</span>
                    <span className="mx-2 text-bone-3">/</span>
                    {c.kicker}
                  </p>
                  <h3 className="display-lg mt-5">{c.title}</h3>
                  <p className="mt-5 max-w-xl leading-relaxed text-bone-2">{c.body}</p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
